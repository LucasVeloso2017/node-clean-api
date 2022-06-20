import { Collection } from 'mongodb'
import request from 'supertest'
import app from '../config/app'
import { sign } from 'jsonwebtoken'
import env from '../config/env'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

let survey: Collection
let accountMongo: Collection

const createFakeUser = async (): Promise<string> => {
  const user = await accountMongo.insertOne({
    name: 'any-name',
    email: 'valid_mail@mail.com',
    password: 'valid_password',
    role: 'admin'
  })
  const accessToken = sign({ id: user.insertedId.toString() }, env.secret)

  await accountMongo.updateOne({ _id: user.insertedId }, {
    $set: {
      accessToken
    }
  })
  return accessToken
}
const createFakeSurveys = async (): Promise<{id: string}> => {
  const data = await survey.insertOne(
    {
      question: 'any-quest',
      answers: [{
        image: 'any-image',
        answer: 'any-answer'
      }],
      date: new Date()
    }
  )

  return {
    id: data.insertedId.toString()
  }
}

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  beforeEach(async () => {
    survey = await MongoHelper.getCollection('survey')
    await survey.deleteMany({})
    accountMongo = await MongoHelper.getCollection('accounts')
    await accountMongo.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('PUT', () => {
    it('should be able to return 403 on save survey result no pass token', async () => {
      await request(app)
        .put('/api/surveys/any-id/results')
        .send({
          answer: 'any-answer'
        })
        .expect(403)
    })
    it('should be able to return 200 with valid token', async () => {
      const accessToken = await createFakeUser()
      const { id } = await createFakeSurveys()
      await request(app)
        .put(`/api/surveys/${id}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'any-answer'
        })
        .expect(200)
    })
  })
})

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
const createFakeSurveys = async (): Promise<void> => {
  await survey.insertMany([
    {
      question: 'any_quest',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      }],
      date: new Date()
    }
  ])
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

  describe('POST', () => {
    it('should be able to return 403 on no pass token', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'any-question',
          answers: [{
            image: 'any-image',
            answer: 'any-answer'
          }]
        })
        .expect(403)
    })
    it('should be able to return 204 with valid token', async () => {
      const accessToken = await createFakeUser()

      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'any-question',
          answers: [{
            image: 'any-image',
            answer: 'any-answer'
          }]
        })
        .expect(204)
    })
  })
  describe('GET', () => {
    it('should return 403 on LoadSurveys without token', async () => {
      await request(app)
        .get('/api/surveys')
        .send()
        .expect(403)
    })
    it('should return 200 on LoadSurveys with valid token', async () => {
      await createFakeSurveys()
      const accessToken = await createFakeUser()
      await request(app)
        .get('/api/surveys')
        .set('x-access-token', accessToken)
        .send()
        .expect(200)
    })
  })
})

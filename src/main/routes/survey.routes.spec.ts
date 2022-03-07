import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let mongo: Collection
let accountMongo: Collection

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  beforeEach(async () => {
    mongo = await MongoHelper.getCollection('survey')
    await mongo.deleteMany({})
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
})

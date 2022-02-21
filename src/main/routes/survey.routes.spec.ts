import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

let mongo: Collection

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  beforeEach(async () => {
    mongo = await MongoHelper.getCollection('survey')
    await mongo.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('POST', () => {
    it('should be able to return 204 on survey success', async () => {
      await request(app)
        .post('/api/surveys')
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

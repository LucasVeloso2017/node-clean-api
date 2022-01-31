import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

describe.skip('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  beforeEach(async () => {
    const mongo = await MongoHelper.getCollection('accounts')
    await mongo.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('should return an token on success', async () => {
    await request(app)
      .post('/api/signin')
      .send({
        email: 'any-email@mail.com',
        password: 'any-pass'
      })
      .expect(200)
  })
  it('should return 400 if request required fields was not informed', async () => {
    await request(app)
      .post('/api/signin')
      .send({
        email: 'any-email@mail.com'
      })
      .expect(400)
  })
  it('should return 400 if invalid email provided', async () => {
    await request(app)
      .post('/api/signin')
      .send({
        email: 'wrong-email',
        password: 'any-pass'
      })
      .expect(400)
  })
})

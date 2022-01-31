import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

describe('Signup Routes', () => {
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

  it('should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'any-name',
        email: 'any-email@mail.com',
        password: 'any-pass',
        passwordConfirmation: 'any-pass'
      })
      .expect(200)
  })

  it('should return 400 if request required fields was not informed', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        email: 'any-email@mail.com',
        password: 'any-pass',
        passwordConfirmation: 'any-pass'
      })
      .expect(400)
  })
  it('should return 400 if password and confirmPassword was diferent', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'any-name',
        email: 'any-email@mail.com',
        password: 'any-pass',
        passwordConfirmation: 'wrong-pass'
      })
      .expect(400)
  })
  it('should return 400 if invalid email provided', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'any-name',
        email: 'wrong-email',
        password: 'any-pass',
        passwordConfirmation: 'any-pass'
      })
      .expect(400)
  })
})

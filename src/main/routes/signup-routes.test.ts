import { hash } from 'bcrypt'
import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

let mongo: Collection
describe('Session Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  beforeEach(async () => {
    mongo = await MongoHelper.getCollection('accounts')
    await mongo.deleteMany({})
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('Signup', () => {
    it.only('should return an account on success', async () => {
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
  describe('Signin', () => {
    it('should return an token on success', async () => {
      await mongo.insertOne({
        name: 'any-name',
        email: 'any-email@mail.com',
        password: await hash('any-pass', 12)
      })

      await request(app)
        .post('/api/signin')
        .send({
          email: 'any-email@mail.com',
          password: 'any-pass'
        })
        .expect(200)
    })
    it('should return 401 on login fail', async () => {
      await request(app)
        .post('/api/signin')
        .send({
          email: 'any-email@mail.com',
          password: 'any-pass'
        })
        .expect(401)
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
})

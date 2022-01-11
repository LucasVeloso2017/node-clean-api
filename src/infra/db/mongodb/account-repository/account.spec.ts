import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account'

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    await MongoHelper.getCollection('accounts').deleteMany({})
  })
  it('should return an account on success', async () => {
    const sut = new AccountMongoRepository()

    const response = await sut.add({
      name: 'valid-name',
      email: 'validMail@mail.com',
      password: 'valid-pass'
    })

    expect(response).toBeTruthy()
    expect(response.id).toBeTruthy()
    expect(response.name).toBe('valid-name')
    expect(response.email).toBe('validMail@mail.com')
    expect(response.password).toBe('valid-pass')
  })
})

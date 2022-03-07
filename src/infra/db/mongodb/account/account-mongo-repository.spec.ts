import { Collection, ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

let collection: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    collection = await MongoHelper.getCollection('accounts')
    await collection.deleteMany({})
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
  it('should return an account on loadByEmail success', async () => {
    const sut = new AccountMongoRepository()
    await collection.insertOne({
      name: 'valid-name',
      email: 'validMail@mail.com',
      password: 'valid-pass'
    })

    const response = await sut.loadByEmail('validMail@mail.com')

    expect(response).toBeTruthy()
    expect(response.id).toBeTruthy()
    expect(response.name).toBe('valid-name')
    expect(response.email).toBe('validMail@mail.com')
    expect(response.password).toBe('valid-pass')
  })
  it('should return an null on loadByEmail failed', async () => {
    const sut = new AccountMongoRepository()
    const response = await sut.loadByEmail('validMail@mail.com')
    expect(response).toBeFalsy()
  })
  it('should update an account accessToken on updateAccessToken success', async () => {
    const sut = new AccountMongoRepository()
    const user = await collection.insertOne({
      name: 'valid-name',
      email: 'validMail@mail.com',
      password: 'valid-pass'
    })

    await sut.updateAccessToken(user.insertedId.toString(), 'any-token')

    const response = await collection.findOne({ email: 'validMail@mail.com' })

    expect(response).toBeTruthy()
    expect(response.accessToken).toBe('any-token')
  })
  it('should return an account on loadById success without role', async () => {
    const sut = new AccountMongoRepository()
    const user = await collection.insertOne({
      name: 'valid-name',
      email: 'validMail@mail.com',
      password: 'valid-pass',
      accessToken: 'any-token'
    })

    const response = await sut.loadById(user.insertedId.toString())

    expect(response).toBeTruthy()
    expect(response.id).toBeTruthy()
    expect(response.name).toBe('valid-name')
    expect(response.email).toBe('validMail@mail.com')
    expect(response.password).toBe('valid-pass')
  })
  it('should return an account on loadById success with role', async () => {
    const sut = new AccountMongoRepository()
    const user = await collection.insertOne({
      name: 'valid-name',
      email: 'validMail@mail.com',
      password: 'valid-pass',
      accessToken: 'any-token',
      role: 'admin'
    })

    const response = await sut.loadById(user.insertedId.toString(), 'admin')

    expect(response).toBeTruthy()
    expect(response.id).toBeTruthy()
    expect(response.name).toBe('valid-name')
    expect(response.email).toBe('validMail@mail.com')
    expect(response.password).toBe('valid-pass')
  })

  it('should return null on loadById with invalid role', async () => {
    const sut = new AccountMongoRepository()
    const user = await collection.insertOne({
      name: 'valid-name',
      email: 'validMail@mail.com',
      password: 'valid-pass',
      accessToken: 'any-token'
    })

    const response = await sut.loadById(user.insertedId.toString(), 'admin')

    expect(response).toBeFalsy()
  })
  it('should return an account on loadById success if user admin role', async () => {
    const sut = new AccountMongoRepository()
    const user = await collection.insertOne({
      name: 'valid-name',
      email: 'validMail@mail.com',
      password: 'valid-pass',
      accessToken: 'any-token',
      role: 'admin'
    })

    const response = await sut.loadById(user.insertedId.toString())

    expect(response).toBeTruthy()
    expect(response.id).toBeTruthy()
    expect(response.name).toBe('valid-name')
    expect(response.email).toBe('validMail@mail.com')
    expect(response.password).toBe('valid-pass')
  })
  it('should return an null on loadById failed', async () => {
    const sut = new AccountMongoRepository()
    const response = await sut.loadById(new ObjectId('6226464d1d4e1537377b38af').toString())
    expect(response).toBeFalsy()
  })
})

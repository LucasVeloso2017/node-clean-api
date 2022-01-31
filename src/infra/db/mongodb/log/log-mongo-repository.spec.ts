import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log-mongo-repository'

describe('Log Repository', () => {
  let conn: Collection
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    conn = await MongoHelper.getCollection('errors')
    await conn.deleteMany({})
  })
  it('should create an error log on success', async () => {
    const sut = new LogMongoRepository()
    await sut.logError('any-error')

    const count = await conn.countDocuments()
    expect(count).toBe(1)
  })
})

import { SurveyMongoRepository } from './survey-mongo.repository'
import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'

let collection: Collection

interface Sut {
  sut: SurveyMongoRepository
}

const makeSut = (): Sut => {
  const sut = new SurveyMongoRepository()

  return {
    sut
  }
}

describe('Survey Mogo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })
  beforeEach(async () => {
    collection = await MongoHelper.getCollection('survey')
    await collection.deleteMany({})
  })

  it('should return an account on success', async () => {
    const { sut } = makeSut()

    await sut.add({
      question: 'any-question',
      answers: [
        {
          image: 'any-image',
          answer: 'any-answer'
        },
        {
          image: 'any-image-2',
          answer: 'any-answer-2'
        }
      ]
    })

    const survey = await collection.findOne({ question: 'any-question' })

    expect(survey).toBeTruthy()
  })
})

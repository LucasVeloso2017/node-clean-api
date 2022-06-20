import { SurveyMongoRepository } from './survey-mongo-repository'
import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import MockDate from 'mockdate'

let collection: Collection

type Sut = {
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
    MockDate.set(new Date())
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
    MockDate.reset()
  })
  beforeEach(async () => {
    collection = await MongoHelper.getCollection('survey')
    await collection.deleteMany({})
  })

  describe('Insert', () => {
    it('should return an survey on success', async () => {
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
        ],
        date: new Date()
      })

      const survey = await collection.findOne({ question: 'any-question' })

      expect(survey).toBeTruthy()
    })
  })
  describe('Find All', () => {
    it('should load all surveys on sucess', async () => {
      const { sut } = makeSut()

      await collection.insertMany([
        {
          question: 'any_quest',
          answers: [{
            image: 'any_image',
            answer: 'any_answer'
          }],
          date: new Date()
        },
        {
          question: 'any_quest_2',
          answers: [{
            image: 'any_image_2',
            answer: 'any_answer_2'
          }],
          date: new Date()
        }
      ])

      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(2)
      expect(surveys[0].question).toBe('any_quest')
      expect(surveys[1].question).toBe('any_quest_2')
    })
    it('should load empty list of surveys ', async () => {
      const { sut } = makeSut()
      const surveys = await sut.loadAll()
      expect(surveys.length).toBe(0)
    })
  })
  describe('Find by id', () => {
    it('should load surveys by id on sucess', async () => {
      const { sut } = makeSut()

      const survey = await collection.insertOne(
        {
          question: 'any_quest',
          answers: [{
            image: 'any_image',
            answer: 'any_answer'
          }],
          date: new Date()
        }
      )

      const surveys = await sut.loadById(survey.insertedId.toString())
      expect(surveys).toBeTruthy()
    })
  })
})

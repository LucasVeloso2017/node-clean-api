import { SurveyResultMongoRepository } from './survey-result-mongo-repository'

import { MongoHelper } from '../helpers/mongo-helper'
import { SurveyModel } from '../../../../domain/models/survey'
import { AccountModel } from '../../../../domain/models/account'
import { Collection } from 'mongodb'
import MockDate from 'mockdate'

let surveyCollection: Collection
let surveyResultCollection: Collection
let accountCollection: Collection

const makeSurvey = async (): Promise<SurveyModel> => {
  const { insertedId } = await surveyCollection.insertOne({
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
  return {
    id: insertedId.toString(),
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
  }
}

const makeAccount = async (): Promise<AccountModel> => {
  const { insertedId } = await accountCollection.insertOne({
    name: 'valid-name',
    email: 'validMail@mail.com',
    password: 'valid-pass'
  })
  return {
    id: insertedId.toString(),
    name: 'valid-name',
    email: 'validMail@mail.com',
    password: 'valid-pass'
  }
}

type Sut = {
  sut: SurveyResultMongoRepository
}

const makeSut = (): Sut => {
  const sut = new SurveyResultMongoRepository()

  return {
    sut
  }
}

describe('Survey result Mogo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
    MockDate.set(new Date())
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
    MockDate.reset()
  })
  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('survey')
    await surveyCollection.deleteMany({})

    surveyResultCollection = await MongoHelper.getCollection('survey-result')
    await surveyResultCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('Save', () => {
    it('should add an survey result if its new on success', async () => {
      const { sut } = makeSut()

      const survey = await makeSurvey()
      const account = await makeAccount()

      const result = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })

      expect(result).toBeTruthy()
      expect(result.id).toBeTruthy()
      expect(result.accountId.toString()).toEqual(account.id)
      expect(result.surveyId.toString()).toEqual(survey.id)
    })
    it('should update an survey result if its not new on success', async () => {
      const { sut } = makeSut()

      const survey = await makeSurvey()
      const account = await makeAccount()
      await surveyResultCollection.insertOne({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[0].answer,
        date: new Date()
      })

      const result = await sut.save({
        surveyId: survey.id,
        accountId: account.id,
        answer: survey.answers[1].answer,
        date: new Date()
      })

      expect(result.answer).toEqual(survey.answers[1].answer)
      expect(result.accountId.toString()).toEqual(account.id)
      expect(result.surveyId.toString()).toEqual(survey.id)
    })
  })
})

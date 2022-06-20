import { DbSaveSurveyResult } from './db-save-survey-result'
import { SaveSurveyResultRepository } from './../../protocols/db/survey/save-survey-result-repository'

import MockDate from 'mockdate'
import { SaveSurveyResultModel } from '../../../domain/useCases/save-survey-result'
import { SurveyResultModel } from '../../../domain/models/survey-result'

const makeFakeSurveyResult: SurveyResultModel = {
  id: 'any-id',
  surveyId: 'any-survey-id',
  accountId: 'any-account-id',
  date: new Date(),
  answer: 'any-answer'
}

class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    return Promise.resolve(makeFakeSurveyResult)
  }
}

type Sut = {
  sut: DbSaveSurveyResult
  saveSurveyResultRepositoryStub: SaveSurveyResultRepository
}

const makeSut = (): Sut => {
  const saveSurveyResultRepositoryStub = new SaveSurveyResultRepositoryStub()
  const sut = new DbSaveSurveyResult(
    saveSurveyResultRepositoryStub
  )

  return {
    sut,
    saveSurveyResultRepositoryStub
  }
}

describe('DbSaveSurveyResult use case', () => {
  beforeAll(() => { MockDate.set(new Date()) })
  afterAll(() => { MockDate.reset() })

  it('should call SaveSurveyResultRepository with correct values', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()

    const surveySpy = jest.spyOn(saveSurveyResultRepositoryStub, 'save')

    await sut.save({
      accountId: 'any-account-id',
      surveyId: 'any-survey-id',
      answer: 'any-answer',
      date: new Date()
    })

    expect(surveySpy).toHaveBeenCalledWith({
      accountId: 'any-account-id',
      surveyId: 'any-survey-id',
      answer: 'any-answer',
      date: new Date()
    })
  })
  it('should throw if SaveSurveyResultRepository throws', async () => {
    const { sut, saveSurveyResultRepositoryStub } = makeSut()

    jest.spyOn(saveSurveyResultRepositoryStub, 'save').mockReturnValueOnce(Promise.reject(new Error()))

    const response = sut.save({
      accountId: 'any-account-id',
      surveyId: 'any-survey-id',
      answer: 'any-answer',
      date: new Date()
    })

    await expect(response).rejects.toThrow()
  })
  it('should return SaveSurveyResult on Success', async () => {
    const { sut } = makeSut()

    const result = await sut.save({
      accountId: 'any-account-id',
      surveyId: 'any-survey-id',
      answer: 'any-answer',
      date: new Date()
    })

    expect(result).toEqual(makeFakeSurveyResult)
  })
})

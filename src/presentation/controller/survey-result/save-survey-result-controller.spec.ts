import { SaveSurveyResult, SaveSurveyResultModel } from './../../../domain/useCases/save-survey-result'
import { InvalidParamError } from './../../errors/invalid-param-error'
import { forbidden, ok, serverError } from './../../helpers/http/http-helper'
import { HttpRequest } from './../../protocols/http'
import { SurveyModel } from '../../../domain/models/survey'
import { LoadSurveyById } from './../../../domain/useCases/load-survey-by-id'
import { SaveSurveyResultController } from './save-survey-result-controller'
import mockDate from 'mockdate'
import { SurveyResultModel } from '../../../domain/models/survey-result'

const makeFakeRequest: HttpRequest = {
  params: {
    surveyId: 'any-survey-id'
  },
  body: {
    answer: 'any-answer'
  },
  accountId: 'any-account-id'
}

class LoadSurveyByIdStub implements LoadSurveyById {
  async loadById (id: string): Promise<SurveyModel> {
    return Promise.resolve({
      id: 'any-survey-id',
      question: 'any-question',
      answers: [{
        answer: 'any-answer'
      }],
      date: new Date()
    })
  }
}
class SaveSurveyResultStub implements SaveSurveyResult {
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    return Promise.resolve({
      id: 'any-id',
      accountId: 'any-account-id',
      surveyId: 'any-survey-id',
      answer: 'any-answer',
      date: new Date()
    })
  }
}

type Sut = {
  loadSurveyByIdStub: LoadSurveyById
  sut: SaveSurveyResultController
  saveSurveyResultStub: SaveSurveyResult
}

const makeSut = (): Sut => {
  const loadSurveyByIdStub = new LoadSurveyByIdStub()
  const saveSurveyResultStub = new SaveSurveyResultStub()
  const sut = new SaveSurveyResultController(loadSurveyByIdStub, saveSurveyResultStub)

  return {
    sut,
    loadSurveyByIdStub,
    saveSurveyResultStub
  }
}

describe('SaveSurveyResult controller', () => {
  beforeAll(() => mockDate.set(new Date()))
  afterAll(() => mockDate.reset())
  it('should call LoadSurveyById with correct values', async () => {
    const { loadSurveyByIdStub, sut } = makeSut()

    const loadSpy = jest.spyOn(loadSurveyByIdStub, 'loadById')

    await sut.handle(makeFakeRequest)
    expect(loadSpy).toBeCalledWith('any-survey-id')
  })
  it('should return 403 if LoadSurveyById returns null', async () => {
    const { loadSurveyByIdStub, sut } = makeSut()

    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.resolve(null))

    const response = await sut.handle(makeFakeRequest)
    expect(response).toEqual(forbidden(new InvalidParamError('surveyId')))
  })
  it('should return 500 if LoadSurveyById throws', async () => {
    const { loadSurveyByIdStub, sut } = makeSut()

    jest.spyOn(loadSurveyByIdStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))

    const response = await sut.handle(makeFakeRequest)
    expect(response).toEqual(serverError(new Error()))
  })
  it('should return 500 if Answer incorrect ', async () => {
    const { sut } = makeSut()

    const response = await sut.handle({
      body: {
        answer: 'wrong_answer'
      },
      params: {
        surveyId: 'any-id'
      }
    })
    expect(response).toEqual(forbidden(new InvalidParamError('answer')))
  })
  it('should call SaveSurveyResult with correct values', async () => {
    const { saveSurveyResultStub, sut } = makeSut()

    const saveSpy = jest.spyOn(saveSurveyResultStub, 'save')

    await sut.handle(makeFakeRequest)
    expect(saveSpy).toBeCalledWith({
      surveyId: 'any-survey-id',
      accountId: 'any-account-id',
      answer: 'any-answer',
      date: new Date()
    })
  })
  it('should return 500 if SaveSurveyResult throws', async () => {
    const { sut, saveSurveyResultStub } = makeSut()

    jest.spyOn(saveSurveyResultStub, 'save').mockReturnValueOnce(Promise.reject(new Error()))

    const response = await sut.handle(makeFakeRequest)
    expect(response).toEqual(serverError(new Error()))
  })
  it('should return 200 on success', async () => {
    const { sut } = makeSut()

    const response = await sut.handle(makeFakeRequest)
    expect(response).toEqual(ok({
      id: 'any-id',
      accountId: 'any-account-id',
      surveyId: 'any-survey-id',
      answer: 'any-answer',
      date: new Date()
    }))
  })
})

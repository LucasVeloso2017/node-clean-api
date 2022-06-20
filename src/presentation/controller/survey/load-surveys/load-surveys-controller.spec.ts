import { LoadSurveys } from './../../../../domain/useCases/load-surveys'
import { SurveyModel } from './../../../../domain/models/survey'
import { LoadSurveysController } from './load-surveys-controller'
import MockDate from 'mockdate'
import { noContent, ok, serverError } from '../../../helpers/http/http-helper'

const makeFakeSurveys: SurveyModel[] = [
  {
    id: 'any-id',
    date: new Date(),
    question: 'any-question',
    answers: [{
      answer: 'any-answer',
      image: 'any-image'
    }]
  }
]

class LoadSurveysStub implements LoadSurveys {
  async load (): Promise<SurveyModel[]> {
    return Promise.resolve(makeFakeSurveys)
  }
}

type Sut = {
  sut: LoadSurveysController
  loadSurveysStub: LoadSurveys
}

const makeSut = (): Sut => {
  const loadSurveysStub = new LoadSurveysStub()
  const sut = new LoadSurveysController(loadSurveysStub)
  return {
    sut,
    loadSurveysStub
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  it('should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = makeSut()

    const loadSpy = jest.spyOn(loadSurveysStub, 'load')

    await sut.handle({})

    expect(loadSpy).toHaveBeenCalled()
  })
  it('should  return 200 on success', async () => {
    const { sut } = makeSut()

    const surveys = await sut.handle({})

    expect(surveys).toEqual(ok(makeFakeSurveys))
  })
  it('should  return 204 if loadSurveys return empty', async () => {
    const { sut, loadSurveysStub } = makeSut()
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(Promise.resolve([]))

    const surveys = await sut.handle({})

    expect(surveys).toEqual(noContent())
  })
  it('should return 500 if loadSurveys throws', async () => {
    const { sut, loadSurveysStub } = makeSut()

    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(Promise.reject(new Error()))

    const promise = await sut.handle({})

    expect(promise).toEqual(serverError(new Error()))
  })
})

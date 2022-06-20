import MockDate from 'mockdate'
import { DbLoadSurveys } from './db-load-surveys'
import { SurveyModel } from '../../../domain/models/survey'
import { LoadSurveysRepository } from './../../protocols/db/survey/load-surveys-repository'

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

class LoadSurveysRepositoryStub implements LoadSurveysRepository {
  async loadAll (): Promise<SurveyModel[]> {
    return Promise.resolve(makeFakeSurveys)
  }
}

type Sut = {
  sut: DbLoadSurveys
  loadSurveysRepositoryStub: LoadSurveysRepository
}

const makeSut = (): Sut => {
  const loadSurveysRepositoryStub = new LoadSurveysRepositoryStub()
  const sut = new DbLoadSurveys(loadSurveysRepositoryStub)

  return {
    sut,
    loadSurveysRepositoryStub
  }
}

describe('Load Surveys', () => {
  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())

  it('should call LoadSurveysRepository', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveysRepositoryStub, 'loadAll')
    await sut.load()
    expect(loadSpy).toHaveBeenCalled()
  })
  it('should be return a list surveys on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load()
    expect(surveys).toEqual(makeFakeSurveys)
  })
  it('should throw if loadSurveysRepo throws', async () => {
    const { sut, loadSurveysRepositoryStub } = makeSut()
    jest.spyOn(loadSurveysRepositoryStub, 'loadAll').mockReturnValueOnce(Promise.reject(new Error()))
    const surveys = sut.load()
    await expect(surveys).rejects.toThrow()
  })
})

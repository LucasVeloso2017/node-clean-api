import { DbLoadSurveyById } from './db-load-survey-by-id'
import { LoadSurveyByIdRepository } from './../../protocols/db/survey/load-survey-by-id'
import MockDate from 'mockdate'
import { SurveyModel } from '../../../domain/models/survey'

const makeFakeSurvey: SurveyModel = {
  id: 'any-id',
  date: new Date(),
  question: 'any-question',
  answers: [{
    answer: 'any-answer',
    image: 'any-image'
  }]
}

class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
  async loadById (id: string): Promise<SurveyModel> {
    return Promise.resolve(makeFakeSurvey)
  }
}

type Sut = {
  sut: DbLoadSurveyById
  loadSurveyByIdRepositoryStub: LoadSurveyByIdRepository
}

const makeSut = (): Sut => {
  const loadSurveyByIdRepositoryStub = new LoadSurveyByIdRepositoryStub()
  const sut = new DbLoadSurveyById(loadSurveyByIdRepositoryStub)

  return {
    sut,
    loadSurveyByIdRepositoryStub
  }
}

describe('Db Load Survey by id', () => {
  beforeAll(() => MockDate.set(new Date()))
  afterAll(() => MockDate.reset())

  it('should call LoadSurveyByIdRepository', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById')
    await sut.loadById('any_id')
    expect(loadSpy).toHaveBeenCalledWith('any_id')
  })
  it('should return null if null id provided ', async () => {
    const { sut } = makeSut()
    const surveys = await sut.loadById(null)
    expect(surveys).toBeNull()
  })
  it('should throw if LoadSurveyByIdRepository throws', async () => {
    const { sut, loadSurveyByIdRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyByIdRepositoryStub, 'loadById').mockReturnValueOnce(Promise.reject(new Error()))
    const surveys = sut.loadById('any_id')
    await expect(surveys).rejects.toThrow()
  })
  it('should be return a survey on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.loadById('any_id')
    expect(surveys).toEqual(makeFakeSurvey)
  })
})

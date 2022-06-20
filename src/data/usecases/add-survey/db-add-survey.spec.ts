import { AddSurvey } from './../../../domain/useCases/add-survey'
import { AddSurveyModel } from '../../../domain/useCases/add-survey'
import { AddSurveyRepository } from './../../protocols/db/survey/add-survey-repository'
import { DbAddSurvey } from './db-add-survey'
import MockDate from 'mockdate'
class AddSurveyRepositoryStub implements AddSurveyRepository {
  async add (data: AddSurveyModel): Promise<void> {
    return Promise.resolve()
  }
}

type Sut = {
  sut: AddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}

const makeSut = (): Sut => {
  const addSurveyRepositoryStub = new AddSurveyRepositoryStub()
  const sut = new DbAddSurvey(
    addSurveyRepositoryStub
  )

  return {
    sut,
    addSurveyRepositoryStub
  }
}

describe('DbAddSurvey use case', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })
  it('should cal addSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()

    const surveySpy = jest.spyOn(addSurveyRepositoryStub, 'add')

    await sut.add({
      question: 'any-question',
      answers: [{
        image: 'any-image',
        answer: 'any-aswer'
      }],
      date: new Date()
    })

    expect(surveySpy).toHaveBeenCalledWith({
      question: 'any-question',
      answers: [{
        image: 'any-image',
        answer: 'any-aswer'
      }],
      date: new Date()
    })
  })
  it('should throw if addSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut()

    jest.spyOn(addSurveyRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))

    const response = sut.add({
      question: 'any-question',
      answers: [{
        image: 'any-image',
        answer: 'any-aswer'
      }],
      date: new Date()
    })

    await expect(response).rejects.toThrow()
  })
})

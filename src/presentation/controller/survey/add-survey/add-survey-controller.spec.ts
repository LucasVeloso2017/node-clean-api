import { noContent } from './../../../helpers/http/http-helper'
import { AddSurvey, AddSurveyModel } from './../../../../domain/useCases/add-survey'
import { ServerError } from '../../../errors/server-error'
import { badRequest } from '../../../helpers/http/http-helper'
import { Controller } from '../../../protocols/controller'
import { Validation } from './../../../protocols/validation'
import { AddSurveyController } from './add-survey-controller'

class ValidationStub implements Validation {
  validate (input: any): Error {
    return null
  }
}

class AddSurveyStub implements AddSurvey {
  async add (data: AddSurveyModel): Promise<void> {
    return Promise.resolve()
  }
}

interface Sut {
  validationStub: Validation
  sut: Controller
  addSurveyStub: AddSurvey
}

const makeSut = (): Sut => {
  const validationStub = new ValidationStub()
  const addSurveyStub = new AddSurveyStub()
  const sut = new AddSurveyController(
    validationStub,
    addSurveyStub
  )

  return {
    validationStub,
    sut,
    addSurveyStub
  }
}

describe('Add survey controller', () => {
  it('should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()

    const validationSpy = jest.spyOn(validationStub, 'validate')

    await sut.handle({
      body: {
        question: '',
        answers: [{
          image: 'any-image',
          answer: 'any-aswer'
        }]
      }
    })

    expect(validationSpy).toHaveBeenCalledWith({
      question: '',
      answers: [{
        image: 'any-image',
        answer: 'any-aswer'
      }]
    })
  })
  it('should return 400 if validation error', async () => {
    const { sut, validationStub } = makeSut()

    const error = new Error()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(error)

    const result = await sut.handle({
      body: {
        question: '',
        answers: [{
          image: 'any-image',
          answer: 'any-aswer'
        }]
      }
    })

    expect(result).toEqual(badRequest(error))
  })
  it('should call AddSurvey with correct values', async () => {
    const { sut, addSurveyStub } = makeSut()

    const addSpy = jest.spyOn(addSurveyStub, 'add')

    await sut.handle({
      body: {
        question: '',
        answers: [{
          image: 'any-image',
          answer: 'any-aswer'
        }]
      }
    })

    expect(addSpy).toHaveBeenCalledWith({
      question: '',
      answers: [{
        image: 'any-image',
        answer: 'any-aswer'
      }]
    })
  })
  it('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveyStub } = makeSut()

    jest.spyOn(addSurveyStub, 'add').mockImplementationOnce(() => { throw new Error() })

    const response = await sut.handle({
      body: {
        question: '',
        answers: [{
          image: 'any-image',
          answer: 'any-aswer'
        }]
      }
    })

    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError(new Error().stack))
  })
  it('should 204 on success', async () => {
    const { sut } = makeSut()

    const result = await sut.handle({
      body: {
        question: '',
        answers: [{
          image: 'any-image',
          answer: 'any-aswer'
        }]
      }
    })

    expect(result).toEqual(noContent())
  })
})

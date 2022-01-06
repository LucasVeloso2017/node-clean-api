import { Controller } from './../protocols/controller'
import { InvalidParamError } from '../errors/invalid-param-error'
import { MissingParamError } from '../errors/missing-param-error'
import { EmailValidator } from '../protocols/email-validator'
import { SignupController } from './signup'

class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

interface SutType{
  sut: Controller
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutType => {
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignupController(emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('Signup Controller', (): void => {
  it('Should return 400 with no name is provided', () => {
    const { sut } = makeSut()
    const response = sut.handle({
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any-password'
      }
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('name'))
  })
  it('Should return 400 with no email is provided', () => {
    const { sut } = makeSut()
    const response = sut.handle({
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any-password'
      }
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('email'))
  })
  it('Should return 400 with no password is provided', () => {
    const { sut } = makeSut()
    const response = sut.handle({
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        passwordConfirmation: 'any-password'
      }
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('password'))
  })
  it('Should return 400 with no passwordConfirmation is provided', () => {
    const { sut } = makeSut()
    const response = sut.handle({
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password'

      }
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('passwordConfirmation'))
  })
  it('Should return 400 with email is not valid provided', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const response = sut.handle({
      body: {
        name: 'any_name',
        email: 'invalid_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any-password'
      }
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamError('email'))
  })
  it('Should return 400 with email is not valid provided', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const response = sut.handle({
      body: {
        name: 'any_name',
        email: 'invalid_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any-password'
      }
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamError('email'))
  })

  it('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    sut.handle({
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any-password'
      }
    })

    expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
  })
})

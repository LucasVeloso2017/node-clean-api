import { Controller, EmailValidator } from '../protocols'
import { SignupController } from './signup'
import { InvalidParamError, MissingParamError, ServerError } from '../errors'

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
  it('1. Should return 400 if no name is provided', () => {
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
  it('2. Should return 400 if no email is provided', () => {
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
  it('3. Should return 400 if no password is provided', () => {
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
  it('4. Should return 400 if no passwordConfirmation is provided', () => {
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
  it('5. Should return 400 if passwordConfirmation failed', () => {
    const { sut } = makeSut()
    const response = sut.handle({
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'invalid-password'
      }
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })
  it('6. Should return 400 if email is not valid provided', () => {
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
  it('8. Should call EmailValidator with correct email', () => {
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
  it('8. Should return 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })

    const response = sut.handle({
      body: {
        name: 'any_name',
        email: 'invalid_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any-password'
      }
    })

    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError())
  })
})

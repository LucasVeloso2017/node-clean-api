import { Controller } from '../../../protocols/controller'
import { badRequest, ok, unauthorized } from '../../../helpers/http/http-helper'
import { LoginController } from './login-controller'
import { ServerError } from '../../../errors/server-error'
import { Authentication, AuthenticationModel } from '../../../../domain/useCases/authentication'
import { Validation } from '../../../protocols/validation'
import { MissingParamError } from '../../../errors/missing-param-error'

class AuthenticationStub implements Authentication {
  async auth (input: AuthenticationModel): Promise<string> {
    return Promise.resolve('any-token')
  }
}
class ValidationtStub implements Validation {
  validate (input: any): Error {
    return null
  }
}
interface Sut {
  sut: Controller
  authenticationStub: Authentication
  validationStub: Validation
}

const makeSut = (): Sut => {
  const authenticationStub = new AuthenticationStub()
  const validationStub = new ValidationtStub()
  const sut = new LoginController(
    validationStub,
    authenticationStub
  )
  return {
    sut,
    validationStub,
    authenticationStub
  }
}

describe('Login Controller', () => {
  it('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()

    const athSpy = jest.spyOn(authenticationStub, 'auth')

    await sut.handle({
      body: {
        email: 'valid_email@email.com',
        password: 'any_password'
      }
    })

    expect(athSpy).toBeCalledWith({
      email: 'valid_email@email.com',
      password: 'any_password'
    })
  })
  it('Should return 401 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()

    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.resolve(null))

    const response = await sut.handle({
      body: {
        email: 'valid_email@email.com',
        password: 'any_password'
      }
    })

    expect(response).toEqual(unauthorized())
  })
  it('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()

    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => { throw new Error() })

    const response = await sut.handle({
      body: {
        email: 'valid_email@email.com',
        password: 'any_password'
      }
    })

    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError(new Error().stack))
  })
  it('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({
      body: {
        email: 'valid_email@email.com',
        password: 'valid_password'
      }
    })
    expect(response).toEqual(ok({ token: 'any-token' }))
  })
  it('should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')

    const dto = {
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password',
      passwordConfirmation: 'valid_password'
    }

    await sut.handle({
      body: dto
    })

    expect(validateSpy).toHaveBeenCalledWith(dto)
  })
  it('Should return 400 if validation error', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValue(new MissingParamError('any-field'))
    const response = await sut.handle({
      body: {
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    })

    expect(response).toEqual(badRequest(new MissingParamError('any-field')))
  })
})

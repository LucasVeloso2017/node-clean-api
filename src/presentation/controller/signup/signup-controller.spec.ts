import { EmailInUseError } from './../../errors/email-in-use-error'

import { AccountModel } from '../../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../../domain/useCases/add-account'
import { MissingParamError } from '../../errors/missing-param-error'
import { ServerError } from '../../errors/server-error'
import { badRequest, forbidden } from '../../helpers/http/http-helper'
import { Validation } from '../../protocols/validation'
import { Controller } from '../../protocols/controller'
import { SignupController } from './signup-controller'
import { Authentication, AuthenticationModel } from '../../../domain/useCases/authentication'

class AuthenticationStub implements Authentication {
  async auth (input: AuthenticationModel): Promise<string> {
    return Promise.resolve('any-token')
  }
}
class AddAccountStub implements AddAccount {
  async add (account: AddAccountModel): Promise<AccountModel> {
    return Promise.resolve({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })
  }
}
class ValidationtStub implements Validation {
  validate (input: any): Error {
    return null
  }
}
interface SutType{
  sut: Controller
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const makeSut = (): SutType => {
  const authenticationStub = new AuthenticationStub()
  const addAccountStub = new AddAccountStub()
  const validationStub = new ValidationtStub()
  const sut = new SignupController(
    addAccountStub,
    validationStub,
    authenticationStub
  )

  return {
    sut,
    authenticationStub,
    addAccountStub,
    validationStub
  }
}

describe('Signup Controller', (): void => {
  it('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    await sut.handle({
      body: {
        name: 'any_name',
        email: 'valid_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    })

    expect(addSpy).toBeCalledWith({
      name: 'any_name',
      email: 'valid_email@email.com',
      password: 'any_password'
    })
  })
  it('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => { throw new Error() })

    const response = await sut.handle({
      body: {
        name: 'any_name',
        email: 'valid_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    })

    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError(new Error().stack))
  })
  it('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(Promise.resolve(null))

    const response = await sut.handle({
      body: {
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    })

    expect(response.statusCode).toBe(403)
    expect(response).toEqual(forbidden(new EmailInUseError()))
  })
  it('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({
      body: {
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    })

    expect(response.statusCode).toBe(200)
    expect(response.body.token).toBe('any-token')
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
})

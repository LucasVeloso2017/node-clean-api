
import { AccountModel } from '../../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../../domain/useCases/add-account'
import { MissingParamError } from '../../errors/missing-param-error'
import { ServerError } from '../../errors/server-error'
import { badRequest } from '../../helpers/http/http-helper'
import { Validation } from '../../protocols/validation'
import { Controller } from '../../protocols/controller'
import { SignupController } from './signup-controller'

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
}

const makeSut = (): SutType => {
  const addAccountStub = new AddAccountStub()
  const validationStub = new ValidationtStub()
  const sut = new SignupController(
    addAccountStub,
    validationStub
  )

  return {
    sut,
    addAccountStub,
    validationStub
  }
}

describe('Signup Controller', (): void => {
  it('10. Should call AddAccount with correct values', async () => {
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
  it('11. Should return 500 if AddAccount throws', async () => {
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
  it('11. Should return 200 if valid data is provided', async () => {
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

import { LoadAccountByToken } from './../../domain/useCases/load-account-by-token'
import { AuthMiddleware } from './auth-middleware'
import { AccessDeniedError } from './../errors/access-denied-error'
import { forbidden, ok, serverError } from './../helpers/http/http-helper'
import { Middleware } from './../protocols/middleware'
import { AccountModel } from '../../domain/models/account'

class LoadAccountByTokenStub implements LoadAccountByToken {
  async load (accessToken: string, role?: string): Promise<AccountModel> {
    return Promise.resolve({
      id: 'any-id',
      email: 'any-mail@mail.com',
      name: 'any-name',
      password: 'hash-pass'
    })
  }
}

interface Sut {
  sut: Middleware
  loadAccountByTokenStub: LoadAccountByToken
}

const makeSut = (role?: string): Sut => {
  const loadAccountByTokenStub = new LoadAccountByTokenStub()
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)

  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('Auth Middleware', () => {
  it('Should return 403 if no x-access-token exists in request.header', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({})
    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })
  it('Should call loadAccountByToken with correct accessToken', async () => {
    const role = 'any_role'
    const { sut, loadAccountByTokenStub } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle({
      headers: {
        'x-access-token': 'any_token'
      }
    })
    expect(loadSpy).toHaveBeenCalledWith('any_token', role)
  })
  it('Should return 403 if loadAccountByToken returns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(Promise.resolve(null))

    const response = await sut.handle({
      headers: {
        'x-access-token': 'any_token'
      }
    })

    expect(response).toEqual(forbidden(new AccessDeniedError()))
  })
  it('Should return 200 if loadAccountByToken returns ann account', async () => {
    const { sut } = makeSut()
    const response = await sut.handle({
      headers: {
        'x-access-token': 'any_token'
      }
    })

    expect(response).toEqual(ok({ accountId: 'any-id' }))
  })
  it('Should return 500 if loadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut()

    const err = new Error()

    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(Promise.reject(err))

    const response = await sut.handle({
      headers: {
        'x-access-token': 'any_token'
      }
    })

    expect(response).toEqual(serverError(err))
  })
})

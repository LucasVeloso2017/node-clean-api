import { Authentication } from '../../../domain/useCases/authentication'
import { Comparer } from '../../protocols/criptography/comparer'
import { Encrypter } from '../../protocols/criptography/encrypter'
import { LoadAccountByEmailRepository } from '../../protocols/db/account/load-account-by-email-repository'
import { UpdateAccessTokenRepository } from '../../protocols/db/account/update-access-token-repository'
import { AccountModel } from './../../../domain/models/account'
import { DbAuthentication } from './db-authentication'

class LoadAccountByEmaiLRepositoryStub implements LoadAccountByEmailRepository {
  async loadByEmail (email: string): Promise<AccountModel> {
    return Promise.resolve({
      email: 'any-email@mail.com',
      name: 'any-name',
      password: 'encrypted-pass',
      id: 'any-id'
    })
  }
}

class ComparerStub implements Comparer {
  async comparer (value: string, hashedValue: string): Promise<boolean> {
    return Promise.resolve(true)
  }
}

class TokenGeneratorStub implements Encrypter {
  async encrypt (id: string): Promise<string> {
    return Promise.resolve('any-token')
  }
}
class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
  async updateAccessToken (id: string, token: string): Promise<void> {
    return Promise.resolve()
  }
}

interface Sut {
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  sut: Authentication
  comparerStub: Comparer
  tokenGeneratorStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): Sut => {
  const loadAccountByEmailRepositoryStub = new LoadAccountByEmaiLRepositoryStub()
  const comparerStub = new ComparerStub()
  const tokenGeneratorStub = new TokenGeneratorStub()
  const updateAccessTokenRepositoryStub = new UpdateAccessTokenRepositoryStub()
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    comparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  )
  return {
    loadAccountByEmailRepositoryStub,
    sut,
    comparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication use Case', () => {
  it('should call loadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')

    await sut.auth({
      email: 'any_mail@mail.com',
      password: 'any_pass'
    })

    expect(loadSpy).toHaveBeenCalledWith('any_mail@mail.com')
  })
  it('should throw if loadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.reject(new Error()))

    const response = sut.auth({
      email: 'any_mail@mail.com',
      password: 'any_pass'
    })

    await expect(response).rejects.toThrow()
  })
  it('should return null if loadAccountByEmailRepository return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValue(null)

    const response = await sut.auth({
      email: 'any_mail@mail.com',
      password: 'any_pass'
    })

    expect(response).toBeNull()
  })
  it('should call hashComparer with correct values', async () => {
    const { sut, comparerStub } = makeSut()

    const compareSpy = jest.spyOn(comparerStub, 'comparer')

    await sut.auth({
      email: 'any_mail@mail.com',
      password: 'any_pass'
    })

    expect(compareSpy).toHaveBeenCalledWith('any_pass', 'encrypted-pass')
  })
  it('should throw if hashComparer throws', async () => {
    const { sut, comparerStub } = makeSut()

    jest.spyOn(comparerStub, 'comparer').mockReturnValueOnce(Promise.reject(new Error()))

    const response = sut.auth({
      email: 'any_mail@mail.com',
      password: 'any_pass'
    })

    await expect(response).rejects.toThrow()
  })
  it('should return null if hashComparer return false', async () => {
    const { sut, comparerStub } = makeSut()

    jest.spyOn(comparerStub, 'comparer').mockReturnValueOnce(Promise.resolve(false))

    const response = await sut.auth({
      email: 'any_mail@mail.com',
      password: 'any_pass'
    })

    expect(response).toBeNull()
  })
  it('should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()

    const compareSpy = jest.spyOn(tokenGeneratorStub, 'encrypt')

    await sut.auth({
      email: 'any_mail@mail.com',
      password: 'any_pass'
    })

    expect(compareSpy).toHaveBeenCalledWith('any-id')
  })
  it('should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()

    jest.spyOn(tokenGeneratorStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))

    const response = sut.auth({
      email: 'any_mail@mail.com',
      password: 'any_pass'
    })

    await expect(response).rejects.toThrow()
  })
  it('should return access token if usecase was correctly', async () => {
    const { sut } = makeSut()

    const response = await sut.auth({
      email: 'any-email@mail.com',
      password: 'any-pas'
    })

    expect(response).toBe('any-token')
  })
  it('should call UpdateAccessToken with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()

    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')

    await sut.auth({
      email: 'any_mail@mail.com',
      password: 'any_pass'
    })

    expect(updateSpy).toHaveBeenCalledWith('any-id', 'any-token')
  })
})

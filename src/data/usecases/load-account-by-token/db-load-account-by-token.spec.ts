import { LoadAccountByTokenRepository } from './../../protocols/db/account/load-account-by-token-repository'
import { DbLoadAccountByToken } from './db-load-account-by-token'
import { Decrypter } from './../../protocols/criptography/decrypter'
import { AccountModel } from '../../../domain/models/account'

class DecrypterStub implements Decrypter {
  decrypt (value: string): string {
    return 'any-value'
  }
}

class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
  async loadByToken (accessToken: string, role?: string): Promise<AccountModel> {
    return Promise.resolve({
      id: 'any-id',
      email: 'valid_mail@mail.com',
      name: 'any-name',
      password: 'hashed_password'
    })
  }
}

interface Sut {
  sut: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const makeSut = (): Sut => {
  const loadAccountByTokenRepositoryStub = new LoadAccountByTokenRepositoryStub()
  const decrypterStub = new DecrypterStub()
  const sut = new DbLoadAccountByToken(
    decrypterStub,
    loadAccountByTokenRepositoryStub
  )
  return {
    sut,
    decrypterStub,
    loadAccountByTokenRepositoryStub
  }
}

describe('Load Account by Token use case', () => {
  it('should call decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()
    const decrypterSpy = jest.spyOn(decrypterStub, 'decrypt')
    await sut.load('any-token', 'any-role')
    expect(decrypterSpy).toHaveBeenCalledWith('any-token')
  })
  it('should throw if decrypter throws', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.load('any-token', 'any-role')
    await expect(promise).rejects.toThrow()
  })
  it('should return null if decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()
    jest.spyOn(decrypterStub, 'decrypt').mockReturnValueOnce(null)
    const response = await sut.load('any-token', 'any-role')
    expect(response).toBeNull()
  })
  it('should call loadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()

    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')

    await sut.load('any-token', 'any-role')

    expect(loadByTokenSpy).toHaveBeenCalledWith('any-value', 'any-role')
  })
  it('should throw if loadAccountByTokenRepository throws', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.load('any-token', 'any-role')
    await expect(promise).rejects.toThrow()
  })
  it('should return null if loadAccountByTokenRepository returns null', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockReturnValueOnce(Promise.resolve(null))
    const response = await sut.load('any-token', 'any-role')
    expect(response).toBeNull()
  })
  it('should return an account on success', async () => {
    const { sut } = makeSut()

    const response = await sut.load('any-token', 'any-role')

    expect(response).toEqual({
      id: 'any-id',
      email: 'valid_mail@mail.com',
      name: 'any-name',
      password: 'hashed_password'
    })
  })
})

import { AccountModel } from '../../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../../domain/useCases/add-account'
import { Hasher } from '../../protocols/criptography/hasher'
import { AddAccountRepository } from '../../protocols/db/account/add-account-repository'
import { LoadAccountByEmailRepository } from '../../protocols/db/account/load-account-by-email-repository'
import { DbAddAccount } from './db-add-account'

class EncrypterStub implements Hasher {
  async hash (value: string): Promise<string> {
    return Promise.resolve('encrypted-password')
  }
}
class AddAccountRepositoryStub implements AddAccountRepository {
  async add (acc: AddAccountModel): Promise<AccountModel> {
    return Promise.resolve({
      id: 'valid-id',
      name: 'valid-name',
      email: 'valid-email',
      password: 'encrypted-password'
    })
  }
}
class LoadAccountByEmaiLRepositoryStub implements LoadAccountByEmailRepository {
  async loadByEmail (email: string): Promise<AccountModel> {
    return Promise.resolve(null)
    // return Promise.resolve({
    //   email: 'any-email@mail.com',
    //   name: 'any-name',
    //   password: 'encrypted-pass',
    //   id: 'any-id'
    // })
  }
}

interface Sut {
  encrypterStub: Hasher
  sut: AddAccount
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): Sut => {
  const loadAccountByEmailRepositoryStub = new LoadAccountByEmaiLRepositoryStub()
  const addAccountRepositoryStub = new AddAccountRepositoryStub()
  const encrypterStub = new EncrypterStub()

  const sut = new DbAddAccount(
    encrypterStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  )
  return {
    encrypterStub,
    sut,
    loadAccountByEmailRepositoryStub,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount UseCase', () => {
  it('Should call Encrypter with correct password', async () => {
    const { encrypterStub, sut } = makeSut()

    const encryptSpy = jest.spyOn(encrypterStub, 'hash')

    await sut.add({
      name: 'valid-name',
      email: 'valid@mail.com',
      password: 'valid-password'
    })

    expect(encryptSpy).toHaveBeenCalledWith('valid-password')
  })
  it('Should throw if encrypterStub throws', async () => {
    const { encrypterStub, sut } = makeSut()

    jest.spyOn(encrypterStub, 'hash').mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.add({
      name: 'valid-name',
      email: 'valid@mail.com',
      password: 'valid-password'
    })

    await expect(promise).rejects.toThrow()
  })
  it('Should call AddAccountRepository with correct values', async () => {
    const { addAccountRepositoryStub, sut } = makeSut()

    const addAccountRepoSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add({
      name: 'valid-name',
      email: 'valid@mail.com',
      password: 'valid-password'
    })

    expect(addAccountRepoSpy).toHaveBeenCalledWith({
      name: 'valid-name',
      email: 'valid@mail.com',
      password: 'encrypted-password'
    })
  })
  it('Should throw if addAccountRepository throws', async () => {
    const { addAccountRepositoryStub, sut } = makeSut()

    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))

    const promise = sut.add({
      name: 'valid-name',
      email: 'valid@mail.com',
      password: 'valid-password'
    })

    await expect(promise).rejects.toThrow()
  })
  it('Should return success on success', async () => {
    const { sut } = makeSut()

    const response = await sut.add({
      name: 'valid-name',
      email: 'valid@mail.com',
      password: 'valid-password'
    })

    expect(response).toEqual({
      id: 'valid-id',
      name: 'valid-name',
      email: 'valid-email',
      password: 'encrypted-password'
    })
  })
  it('should call loadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')

    await sut.add({
      name: 'valid-name',
      email: 'valid@mail.com',
      password: 'valid-password'
    })

    expect(loadSpy).toHaveBeenCalledWith('valid@mail.com')
  })
  it('Should return null if loadAccountByEmailRepository not return null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.resolve({
      email: 'any-email@mail.com',
      name: 'any-name',
      password: 'encrypted-pass',
      id: 'any-id'
    }))

    const response = await sut.add({
      name: 'valid-name',
      email: 'valid@mail.com',
      password: 'valid-password'
    })

    expect(response).toBeNull()
  })
})

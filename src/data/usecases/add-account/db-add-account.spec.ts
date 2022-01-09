import { AccountModel } from '../../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../../domain/useCases/add-account'
import { AddAccountRepository } from '../../protocols/add-account-repository'
import { Encrypter } from './../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

class EncrypterStub implements Encrypter {
  async encrypt (value: string): Promise<string> {
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

interface Sut {
  encrypterStub: Encrypter
  sut: AddAccount
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): Sut => {
  const addAccountRepositoryStub = new AddAccountRepositoryStub()
  const encrypterStub = new EncrypterStub()

  const sut = new DbAddAccount(
    encrypterStub,
    addAccountRepositoryStub
  )
  return {
    encrypterStub,
    sut,
    addAccountRepositoryStub
  }
}

describe('DbAddAccount UseCase', () => {
  it('Should call Encrypter with correct password', async () => {
    const { encrypterStub, sut } = makeSut()

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.add({
      name: 'valid-name',
      email: 'valid@mail.com',
      password: 'valid-password'
    })

    expect(encryptSpy).toHaveBeenCalledWith('valid-password')
  })
  it('Should throw if encrypterStub throws', async () => {
    const { encrypterStub, sut } = makeSut()

    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))

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
})

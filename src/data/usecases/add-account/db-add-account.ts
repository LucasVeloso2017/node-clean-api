import { AddAccountRepository } from '../../protocols/db/account/add-account-repository'
import { AccountModel } from '../../../domain/models/account'
import { AddAccount, AddAccountModel } from '../../../domain/useCases/add-account'
import { Hasher } from '../../protocols/criptography/hasher'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const encryptedPass = await this.hasher.hash(accountData.password)

    const account = await this.addAccountRepository.add({
      ...accountData,
      password: encryptedPass
    })

    return account
  }
}

import { LoadAccountByIdRepository } from '../../protocols/db/account/load-account-by-id-repository'
import { Decrypter } from '../../protocols/criptography/decrypter'
import { AccountModel } from 'domain/models/account'
import { LoadAccountById } from '../../../domain/useCases/load-account-by-id'
export class DbLoadAccountById implements LoadAccountById {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByIdRepository: LoadAccountByIdRepository
  ) {}

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    const userId = this.decrypter.decrypt(accessToken)
    if (userId) {
      const acc = await this.loadAccountByIdRepository.loadById(userId, role)
      if (acc) return acc
    }
    return null
  }
}

import { LoadAccountByTokenRepository } from './../../protocols/db/account/load-account-by-token-repository'
import { Decrypter } from './../../protocols/criptography/decrypter'
import { AccountModel } from 'domain/models/account'
import { LoadAccountByToken } from './../../../domain/useCases/load-account-by-token'
export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    const token = this.decrypter.decrypt(accessToken)
    if (token) {
      const acc = await this.loadAccountByTokenRepository.loadByToken(token, role)
      if (acc) return acc
    }
    return null
  }
}

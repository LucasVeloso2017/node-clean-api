import { Comparer } from '../../protocols/criptography/comparer'
import { Authentication, AuthenticationModel } from '../../../domain/useCases/authentication'
import { Encrypter } from '../../protocols/criptography/encrypter'
import { UpdateAccessTokenRepository } from '../../protocols/db/account/update-access-token-repository'
import { LoadAccountByEmailRepository } from '../../protocols/db/account/load-account-by-email-repository'

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: Comparer,
    private readonly tokenGenerator: Encrypter,
    private readonly updateAccessToken: UpdateAccessTokenRepository
  ) {}

  async auth (input: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(input.email)

    if (account) {
      const comparePass = await this.hashCompare.comparer(input.password, account.password)

      if (!comparePass) {
        return null
      }

      const token = await this.tokenGenerator.encrypt(account.id)

      await this.updateAccessToken.updateAccessToken(account.id, token)

      return token
    }

    return null
  }
}

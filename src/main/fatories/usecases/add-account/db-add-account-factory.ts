import { AddAccount } from './../../../../domain/useCases/add-account'
import { DbAddAccount } from './../../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt/bcrypt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import env from '../../../config/env'

export const makeDbAddAccount = (): AddAccount => {
  return new DbAddAccount(
    new BcryptAdapter(Number(env.salt)),
    new AccountMongoRepository()
  )
}

import { Authentication } from './../../../../domain/useCases/authentication'

import { JwtAdapter } from '../../../../infra/criptography/jwt/jwt-adapter'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt/bcrypt-adapter'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import { DbAuthentication } from '../../../../data/usecases/authentication/db-authentication'
import env from '../../../../main/config/env'

export const makeDbAuthentication = (): Authentication => {
  return new DbAuthentication(
    new AccountMongoRepository(),
    new BcryptAdapter(Number(env.salt)),
    new JwtAdapter(env.secret),
    new AccountMongoRepository()
  )
}

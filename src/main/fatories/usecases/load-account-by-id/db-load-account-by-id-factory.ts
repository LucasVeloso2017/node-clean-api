import { JwtAdapter } from '../../../../infra/criptography/jwt/jwt-adapter'
import { DbLoadAccountById } from '../../../../data/usecases/load-account-by-id/db-load-account-by-id'
import { LoadAccountById } from '../../../../domain/useCases/load-account-by-id'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import env from '../../../config/env'

export const makeDbLoadAccountById = (): LoadAccountById => {
  return new DbLoadAccountById(
    new JwtAdapter(env.secret),
    new AccountMongoRepository()
  )
}

import { AccountMongoRepository } from './../../../infra/db/mongodb/account/account-mongo-repository'

import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt/bcrypt-adapter'
import { JwtAdapter } from '../../../infra/criptography/jwt/jwt-adapter'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { LoginController } from '../../../presentation/controller/login/login-controller'
import { Controller } from '../../../presentation/protocols/controller'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeLoginValidation } from './login-validation-factory'
import env from '../../config/env'

export const makeLoginController = (): Controller => {
  const loginController = new LoginController(
    makeLoginValidation(),
    new DbAuthentication(
      new AccountMongoRepository(),
      new BcryptAdapter(env.salt),
      new JwtAdapter(env.secret),
      new AccountMongoRepository()
    )
  )

  return new LogControllerDecorator(loginController, new LogMongoRepository())
}

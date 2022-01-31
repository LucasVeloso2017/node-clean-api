
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { SignupController } from '../../../presentation/controller/signup/signup-controller'
import { Controller } from '../../../presentation/protocols/controller'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import { makeSignupValidation } from './signup-validation-factory'

export const makeSignupController = (): Controller => {
  const signupController = new SignupController(
    new DbAddAccount(
      new BcryptAdapter(12),
      new AccountMongoRepository()
    ),
    makeSignupValidation()
  )

  return new LogControllerDecorator(signupController, new LogMongoRepository())
}

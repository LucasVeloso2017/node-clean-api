import { makeLogControllerDecorator } from './../../decorators/log-controller-decorator-factory'
import { makeDbAuthentication } from './../../usecases/authentication/db-authentication-factory'
import { makeDbAddAccount } from './../../usecases/add-account/db-add-account-factory'
import { SignupController } from '../../../../presentation/controller/signup/signup-controller'
import { Controller } from '../../../../presentation/protocols/controller'
import { makeSignupValidation } from './signup-validation-factory'

export const makeSignupController = (): Controller => {
  return makeLogControllerDecorator(
    new SignupController(
      makeDbAddAccount(),
      makeSignupValidation(),
      makeDbAuthentication()
    )
  )
}

import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { RequiredFieldsValidation } from '../../../presentation/helpers/validators/required-fields'
import { Validation } from '../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { EmailValidatorAdapter } from '../../adapter/validators/email-validator-adapter'

export const makeLoginValidation = (): Validation => {
  const requiredFields = ['email', 'password']
  const validations: Validation[] = []

  for (const field of requiredFields) {
    validations.push(new RequiredFieldsValidation(field))
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}

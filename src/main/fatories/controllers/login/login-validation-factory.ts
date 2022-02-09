import { EmailValidation } from '../../../../validation/validators/email-validation'
import { RequiredFieldsValidation } from '../../../../validation/validators/required-fields'
import { Validation } from '../../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../../validation/validators/validation-composite'
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter'

export const makeLoginValidation = (): Validation => {
  const requiredFields = ['email', 'password']
  const validations: Validation[] = []

  for (const field of requiredFields) {
    validations.push(new RequiredFieldsValidation(field))
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}

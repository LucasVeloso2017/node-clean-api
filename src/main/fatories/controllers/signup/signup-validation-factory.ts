import { ValidationComposite } from '../../../../validation/validators/validation-composite'
import { CompareFieldsValidation } from '../../../../validation/validators/compare-fields'
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter'
import { EmailValidation } from '../../../../validation/validators/email-validation'
import { RequiredFieldsValidation } from '../../../../validation/validators/required-fields'
import { Validation } from './../../../../presentation/protocols/validation'

export const makeSignupValidation = (): Validation => {
  const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
  const validations: Validation[] = []

  for (const field of requiredFields) {
    validations.push(new RequiredFieldsValidation(field))
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  return new ValidationComposite(validations)
}

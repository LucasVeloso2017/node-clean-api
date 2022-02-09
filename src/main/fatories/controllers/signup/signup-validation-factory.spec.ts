import { ValidationComposite } from './../../../../validation/validators/validation-composite'
import { CompareFieldsValidation } from './../../../../validation/validators/compare-fields'
import { EmailValidation } from './../../../../validation/validators/email-validation'
import { RequiredFieldsValidation } from './../../../../validation/validators/required-fields'

import { Validation } from '../../../../presentation/protocols/validation'
import { makeSignupValidation } from './signup-validation-factory'
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter'

jest.mock('./../../../../validation/validators/validation-composite')

describe('Signup Validation Factory', () => {
  it('should call validationComposite with all validation', async () => {
    makeSignupValidation()

    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    const validations: Validation[] = []

    for (const field of requiredFields) {
      validations.push(new RequiredFieldsValidation(field))
    }

    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})

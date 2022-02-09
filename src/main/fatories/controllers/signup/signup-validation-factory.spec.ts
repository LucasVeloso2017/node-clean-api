import { CompareFieldsValidation } from './../../../../presentation/helpers/validators/compare-fields'
import { EmailValidation } from '../../../../presentation/helpers/validators/email-validation'
import { RequiredFieldsValidation } from '../../../../presentation/helpers/validators/required-fields'
import { ValidationComposite } from '../../../../presentation/helpers/validators/validation-composite'
import { Validation } from '../../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../adapter/validators/email-validator-adapter'
import { makeSignupValidation } from './signup-validation-factory'

jest.mock('../../../../presentation/helpers/validators/validation-composite')

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

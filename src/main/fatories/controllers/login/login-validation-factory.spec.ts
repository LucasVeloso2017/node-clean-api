
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter'
import { EmailValidation } from '../../../../validation/validators/email-validation'
import { RequiredFieldsValidation } from '../../../../validation/validators/required-fields'
import { ValidationComposite } from '../../../../validation/validators/validation-composite'
import { Validation } from './../../../../presentation/protocols/validation'
import { makeLoginValidation } from './login-validation-factory'

jest.mock('../../../../validation/validators/validation-composite')

describe('Login Validation Factory', () => {
  it('should call validationComposite with all validation', async () => {
    makeLoginValidation()

    const requiredFields = ['email', 'password']
    const validations: Validation[] = []

    for (const field of requiredFields) {
      validations.push(new RequiredFieldsValidation(field))
    }

    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})

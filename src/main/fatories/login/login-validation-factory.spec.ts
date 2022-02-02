import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { RequiredFieldsValidation } from '../../../presentation/helpers/validators/required-fields'
import { Validation } from '../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { makeLoginValidation } from './login-validation-factory'
import { EmailValidatorAdapter } from '../../adapter/validators/email-validator-adapter'

jest.mock('../../../presentation/helpers/validators/validation-composite')

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

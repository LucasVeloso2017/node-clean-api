import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { RequiredFieldsValidation } from '../../../../validation/validators/required-fields'
import { ValidationComposite } from '../../../../validation/validators/validation-composite'
import { Validation } from '../../../../presentation/protocols/validation'
jest.mock('../../../../validation/validators/validation-composite')

describe('Add Survey Validation Factory', () => {
  it('should call validationComposite with all validation', async () => {
    makeAddSurveyValidation()

    const requiredFields = ['question', 'answers']
    const validations: Validation[] = []

    for (const field of requiredFields) {
      validations.push(new RequiredFieldsValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})

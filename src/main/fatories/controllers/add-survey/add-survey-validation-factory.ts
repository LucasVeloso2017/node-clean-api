import { RequiredFieldsValidation } from '../../../../validation/validators/required-fields'
import { Validation } from '../../../../presentation/protocols/validation'
import { ValidationComposite } from '../../../../validation/validators/validation-composite'

export const makeAddSurveyValidation = (): Validation => {
  const requiredFields = ['question', 'answers']
  const validations: Validation[] = []

  for (const field of requiredFields) {
    validations.push(new RequiredFieldsValidation(field))
  }

  return new ValidationComposite(validations)
}

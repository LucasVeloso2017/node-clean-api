import { MissingParamError } from './../../errors/missing-param-error'

import { Validation } from '../../protocols/validation'
import { ValidationComposite } from './validation-composite'

class ValidationStub implements Validation {
  validate (input: any): Error {
    return null
  }
}

describe('Validation Composite', () => {
  it('should be able to return error if validations error', () => {
    const validations = [new ValidationStub(), new ValidationStub()]

    jest.spyOn(validations[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))

    const sut = new ValidationComposite(validations)

    const response = sut.validate({ field: 'any_value' })

    expect(response).toEqual(new MissingParamError('field'))
  })
  it('should the first error more then one validation fails', () => {
    const validations = [new ValidationStub(), new ValidationStub()]

    jest.spyOn(validations[0], 'validate').mockReturnValueOnce(new Error())
    jest.spyOn(validations[1], 'validate').mockReturnValueOnce(new MissingParamError('field'))

    const sut = new ValidationComposite(validations)
    const response = sut.validate({ field: 'any_value' })

    expect(response).toEqual(new Error())
  })
})

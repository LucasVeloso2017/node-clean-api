import { InvalidParamError } from '../../presentation/errors/invalid-param-error'
import { CompareFieldsValidation } from './compare-fields'

describe('Compare Fields Validation', () => {
  it('should  be able to return error if field was different', async () => {
    const sut = new CompareFieldsValidation('password', 'passwordConfirmation')

    const response = sut.validate({
      password: 'any-pass',
      passwordConfirmation: 'wrong-pass'
    })

    expect(response).toEqual(new InvalidParamError('passwordConfirmation'))
  })
  it('should be able to return null if field was equal', async () => {
    const sut = new CompareFieldsValidation('password', 'passwordConfirmation')

    const response = sut.validate({
      password: 'any-pass',
      passwordConfirmation: 'any-pass'
    })

    expect(response).toBeUndefined()
  })
})

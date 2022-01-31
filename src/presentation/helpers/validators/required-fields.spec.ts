import { MissingParamError } from '../../errors/missing-param-error'
import { RequiredFieldsValidation } from './required-fields'

describe('Required Fields Validation', () => {
  it('should  be able to return error if field was not provided', async () => {
    const sut = new RequiredFieldsValidation('name')

    const response = sut.validate({
      email: 'any-email@mail.com'
    })

    expect(response).toEqual(new MissingParamError('name'))
  })
  it('should be able to return null if field was provided', async () => {
    const sut = new RequiredFieldsValidation('name')

    const response = sut.validate({
      name: 'lucas',
      email: 'any-email@mail.com'
    })

    expect(response).toBeUndefined()
  })
})

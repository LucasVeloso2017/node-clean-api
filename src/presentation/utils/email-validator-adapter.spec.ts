import { EmailValidatorAdapter } from './email-validator'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

describe.only('EmailValidator Adapter', () => {
  it('Should be able to return false if validator return false', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })
  it('Should be able to return true if validator return true', () => {
    const sut = new EmailValidatorAdapter()

    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(true)
  })
})

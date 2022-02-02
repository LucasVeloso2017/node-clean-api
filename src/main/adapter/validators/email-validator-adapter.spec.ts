
import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator-adapter'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

describe('EmailValidator Adapter', () => {
  it('Should be able to return false if validator return false', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const isValid = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })
  it('Should be able to return true if validator return true', () => {
    const sut = new EmailValidatorAdapter()

    const isValid = sut.isValid('valid@mail.com')
    expect(isValid).toBe(true)
  })
  it('Should be able to call validater with correct email', () => {
    const sut = new EmailValidatorAdapter()

    const emailSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('valid@mail.com')
    expect(emailSpy).toBeCalledWith('valid@mail.com')
  })
})

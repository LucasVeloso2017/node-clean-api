import { EmailValidation } from './email-validation'
import { EmailValidator } from './../../protocols/email-validator'
import { Validation } from '../../protocols/validation'
import { InvalidParamError } from '../../errors/invalid-param-error'

class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

interface Sut {
  sut: Validation
  emailValidationStub: EmailValidator
}

const makeSut = (): Sut => {
  const emailValidationStub = new EmailValidatorStub()
  const sut = new EmailValidation(
    'email',
    emailValidationStub
  )

  return {
    sut,
    emailValidationStub
  }
}

describe('Email Validation', () => {
  it('should call EmailValidator with correct Email', () => {
    const { sut, emailValidationStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidationStub, 'isValid')
    sut.validate({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })

    expect(isValidSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })
  it('should  return invalid param with email validator return false ', () => {
    const { sut, emailValidationStub } = makeSut()

    jest.spyOn(emailValidationStub, 'isValid').mockReturnValueOnce(false)

    const response = sut.validate({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    })

    expect(response).toBeInstanceOf(InvalidParamError)
  })
  it('should throw with email validator throws ', () => {
    const { sut, emailValidationStub } = makeSut()

    jest.spyOn(emailValidationStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.validate).toThrow()
  })
})

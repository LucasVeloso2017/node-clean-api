
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { SignupController } from './signup'
import { AccountModel, AddAccount, AddAccountModel, Controller, EmailValidator } from './signup-protocols'

class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true
  }
}

class AddAccountStub implements AddAccount {
  add (account: AddAccountModel): AccountModel {
    return {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
  }
}
interface SutType{
  sut: Controller
  addAccountStub: AddAccount
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutType => {
  const emailValidatorStub = new EmailValidatorStub()
  const addAccountStub = new AddAccountStub()
  const sut = new SignupController(
    emailValidatorStub,
    addAccountStub
  )

  return {
    sut,
    emailValidatorStub,
    addAccountStub
  }
}

describe('Signup Controller', (): void => {
  it('1. Should return 400 if no name is provided', () => {
    const { sut } = makeSut()
    const response = sut.handle({
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any-password'
      }
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('name'))
  })
  it('2. Should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const response = sut.handle({
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any-password'
      }
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('email'))
  })
  it('3. Should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const response = sut.handle({
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        passwordConfirmation: 'any-password'
      }
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('password'))
  })
  it('4. Should return 400 if no passwordConfirmation is provided', () => {
    const { sut } = makeSut()
    const response = sut.handle({
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password'

      }
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new MissingParamError('passwordConfirmation'))
  })
  it('5. Should return 400 if passwordConfirmation failed', () => {
    const { sut } = makeSut()
    const response = sut.handle({
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'invalid-password'
      }
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })
  it('6. Should return 400 if email is not valid provided', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const response = sut.handle({
      body: {
        name: 'any_name',
        email: 'invalid_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new InvalidParamError('email'))
  })
  it('8. Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    sut.handle({
      body: {
        name: 'any_name',
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    })

    expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com')
  })
  it('9. Should return 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })

    const response = sut.handle({
      body: {
        name: 'any_name',
        email: 'invalid_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    })

    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError())
  })
  it('10. Should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    sut.handle({
      body: {
        name: 'any_name',
        email: 'valid_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    })

    expect(addSpy).toBeCalledWith({
      name: 'any_name',
      email: 'valid_email@email.com',
      password: 'any_password'
    })
  })
  it('11. Should return 500 if AddAccount throws', () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => { throw new Error() })

    const response = sut.handle({
      body: {
        name: 'any_name',
        email: 'valid_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    })

    expect(response.statusCode).toBe(500)
    expect(response.body).toEqual(new ServerError())
  })

  it('11. Should return 200 if valid data is provided', () => {
    const { sut } = makeSut()
    const response = sut.handle({
      body: {
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password'
      }
    })

    console.log(response)
    expect(response.statusCode).toBe(200)
  })
})

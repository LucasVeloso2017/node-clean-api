import { MissingParamError } from '../errors/missing-param-error'
import { SignupController } from './signup'

const makeSut = (): SignupController => {
  return new SignupController()
}

describe('Signup Controller', (): void => {
  it('Should return 400 with no name is provided', () => {
    const sut = makeSut()
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
  it('Should return 400 with no email is provided', () => {
    const sut = makeSut()
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

  it('Should return 400 with no password is provided', () => {
    const sut = makeSut()
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
  it('Should return 400 with no passwordConfirmation is provided', () => {
    const sut = makeSut()
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
})

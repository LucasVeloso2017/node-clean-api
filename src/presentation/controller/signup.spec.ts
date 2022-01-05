import { SignupController } from './signup'

describe('Signup Controller', (): void => {
  it('Should return 400 with no name is provided', () => {
    const sut = new SignupController()
    const response = sut.handle({
      body: {
        email: 'any_email@email.com',
        password: 'any_password',
        passwordConfirmation: 'any-password'
      }
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new Error('Missing param: name'))
  })
  it('Should return 400 with no email is provided', () => {
    const sut = new SignupController()
    const response = sut.handle({
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any-password'
      }
    })

    expect(response.statusCode).toBe(400)
    expect(response.body).toEqual(new Error('Missing param: email'))
  })
})

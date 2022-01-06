import { InvalidParamError } from './../errors/invalid-param-error'

import { HttpRequest, HttpResponse } from '../protocols/http'
import { badRequest } from '../helpers/http-helper'
import { MissingParamError } from '../errors/missing-param-error'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'

export class SignupController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator
  ) {}

  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field))
      }
    }

    const isValid = this.emailValidator.isValid(httpRequest.body.email)

    if (!isValid) {
      return badRequest(new InvalidParamError('email'))
    }
  }
}

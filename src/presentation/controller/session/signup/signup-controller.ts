import { EmailInUseError } from './../../../errors/email-in-use-error'
import { Authentication } from './../../../../domain/useCases/authentication'

import { AddAccount } from '../../../../domain/useCases/add-account'
import { badRequest, forbidden, ok, serverError } from '../../../helpers/http/http-helper'
import { Validation } from '../../../protocols/validation'
import { Controller } from '../../../protocols/controller'
import { HttpRequest, HttpResponse } from '../../../protocols/http'

export class SignupController implements Controller {
  constructor (
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      if (!account) {
        return forbidden(new EmailInUseError())
      }

      const token = await this.authentication.auth({ email, password })

      return ok({ account, token })
    } catch (error) {
      return serverError(error)
    }
  }
}

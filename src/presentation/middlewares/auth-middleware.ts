import { AccessDeniedError } from './../errors/access-denied-error'
import { LoadAccountByToken } from './../../domain/useCases/load-account-by-token'
import { forbidden, ok, serverError } from './../helpers/http/http-helper'
import { HttpRequest, HttpResponse } from 'presentation/protocols/http'
import { Middleware } from './../protocols/middleware'
export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']

      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken, this.role)
        if (account) {
          return ok({ accountId: account.id })
        }
      }
      return Promise.resolve(forbidden(new AccessDeniedError()))
    } catch (err) {
      return serverError(err)
    }
  }
}

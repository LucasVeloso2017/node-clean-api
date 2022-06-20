
import { Request, Response } from 'express'
import { Controller } from '../../../presentation/protocols/controller'
import { HttpRequest } from '../../../presentation/protocols/http'

export const adaptRoute = (controller: Controller) => {
  return async (request: Request, response: Response) => {
    const httpRequest: HttpRequest = {
      body: request.body,
      params: request.params,
      headers: request.headers,
      accountId: request.accountId
    }

    const result = await controller.handle(httpRequest)
    if (result.statusCode >= 200 && result.statusCode <= 299) {
      response.status(result.statusCode).json(result.body)
    } else {
      response.status(result.statusCode).json({ error: result.body.message })
    }
  }
}

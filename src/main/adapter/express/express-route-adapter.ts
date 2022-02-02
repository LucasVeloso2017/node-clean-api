
import { Request, Response } from 'express'
import { Controller } from '../../../presentation/protocols/controller'
import { HttpRequest } from '../../../presentation/protocols/http'

export const adaptRoute = (controller: Controller) => {
  return async (request: Request, response: Response) => {
    const httpRequest: HttpRequest = {
      body: request.body
    }

    const result = await controller.handle(httpRequest)
    if (result.statusCode === 200) {
      response.status(result.statusCode).json(result.body)
    } else {
      response.status(result.statusCode).json({ error: result.body.message })
    }
  }
}
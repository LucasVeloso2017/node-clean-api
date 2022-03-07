import { Middleware } from './../../../presentation/protocols/middleware'

import { NextFunction, Request, Response } from 'express'
import { HttpRequest } from '../../../presentation/protocols/http'

export const adaptMiddleware = (middleware: Middleware) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: request.headers
    }

    const result = await middleware.handle(httpRequest)

    if (result.statusCode === 200) {
      Object.assign(request, request.body)
      next()
    } else {
      response.status(result.statusCode).json({ error: result.body.message })
    }
  }
}

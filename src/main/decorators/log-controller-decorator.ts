import { LogErrorRepository } from '../../data/protocols/db/log/log-error-repository'

import { Controller } from '../../presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '../../presentation/protocols/http'

export class LogControllerDecorator implements Controller {
  constructor (
    private readonly controller: Controller,
    private readonly logErrorRepository: LogErrorRepository
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const controller = await this.controller.handle(httpRequest)

    if (controller.statusCode >= 500) {
      await this.logErrorRepository.logError(controller.body.stack)
    }

    return controller
  }
}

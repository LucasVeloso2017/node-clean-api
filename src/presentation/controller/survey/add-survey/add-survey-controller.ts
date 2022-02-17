import { AddSurvey } from './../../../../domain/useCases/add-survey'
import { badRequest, noContent, serverError } from './../../../helpers/http/http-helper'
import { Validation } from './../../../protocols/validation'
import { HttpRequest, HttpResponse } from 'presentation/protocols/http'
import { Controller } from './../../../protocols/controller'
export class AddSurveyController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly addSurvey: AddSurvey
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { body } = httpRequest

      const error = this.validation.validate(body)

      if (error) {
        return badRequest(error)
      }

      await this.addSurvey.add(body)

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}

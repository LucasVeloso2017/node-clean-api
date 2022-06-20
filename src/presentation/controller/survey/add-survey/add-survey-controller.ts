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
      const { question, answers } = httpRequest.body

      const error = this.validation.validate(httpRequest.body)

      if (error) {
        return badRequest(error)
      }

      await this.addSurvey.add({
        answers,
        question,
        date: new Date()
      })

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}

import { SaveSurveyResult } from './../../../domain/useCases/save-survey-result'
import { forbidden, ok, serverError } from './../../helpers/http/http-helper'
import { InvalidParamError } from './../../errors/invalid-param-error'
import { LoadSurveyById } from './../../../domain/useCases/load-survey-by-id'
import { HttpRequest, HttpResponse } from 'presentation/protocols/http'
import { Controller } from './../../protocols/controller'

export class SaveSurveyResultController implements Controller {
  constructor (
    private readonly loadSurveyById: LoadSurveyById,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const survey = await this.loadSurveyById.loadById(httpRequest.params.surveyId)

      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'))
      }
      const answers = survey.answers.find(e => e.answer === httpRequest.body.answer)

      if (!answers) {
        return forbidden(new InvalidParamError('answer'))
      }
      const result = await this.saveSurveyResult.save({
        surveyId: survey.id,
        accountId: httpRequest.accountId,
        answer: httpRequest.body.answer,
        date: new Date()
      })
      return ok(result)
    } catch (error) {
      return serverError(error)
    }
  }
}

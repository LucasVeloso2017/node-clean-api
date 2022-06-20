import { SaveSurveyResultRepository } from './../../protocols/db/survey/save-survey-result-repository'
import { SurveyResultModel } from 'domain/models/survey-result'
import { SaveSurveyResult, SaveSurveyResultModel } from './../../../domain/useCases/save-survey-result'

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor (
    private readonly saveSurveyRepository: SaveSurveyResultRepository
  ) {}

  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const result = await this.saveSurveyRepository.save(data)
    return result
  }
}

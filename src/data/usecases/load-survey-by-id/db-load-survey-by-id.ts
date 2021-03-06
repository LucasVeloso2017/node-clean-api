import { LoadSurveyByIdRepository } from './../../protocols/db/survey/load-survey-by-id'
import { SurveyModel } from 'domain/models/survey'
import { LoadSurveyById } from './../../../domain/useCases/load-survey-by-id'

export class DbLoadSurveyById implements LoadSurveyById {
  constructor (
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async loadById (id: string): Promise<SurveyModel> {
    if (!id) return null

    const survey = await this.loadSurveyByIdRepository.loadById(id)

    return survey
  }
}

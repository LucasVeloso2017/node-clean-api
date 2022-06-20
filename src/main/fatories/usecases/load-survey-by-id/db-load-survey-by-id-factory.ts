import { SurveyMongoRepository } from './../../../../infra/db/mongodb/survey/survey-mongo-repository'
import { DbLoadSurveyById } from './../../../../data/usecases/load-survey-by-id/db-load-survey-by-id'
import { LoadSurveyById } from './../../../../domain/useCases/load-survey-by-id'

export const makeDbLoadSurveyById = (): LoadSurveyById => {
  return new DbLoadSurveyById(
    new SurveyMongoRepository()
  )
}

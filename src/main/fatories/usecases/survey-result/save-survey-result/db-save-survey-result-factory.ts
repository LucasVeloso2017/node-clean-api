import { DbSaveSurveyResult } from './../../../../../data/usecases/save-survey-result/db-save-survey-result'
import { SaveSurveyResult } from './../../../../../domain/useCases/save-survey-result'
import { SurveyResultMongoRepository } from '../../../../../infra/db/mongodb/survey-result/survey-result-mongo-repository'

export const makeDbSaveSurveyResult = (): SaveSurveyResult => {
  return new DbSaveSurveyResult(
    new SurveyResultMongoRepository()
  )
}

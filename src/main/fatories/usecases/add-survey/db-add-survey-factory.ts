import { SurveyMongoRepository } from '../../../../infra/db/mongodb/survey/survey-mongo-repository'
import { DbAddSurvey } from './../../../../data/usecases/add-survey/db-add-survey'

export const makeDbAddSurvey = (): DbAddSurvey => {
  return new DbAddSurvey(
    new SurveyMongoRepository()
  )
}

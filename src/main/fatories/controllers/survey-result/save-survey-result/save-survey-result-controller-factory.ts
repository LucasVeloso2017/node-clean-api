import { makeDbLoadSurveyById } from './../../../usecases/load-survey-by-id/db-load-survey-by-id-factory'
import { makeDbSaveSurveyResult } from './../../../usecases/survey-result/save-survey-result/db-save-survey-result-factory'
import { SaveSurveyResultController } from './../../../../../presentation/controller/survey-result/save-survey-result-controller'
import { Controller } from './../../../../../presentation/protocols/controller'

export const makeSaveSurveyResultController = (): Controller => {
  return new SaveSurveyResultController(
    makeDbLoadSurveyById(),
    makeDbSaveSurveyResult()
  )
}

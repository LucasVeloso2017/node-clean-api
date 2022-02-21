import { makeDbAddSurvey } from './../../usecases/add-survey/db-add-survey-factory'
import { AddSurveyController } from './../../../../presentation/controller/survey/add-survey/add-survey-controller'
import { makeLogControllerDecorator } from './../../decorators/log-controller-decorator-factory'

import { Controller } from '../../../../presentation/protocols/controller'
import { makeAddSurveyValidation } from './add-survey-validation-factory'
export const makeAddSurveyController = (): Controller => {
  return makeLogControllerDecorator(
    new AddSurveyController(
      makeAddSurveyValidation(),
      makeDbAddSurvey()
    )
  )
}

import { makeDbLoadSurveys } from './../../usecases/load-surveys/db-load-surveys-factory'
import { LoadSurveysController } from './../../../../presentation/controller/survey/load-surveys/load-surveys-controller'
import { makeLogControllerDecorator } from './../../decorators/log-controller-decorator-factory'

import { Controller } from '../../../../presentation/protocols/controller'

export const makeLoadSurveysController = (): Controller => {
  return makeLogControllerDecorator(
    new LoadSurveysController(
      makeDbLoadSurveys()
    )
  )
}

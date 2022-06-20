import { makeSaveSurveyResultController } from './../fatories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory'
import { auth } from './../middlewares/auth'
import { Router } from 'express'
import { adaptRoute } from '../adapter/express/express-route-adapter'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, adaptRoute(makeSaveSurveyResultController()))
}

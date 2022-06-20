import { auth } from './../middlewares/auth'
import { adminAuth } from './../middlewares/admin-auth'
import { makeLoadSurveysController } from './../fatories/controllers/load-surveys/load-surveys-controller-factory'
import { makeAddSurveyController } from './../fatories/controllers/add-survey/add-survey-controller-factory'

import { Router } from 'express'
import { adaptRoute } from '../adapter/express/express-route-adapter'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
  router.get('/surveys', auth, adaptRoute(makeLoadSurveysController()))
}

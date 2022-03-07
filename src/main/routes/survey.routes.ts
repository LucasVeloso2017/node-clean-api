import { adaptMiddleware } from './../adapter/express/express-middleware-adapter'
import { makeAuthMiddleware } from './../fatories/middlewares/auth-middleware'
import { makeAddSurveyController } from './../fatories/controllers/add-survey/add-survey-controller-factory'

import { Router } from 'express'
import { adaptRoute } from '../adapter/express/express-route-adapter'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))

  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
}

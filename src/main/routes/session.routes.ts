
import { Router } from 'express'
import { adaptRoute } from '../adapter/express/express-route-adapter'
import { makeLoginController } from '../fatories/controllers/login/login-controller-factory'
import { makeSignupController } from '../fatories/controllers/signup/signup-controller-factory'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignupController()))
  router.post('/signin', adaptRoute(makeLoginController()))
}

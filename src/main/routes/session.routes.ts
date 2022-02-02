import { Router } from 'express'
import { adaptRoute } from '../adapter/express/express-route-adapter'
import { makeLoginController } from '../fatories/login/login-factory'
import { makeSignupController } from '../fatories/signup/signup-factory'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignupController()))
  router.post('/signin', adaptRoute(makeLoginController()))
}

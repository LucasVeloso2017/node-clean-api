import { Router } from 'express'
import { adaptRoute } from '../adapter/express-route-adapter'
import { makeLoginController } from '../fatories/login/login-factory'

export default (router: Router): void => {
  router.post('/signin', adaptRoute(makeLoginController()))
}

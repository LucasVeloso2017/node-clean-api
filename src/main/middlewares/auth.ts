import { makeAuthMiddleware } from './../fatories/middlewares/auth-middleware'
import { adaptMiddleware } from './../adapter/express/express-middleware-adapter'

export const auth = adaptMiddleware(makeAuthMiddleware())

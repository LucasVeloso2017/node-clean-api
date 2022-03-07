import { makeDbLoadAccountById } from '../usecases/load-account-by-id/db-load-account-by-id-factory'
import { AuthMiddleware } from './../../../presentation/middlewares/auth-middleware'
import { Middleware } from './../../../presentation/protocols/middleware'

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthMiddleware(
    makeDbLoadAccountById(),
    role
  )
}

import { noCacheSwagger } from './../middlewares/no-cache-swagger'
import { Express } from 'express'
import { serve, setup } from 'swagger-ui-express'
import swaggerConfig from '../docs'
export default (app: Express): void => {
  app.use('/api/docs', noCacheSwagger, serve, setup(swaggerConfig))
}

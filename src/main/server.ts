import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helper'
import app from './config/app'
import env from './config/env'

(async (): Promise<void> => {
  await MongoHelper.connect(env.mongoUrl)
})()
app.listen(env.port, () => {
  console.log('server run at http://localhost:', env.port)
})

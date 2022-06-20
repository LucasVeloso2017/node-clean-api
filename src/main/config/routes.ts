/* eslint-disable @typescript-eslint/semi */
import { Application, Router } from 'express'
import { readdirSync, statSync } from 'fs'
import { resolve } from 'path'

export default (app: Application): void => {
  const router = Router()
  const routesPath = resolve(__dirname, '..', 'routes')
  app.use('/api', router)

  const getFiles = readdirSync(routesPath).filter(file => {
    return statSync(resolve(routesPath, file)).isFile()
  })

  getFiles.map(async file => {
    if (!file.endsWith('.test.ts') && !file.endsWith('.spec.ts') && (!file.endsWith('.js.map'))) {
      (await import(resolve(routesPath, file))).default(router)
    }
  })
}

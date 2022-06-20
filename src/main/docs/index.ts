import { LoginSchema } from './schemas/login-schema'
import { AccountSchema } from './schemas/account-schema'
import { loginPath } from './paths/login-path'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Clean Node API',
    description: '',
    version: '0.0.1'
  },
  servers: [
    {
      url: '/api'
    }
  ],
  tags: [
    {
      name: 'Login'
    }
  ],
  paths: {
    '/login': loginPath
  },
  schemas: {
    account: AccountSchema,
    login: LoginSchema
  }
}

import request from 'supertest'
import { app } from '../config/app'

describe('Signup Routes', () => {
  it('should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'any-name',
        email: 'any-email@mail.com',
        password: 'any-pass',
        passwordValidation: 'any-pass'
      })
      .expect(200)
  })
})

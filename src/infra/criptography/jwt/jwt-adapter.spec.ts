import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return 'any-token'
  }
}))

describe('Jwt Adapter', () => {
  it('should call sign with correct values', async () => {
    const sut = new JwtAdapter('secret')
    const spy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any-value')
    expect(spy).toHaveBeenCalledWith({ id: 'any-value' }, 'secret')
  })
  it('should return token on sign success', async () => {
    const sut = new JwtAdapter('secret')
    const response = await sut.encrypt('any-value')
    expect(response).toBe('any-token')
  })
  it('should throw if sign throw', async () => {
    const sut = new JwtAdapter('secret')
    jest.spyOn(jwt, 'sign').mockImplementationOnce(async () => Promise.reject(new Error()))
    const response = sut.encrypt('any-value')
    await expect(response).rejects.toThrow()
  })
})

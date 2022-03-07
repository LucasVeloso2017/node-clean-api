import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  sign (): string {
    return 'any-token'
  },
  verify (): any {
    return {
      id: 'any-value'
    }
  }
}))

describe('Jwt Adapter', () => {
  describe('encrypt', () => {
    it('should call sign with correct values', () => {
      const sut = new JwtAdapter('secret')
      const spy = jest.spyOn(jwt, 'sign')
      sut.encrypt('any-value')
      expect(spy).toHaveBeenCalledWith({ id: 'any-value' }, 'secret')
    })
    it('should return token on sign success', () => {
      const sut = new JwtAdapter('secret')
      const response = sut.encrypt('any-value')
      expect(response).toBe('any-token')
    })
    it('should throw if sign throw', () => {
      const sut = new JwtAdapter('secret')
      jest.spyOn(jwt, 'sign').mockImplementationOnce(async () => {
        throw new Error()
      })
      const response = sut.encrypt('any-value')
      expect(response).rejects.toThrow()
    })
  })
  describe('decrypt', () => {
    it('should call verify with correct values', async () => {
      const sut = new JwtAdapter('secret')
      const verifySpy = jest.spyOn(jwt, 'verify')
      sut.decrypt('any-token')

      expect(verifySpy).toHaveBeenCalledWith('any-token', 'secret')
    })
    it('should return value on verify success', () => {
      const sut = new JwtAdapter('secret')
      const response = sut.decrypt('any-token')
      expect(response).toBe('any-value')
    })
  })
})

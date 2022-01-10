import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return 'encrypted-value'
  }
}))

describe('Bcrypt Adapter', () => {
  it('Should call bcrypt with correct value   ', async () => {
    const sut = new BcryptAdapter(12)

    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any-value')

    expect(hashSpy).toHaveBeenCalledWith('any-value', 12)
  })
  it('Should return a encrypted value on success', async () => {
    const sut = new BcryptAdapter(12)

    const response = await sut.encrypt('any-value')
    expect(response).toBe('encrypted-value')
  })
  it('Should throw if bcrypt throws', async () => {
    const sut = new BcryptAdapter(12)

    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error('')
    })

    const response = sut.encrypt('any-value')

    await expect(response).rejects.toThrow()
  })
})

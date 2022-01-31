import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return 'encrypted-value'
  },
  async compare (): Promise<boolean> {
    return true
  }
}))

describe('Bcrypt Adapter', () => {
  it('Should call hash with correct value   ', async () => {
    const sut = new BcryptAdapter(12)

    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.hash('any-value')

    expect(hashSpy).toHaveBeenCalledWith('any-value', 12)
  })
  it('Should return a encrypted value on success', async () => {
    const sut = new BcryptAdapter(12)

    const response = await sut.hash('any-value')
    expect(response).toBe('encrypted-value')
  })
  it('Should throw if hash throws', async () => {
    const sut = new BcryptAdapter(12)

    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => {
      throw new Error('')
    })

    const response = sut.hash('any-value')

    await expect(response).rejects.toThrow()
  })
  it('Should call comparer with correct value   ', async () => {
    const sut = new BcryptAdapter(12)

    const hashSpy = jest.spyOn(bcrypt, 'compare')

    await sut.comparer('any-value', 'any_hash')

    expect(hashSpy).toHaveBeenCalledWith('any-value', 'any_hash')
  })
  it('Should return true if a encrypted value is equal to uncrypted value', async () => {
    const sut = new BcryptAdapter(12)
    const response = await sut.comparer('any-value', 'any-value')

    expect(response).toBeTruthy()
  })
  it('Should return true if a encrypted value is diferent to uncrypted value', async () => {
    const sut = new BcryptAdapter(12)
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => {
      return Promise.resolve(false)
    })
    const response = await sut.comparer('any-value', 'any-value')

    expect(response).toBeFalsy()
  })
  it('Should throw if comparer throws', async () => {
    const sut = new BcryptAdapter(12)

    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => {
      throw new Error('')
    })

    const response = sut.comparer('any-value', 'any_hash')

    await expect(response).rejects.toThrow()
  })
})

import { Encrypter } from '../../data/protocols/encrypter'
import { hash } from 'bcrypt'
export class BcryptAdapter implements Encrypter {
  constructor (
    private readonly salt: number
  ) {}

  async encrypt (value: string): Promise<string> {
    return await hash(value, this.salt)
  }
}

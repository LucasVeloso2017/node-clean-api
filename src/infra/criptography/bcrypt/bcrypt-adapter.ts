
import { hash, compare } from 'bcrypt'
import { Comparer } from '../../../data/protocols/criptography/comparer'
import { Hasher } from '../../../data/protocols/criptography/hasher'
export class BcryptAdapter implements Hasher, Comparer {
  constructor (
    private readonly salt: number
  ) {}

  async comparer (value: string, hashedValue: string): Promise<boolean> {
    return await compare(value, hashedValue)
  }

  async hash (value: string): Promise<string> {
    return await hash(value, this.salt)
  }
}

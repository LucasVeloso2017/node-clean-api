import { Encrypter } from './../../../data/protocols/criptography/encrypter'
import jwt from 'jsonwebtoken'
export class JwtAdapter implements Encrypter {
  constructor (
    private readonly secret: string
  ) {}

  encrypt (value: string): string {
    const token = jwt.sign({ id: value }, this.secret)
    return token
  }
}

import { Decrypter } from './../../../data/protocols/criptography/decrypter'
import { Encrypter } from './../../../data/protocols/criptography/encrypter'
import jwt from 'jsonwebtoken'
export class JwtAdapter implements Encrypter, Decrypter {
  constructor (
    private readonly secret: string
  ) {}

  decrypt (token: string): string {
    const value: any = jwt.verify(token, this.secret)
    return value.id
  }

  encrypt (value: string): string {
    const token = jwt.sign({ id: value }, this.secret)
    return token
  }
}

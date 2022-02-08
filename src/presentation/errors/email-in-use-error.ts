export class EmailInUseError extends Error {
  constructor () {
    super('This Account is already in use')
    this.name = 'EmailInUseError'
  }
}

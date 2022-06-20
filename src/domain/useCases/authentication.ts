
export type AuthenticationModel = {
  email: string
  password: string
}

export interface Authentication {
  auth: (input: AuthenticationModel) => Promise<string>
}

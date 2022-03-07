import { AccountModel } from '../models/account'

export interface LoadAccountById{
  load: (accessToken: string, role?: string) => Promise<AccountModel>
}

import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/useCases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'
import { AddAccountRepository } from './../../../../data/protocols/add-account-repository'

export class AccountMongoRepository implements AddAccountRepository {
  async add (acc: AddAccountModel): Promise<AccountModel> {
    const collection = MongoHelper.getCollection('accounts')

    const result = await collection.insertOne(acc)

    const returnOBj = {
      id: result.insertedId.toString(),
      ...acc
    }

    return returnOBj
  }
}

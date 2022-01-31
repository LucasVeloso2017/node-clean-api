import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/update-access-token-repository'
import { AccountModel } from '../../../../domain/models/account'
import { AddAccountModel } from '../../../../domain/useCases/add-account'
import { MongoHelper } from '../helpers/mongo-helper'
import { AddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository'
import { ObjectId } from 'mongodb'
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository {
  async updateAccessToken (id: string, token: string): Promise<void> {
    const collection = await MongoHelper.getCollection('accounts')

    const rep = await collection.updateOne({ _id: new ObjectId(id) }, {
      $set: {
        accessToken: token
      }
    })

    console.log(rep)
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const collection = await MongoHelper.getCollection('accounts')
    const result = await collection.findOne({ email })

    if (!result) return null

    const returnOBj: any = {
      id: result._id,
      ...result
    }
    return returnOBj
  }

  async add (acc: AddAccountModel): Promise<AccountModel> {
    const collection = await MongoHelper.getCollection('accounts')

    const result = await collection.insertOne(acc)

    const returnOBj = {
      id: result.insertedId.toString(),
      ...acc
    }

    return returnOBj
  }
}

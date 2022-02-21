import { AddSurveyModel } from 'domain/useCases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'
import { AddSurveyRepository } from './../../../../data/protocols/db/survey/add-survey-repository'

export class SurveyMongoRepository implements AddSurveyRepository {
  async add (data: AddSurveyModel): Promise<void> {
    const collection = await MongoHelper.getCollection('survey')

    await collection.insertOne(data)
  }
}

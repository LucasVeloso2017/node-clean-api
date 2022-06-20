import { LoadSurveyById } from '../../../../domain/useCases/load-survey-by-id'
import { SurveyModel } from '../../../../domain/models/survey'
import { AddSurveyModel } from '../../../../domain/useCases/add-survey'
import { LoadSurveysRepository } from '../../../../data/protocols/db/survey/load-surveys-repository'
import { MongoHelper } from '../helpers/mongo-helper'
import { AddSurveyRepository } from '../../../../data/protocols/db/survey/add-survey-repository'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyById {
  async add (data: AddSurveyModel): Promise<void> {
    const collection = await MongoHelper.getCollection('survey')

    await collection.insertOne(data)
  }

  async loadAll (): Promise<SurveyModel[]> {
    const collection = await MongoHelper.getCollection('survey')
    const surveys = await collection.find().toArray() as any as SurveyModel[]
    return surveys.map(e => MongoHelper.map(e))
  }

  async loadById (id: string): Promise<SurveyModel> {
    const collection = await MongoHelper.getCollection('survey')
    const survey = await collection.findOne<SurveyModel>({
      _id: new ObjectId(id)
    })
    return MongoHelper.map(survey)
  }
}

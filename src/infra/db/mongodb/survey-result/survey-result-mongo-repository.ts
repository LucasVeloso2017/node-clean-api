import { SurveyResultModel } from 'domain/models/survey-result'
import { SaveSurveyResultModel } from 'domain/useCases/save-survey-result'
import { ObjectId } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SaveSurveyResultRepository } from './../../../../data/protocols/db/survey/save-survey-result-repository'

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save (data: SaveSurveyResultModel): Promise<SurveyResultModel> {
    const saveSurveyCollection = await MongoHelper.getCollection('survey-result')
    const saveOrInsert = await saveSurveyCollection.findOneAndUpdate({
      surveyId: new ObjectId(data.surveyId),
      accountId: new ObjectId(data.accountId)
    }, {
      $set: {
        answer: data.answer,
        date: data.date
      }
    }, {
      upsert: true,
      returnDocument: 'after'
    })

    return MongoHelper.map<SurveyResultModel>(saveOrInsert.value)
  }
}

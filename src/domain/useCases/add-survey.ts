import { SurveyModel } from './../models/survey'

export interface AddSurveyModel extends Omit<SurveyModel, 'id'>{}

export interface AddSurvey{
  add: (account: AddSurveyModel) => Promise<void>
}


interface Answers{
  image?: string
  answer: string
}

export interface AddSurveyModel{
  question: string
  answers: Answers[]
}

export interface AddSurvey{
  add: (account: AddSurveyModel) => Promise<void>
}

import { Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,
  url: null as string,
  isConnected: null as boolean,
  async connect (url: string): Promise<void> {
    this.url = url
    this.client = await MongoClient.connect(url)
  },
  async disconnect (): Promise<void> {
    await this.client.close()
    this.isConnected = false
  },
  async getCollection (name: string): Promise<Collection> {
    return this.client.db().collection(name)
  },
  map: function <T=any>(data: any): T {
    return {
      id: data._id.toString(),
      ...data
    }
  }
}

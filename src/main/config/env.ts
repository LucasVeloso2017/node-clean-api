export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clea-node-api',
  port: process.env.PORT || 3000,
  secret: process.env.SECRET || 'MANGONODE',
  salt: Number(process.env.SALT) || 12
}
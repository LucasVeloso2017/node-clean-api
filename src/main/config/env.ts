export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT || 3000,
  secret: 'MANGONODE' || process.env.SECRET,
  salt: parseInt(process.env.SALT) || 12
}

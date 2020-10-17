const models = require('../../models')
const seedStocks = require('./stocks')
const db = require('../../db')
require('dotenv').config()

const DB_HOST =
  process.env.NODE_ENV === 'test' ? process.env.TEST_DB : process.env.DB_HOST

const seed = async () => {
  console.log('Seeding data')
  db.connect(DB_HOST)
  await models.Stock.deleteMany({})
  await models.Stock.create(await seedStocks())
  console.log('Data successfully seeded')
  process.exit(0)
}

seed()

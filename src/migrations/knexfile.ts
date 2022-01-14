import * as dotenv from 'dotenv-flow'
dotenv.config({ path: '../..' })
import * as getEnv from 'getenv'

const POSTGRES_HOST = getEnv('POSTGRES_HOST')
const POSTGRES_PORT = getEnv.int('POSTGRES_PORT')
const POSTGRES_USERNAME = getEnv('POSTGRES_USERNAME')
const POSTGRES_PASSWORD = getEnv('POSTGRES_PASSWORD')
const POSTGRES_DATABASE = getEnv('POSTGRES_DATABASE')

module.exports = {
  client: 'pg',
  connection: {
    host: POSTGRES_HOST,
    database: POSTGRES_DATABASE,
    port: POSTGRES_PORT,
    user: POSTGRES_USERNAME,
    password: POSTGRES_PASSWORD,
    application_name: 'knex',
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: '../../migrations',
  },
  seeds: {
    directory: '../../seeds',
  },
}

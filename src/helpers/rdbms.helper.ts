import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import * as getEnv from 'getenv'
import * as modelentities from '../models'
import * as modelsubscribers from '../models/subscribers'

const POSTGRES_LOGGING = getEnv.bool('POSTGRES_LOGGING')
const POSTGRES_HOST = getEnv('POSTGRES_HOST')
const POSTGRES_PORT = getEnv.int('POSTGRES_PORT')
const POSTGRES_USERNAME = getEnv('POSTGRES_USERNAME')
const POSTGRES_PASSWORD = getEnv('POSTGRES_PASSWORD')
const POSTGRES_DATABASE = getEnv('POSTGRES_DATABASE')

export const entities = Object.values(modelentities)
export const subscribers = Object.values(modelsubscribers)

export const rdbmsParams = (): TypeOrmModuleOptions => {
  const options: TypeOrmModuleOptions = {
    type: 'postgres',
    host: POSTGRES_HOST,
    port: POSTGRES_PORT,
    username: POSTGRES_USERNAME,
    password: POSTGRES_PASSWORD,
    database: POSTGRES_DATABASE,
    logging: POSTGRES_LOGGING,
    extra: {
      application_name: 'crospin',
      min: 4,
      max: 40,
    },
    logger: 'simple-console',
    synchronize: false,
    entities,
    subscribers,
  }
  return options
}

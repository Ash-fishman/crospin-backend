import * as dotenv from 'dotenv-flow'
dotenv.config()
import { configureTypeORMTransactions } from './helpers/transactions.helper'
import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import * as Express from 'express'
import * as getEnv from 'getenv'
import { AppModule } from './app.module'
import { Logger } from './helpers/logger.helper'
import { setupSwagger } from './helpers/swagger.helper'
import { setupPipes } from './helpers/pipes.helper'
import { setupFilters } from './helpers/filters.helper'

const APP_PORT = getEnv.int('APP_PORT')

async function bootstrap() {
  const logger = new Logger('bootstrap')
  configureTypeORMTransactions()
  const server = Express()
  server.get('/__health', (req, res) => res.send('ok'))

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: new Logger(),
  })
  app.enableCors()
  setupSwagger(app)
  setupPipes(app)
  setupFilters(app)
  await app.listen(APP_PORT)
  logger.log(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()

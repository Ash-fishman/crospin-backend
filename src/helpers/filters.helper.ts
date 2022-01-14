import { ArgumentsHost, HttpStatus, INestApplication } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { Logger } from './logger.helper'

interface Response {
  message: Array<string>;
}

interface FilterException {
  message: string;
  status?: number;
  response?: Response;
  getStatus?: () => number;
}

export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: FilterException, host: ArgumentsHost) {
    console.log(exception)
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    this.logger.error(JSON.stringify(exception, null, ' '))

    let status =
      (exception.getStatus && exception.getStatus()) || exception.status
    if (!status) {
      this.logger.crit('Exception not correctly handled')
      status = HttpStatus.INTERNAL_SERVER_ERROR
    }

    let message = exception.message || []
    if (exception.response) {
      message = exception.response.message
    }

    response.status(status).json(message)
  }
}

export const setupFilters = (app: INestApplication) => {
  app.useGlobalFilters(new AllExceptionsFilter())
}

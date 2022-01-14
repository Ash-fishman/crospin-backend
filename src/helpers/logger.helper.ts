import { LoggerService } from '@nestjs/common'
import * as winston from 'winston'
import * as getEnv from 'getenv'

const colorizer = winston.format.colorize()
const LOG_LEVEL = getEnv('LOG_LEVEL')

const getLogLevel = () => {
  switch (LOG_LEVEL) {
    case 'crit':
      return 'crit'
    case 'error':
      return 'error'
    case 'warn':
      return 'warning'
    case 'log':
      return 'notice'
    case 'debug':
      return 'info'
    case 'verbose':
      return 'debug'
    default:
      throw new Error(`Debug Level ${LOG_LEVEL} not recognized`)
  }
}

export class Logger implements LoggerService {
  private context: string
  private logger: winston.Logger

  constructor(context: string = null) {
    this.context = context

    const alignedWithColorsAndTime = winston.format.combine(
      winston.format.timestamp(),
      winston.format.align(),
      winston.format.printf((msg) => colorizer.colorize(msg.level, `${msg.timestamp} - ${msg.message.trim()}`)),
    )

    winston.addColors({
      error: 'red',
      warning: 'yellow',
      notice: 'green',
      info: 'magenta',
      debug: 'cyan',
    })

    this.logger = winston.createLogger({
      levels: winston.config.syslog.levels,
      level: getLogLevel(),
      format: alignedWithColorsAndTime,
      transports: [new winston.transports.Console({ format: alignedWithColorsAndTime })],
    })
  }

  crit(message: string, trace?: string, context?: string) {
    this.logger.log('crit', this.getMessage(message, context, trace))
  }
  error(message: string, trace?: string, context?: string) {
    this.logger.log('error', this.getMessage(message, context, trace))
  }
  warn(message: string, context?: string) {
    this.logger.log('warning', this.getMessage(message, context))
  }
  log(message: string, context?: string) {
    this.logger.log('notice', this.getMessage(message, context))
  }
  debug?(message: string, context?: string) {
    this.logger.log('info', this.getMessage(message, context))
  }
  verbose?(message: string, context?: string) {
    this.logger.log('debug', this.getMessage(message, context))
  }

  private getMessage(message: string, context?: string, trace?: string) {
    const tr = trace ? `\n${trace}` : ''
    return `[${context || this.context}] ${message}${tr}`
  }
}

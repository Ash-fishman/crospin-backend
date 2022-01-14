import { JwtModuleOptions } from '@nestjs/jwt'
import * as getEnv from 'getenv'

const JWT_SECRET_KEY = getEnv('JWT_SECRET_KEY')
export const jwtParams = (): JwtModuleOptions => {
  return {
    secret: JWT_SECRET_KEY,
    signOptions: {},
  }
}

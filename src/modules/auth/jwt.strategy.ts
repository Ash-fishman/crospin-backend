import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import * as getEnv from 'getenv'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserTokenInfo } from '../../interfaces/request.interface'

const JWT_SECRET_KEY = getEnv('JWT_SECRET_KEY')

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: JWT_SECRET_KEY,
    })
  }

  async validate(
    userTokenInfo: UserTokenInfo,
    done: (err: string, user?: UserTokenInfo) => void
  ): Promise<void> {
    done(null, userTokenInfo)
  }
}

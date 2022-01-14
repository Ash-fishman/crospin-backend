import { Inject, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-google-verify-token'
import { Provider } from '../../enums/provider.enum'
import { googleParams } from '../../helpers/google.helper'
import { Logger } from '../../helpers/logger.helper'
import { UserTokenInfo } from '../../interfaces/request.interface'
import { AuthService } from './auth.service'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(GoogleStrategy.name)

  @Inject()
  private authService: AuthService

  constructor() {
    super(googleParams())
  }

  async validate(accessToken: string, refreshToken: string, profile, done): Promise<void> {
    this.logger.debug(`Access Token: ${accessToken} refreshToken: ${refreshToken}`)
    const { name, emails } = profile
    const email = emails[0]

    const user = await this.authService.createOrReplaceUser(email, name, Provider.Google)
    const userTokenInfo: UserTokenInfo = {
      id: user.id,
      emailAddress: user.emailAddress,
      fullName: user.fullName,
      role: user.role,
    }

    this.logger.log(`Email ${email} has logged in`)
    done(null, userTokenInfo)

  }
}

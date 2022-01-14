import { Inject, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import * as getEnv from 'getenv'
import { Profile, Strategy } from 'passport-facebook-token-nest'
import { Provider } from '../../enums/provider.enum'
import { facebookParams } from '../../helpers/facebook.helper'
import { Logger } from '../../helpers/logger.helper'
import { UserTokenInfo } from '../../interfaces/request.interface'
import { AuthService } from './auth.service'
import { FacebookMockStrategy } from './mock.strategy'

const StrategyToUse = getEnv('NODE_ENV') === 'test' && getEnv('FACEBOOK_TEST_ACCESS_TOKEN', '') === '' ? FacebookMockStrategy : Strategy
@Injectable()
export class FacebookStrategy extends PassportStrategy(StrategyToUse) {
  private readonly logger = new Logger(FacebookStrategy.name)

  @Inject()
  private authService: AuthService

  constructor() {
    super(facebookParams())
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile,
    done: (err: string, user: UserTokenInfo) => void
  ): Promise<void> {
    this.logger.debug(`Access Token: ${accessToken} refreshToken: ${refreshToken}`)
    const { emails, name: { familyName: lastName, givenName: firstName }, } = profile
    const email = emails[0].value
    this.logger.log(`Email ${email} has logged in`)
    const user = await this.authService.createOrReplaceUser(email, firstName + ' ' + lastName, Provider.Facebook)
    const userTokenInfo: UserTokenInfo = {
      id: user.id,
      emailAddress: user.emailAddress,
      fullName: user.fullName,
      role: user.role,
    }

    done(null, userTokenInfo)
  }
}

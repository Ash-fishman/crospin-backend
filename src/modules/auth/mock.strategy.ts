import { Inject, Injectable } from '@nestjs/common'
import { MockStrategy } from 'passport-mock-strategy'
import { Provider } from '../../enums/provider.enum'
import { UserTokenInfo } from '../../interfaces/request.interface'
import { AuthService } from './auth.service'

@Injectable()
abstract class CustomMockStrategy extends MockStrategy {
  @Inject()
  private authService: AuthService

  constructor(name: string) {
    super({ name }, async (profile, done) => {
      const user = await this.authService.createOrReplaceUser(
        profile.emails[0].value, profile.name.familyName, Provider.Facebook
      )
      const userTokenInfo: UserTokenInfo = {
        id: user.id, emailAddress: user.emailAddress, fullName: user.fullName, role: user.role,
      }
      done(null, userTokenInfo)
    })
  }
}

@Injectable()
export class FacebookMockStrategy extends CustomMockStrategy {
  constructor() {
    super('facebook-token')
  }
}

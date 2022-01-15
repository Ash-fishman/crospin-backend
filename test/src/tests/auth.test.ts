import { HttpStatus } from '@nestjs/common'
import * as expect from 'expect'
import * as getEnv from 'getenv'
import { Role } from '../../../src/enums/role.enum'
import { Test, TestSuite } from '../../helpers/decorators'
import { AbstractTestSuite } from '../abstract-test-suite'

@TestSuite('Auth Suite')
export class AuthTest extends AbstractTestSuite {

  @Test('Facebook Login')
  public async facebookLogin() {
    const FACEBOOK_TEST_ACCESS_TOKEN = getEnv('FACEBOOK_TEST_ACCESS_TOKEN', '')
    console.log(FACEBOOK_TEST_ACCESS_TOKEN)

    const {
      body: { access_token },
    } = await this.httpPost('/auth/facebook')
      .send({ access_token: FACEBOOK_TEST_ACCESS_TOKEN })
      .expect(HttpStatus.OK)

    expect(access_token).not.toBeUndefined()
    expect(access_token).not.toBeNull()

    await this.httpTokenPost('/auth/assign_role', access_token)
      .send({ role: Role.Artist })
      .expect(HttpStatus.OK)
  }

  // @Test('Google Login')
  // public async googleLogin() {
  //   const GOOGLE_TEST_ACCESS_TOKEN = 'X'

  //   const {
  //     body: { access_token },
  //   } = await this.httpPost('/auth/google')
  //     .send({ access_token: GOOGLE_TEST_ACCESS_TOKEN })
  //     .expect(HttpStatus.OK)

  //   expect(access_token).not.toBeUndefined()
  //   expect(access_token).not.toBeNull()

  //   await this.httpTokenPost('/auth/assign_role', access_token)
  //     .send({ role: Role.Artist })
  //     .expect(HttpStatus.OK)
  // }
}

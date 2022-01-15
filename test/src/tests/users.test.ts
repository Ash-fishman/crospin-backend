import { HttpStatus } from '@nestjs/common'
import { Test, TestSuite } from '../../helpers/decorators'
import { AbstractTestSuite } from '../abstract-test-suite'
import { v4 as uuidv4 } from 'uuid'
// import * as expect from 'expect'
@TestSuite('Users Suite')
export class UsersTest extends AbstractTestSuite {

  @Test('User uploads photo')
  public async userUploadsPhotoTest(): Promise<string> {
    const filename = `${uuidv4()}-avatar.png`
    await this.httpArtistPost('/users/upload/photo')
      .attach('photo', './test/src/tests/resources/avatar.png', { filename })
      .expect(HttpStatus.CREATED)
    return filename
  }

}

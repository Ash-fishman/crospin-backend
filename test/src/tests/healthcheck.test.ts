import { HttpStatus } from '@nestjs/common'
import { Test, TestSuite } from '../../helpers/decorators'
import { AbstractTestSuite } from '../abstract-test-suite'

@TestSuite('Healthcheck Suite')
export class HealthcheckTest extends AbstractTestSuite {
  @Test('Test Healthcheck')
  public testHello() {
    return this.httpGet('/healthcheck').expect(HttpStatus.OK).expect('OK')
  }
}

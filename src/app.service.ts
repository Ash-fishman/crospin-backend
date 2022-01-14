import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'


@Injectable()
export class AppService {
  constructor (protected configService: ConfigService) {}

  getHello(): string {
    return this.configService.get('TEST_ENV')
  }

  getSuperSecret(): string {
    return this.configService.get('SUPER_SECRET')
  }
}

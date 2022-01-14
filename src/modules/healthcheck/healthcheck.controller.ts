import { Controller, Get } from '@nestjs/common'

@Controller()
export class HealthcheckController {
  @Get()
  getHello(): string {
    return 'OK'
  }
}

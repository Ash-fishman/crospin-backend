import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { jwtParams } from '../../src/helpers/jwt.helper'
import { TestTokens } from './providers/test-tokens.service'
import * as providers from './tests'

@Module({
  imports: [JwtModule.register(jwtParams())],
  controllers: [],
  providers: [...Object.values(providers), TestTokens],
})
export class TestModule {}

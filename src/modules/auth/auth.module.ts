import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { jwtParams } from '../../helpers/jwt.helper'
import { UsersModule } from '../users/users.module'
import { AuthService } from './auth.service'
import { FacebookStrategy } from './facebook.strategy'
import { GoogleStrategy } from './google.strategy'
import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register(jwtParams())],
  providers: [AuthService, JwtStrategy, FacebookStrategy, GoogleStrategy],
  exports: [AuthService, JwtModule],
})
export class AuthModule { }

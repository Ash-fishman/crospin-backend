import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { Transactional } from 'typeorm-transactional-cls-hooked'
import { Logger } from '../../helpers/logger.helper'
import { EthglobalRequest } from '../../interfaces/request.interface'
import { AccessTokenType } from '../../types/access-token.type'
import { AuthService } from '../auth/auth.service'
import { FacebookAuthGuard } from '../auth/facebook-auth.guard'
import { GoogleAuthGuard } from '../auth/google-auth.guard'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { AssignRoleDto } from './dto/assign-role.dto'

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name)

  @Inject()
  private authService: AuthService

  @Post('/facebook')
  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @UseGuards(FacebookAuthGuard)
  async facebookLoginRedirect(
    @Request() { user }: EthglobalRequest
  ): Promise<AccessTokenType> {
    this.logger.debug(`Facebook log in with user: ${user.emailAddress}`)
    return await this.authService.login(user)
  }

  @Post('/google')
  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @UseGuards(GoogleAuthGuard)
  async googleLoginRedirect(
    @Request() { user }: EthglobalRequest
  ): Promise<AccessTokenType> {
    this.logger.debug(`Google log in with user: ${user.emailAddress}`)
    return await this.authService.login(user)
  }

  @Post('/assign_role')
  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Transactional()
  async assignUserRole(
    @Request() { user }: EthglobalRequest,
    @Body() assignedRole: AssignRoleDto
  ) {
    this.logger.debug(`Assigning role to user: ${user.emailAddress}`)
    await this.authService.assignRole(user, assignedRole)
  }
}

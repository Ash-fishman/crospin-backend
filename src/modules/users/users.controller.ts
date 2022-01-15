import {
  Controller, Get, HttpCode, HttpStatus, Inject, Post, Request, Response, UploadedFile, UseGuards, UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiResponse } from '@nestjs/swagger'
import { Transactional } from 'typeorm-transactional-cls-hooked'
import { CrospinRequest } from '../../interfaces/request.interface'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { UsersService } from './users.service'

@Controller()
export class UsersController {
  @Inject()
  private readonly usersService: UsersService

  @Post('upload/photo')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('photo'))
  @Transactional()
  @ApiResponse({ status: HttpStatus.CREATED })
  @HttpCode(HttpStatus.CREATED)
  async uploadPhoto(@Request() { user }: CrospinRequest, @UploadedFile() photo: Express.Multer.File) {
    await this.usersService.uploadPhoto(user, photo)
  }

  @ApiResponse({ status: HttpStatus.OK })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('get/photo')
  @Transactional()
  async get(@Request() { user }: CrospinRequest, @Response() response): Promise<void> {
    return this.usersService.getPhoto(user, response);
  }

}

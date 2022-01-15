import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Response,
  StreamableFile,
  Inject,
  UseGuards,
  HttpStatus,
  Request,
  HttpCode
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ReconciliationService } from './reconciliation.service'
import * as fs from 'fs'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'
import { ConfigService } from '@nestjs/config'
import { Role } from '../../enums/role.enum'
import { Roles } from '../../decorators/roles.decorator'
import { Transactional } from 'typeorm-transactional-cls-hooked'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { ApiResponse } from '@nestjs/swagger'
import { CrospinRequest } from '../../interfaces/request.interface'
import { ListAudiosResponse } from './dto/list-audios-response.dto'

interface MultiplexDTO {
  video: string;
  audio: string;
}
@Controller()
export class ReconciliationController {
  @Inject()
  private readonly configService: ConfigService

  @Inject()
  private readonly reconciliationService: ReconciliationService

  @Post('upload/video')
  @UseInterceptors(FileInterceptor('video'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const { filename } = file
    return { filename }
  }

  @Post('upload/audio')
  @Roles(Role.Artist)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('audio'))
  @Transactional()
  @ApiResponse({ status: HttpStatus.CREATED })
  @HttpCode(HttpStatus.CREATED)
  async uploadAudio(@Request() { user }: CrospinRequest, @UploadedFile() file: Express.Multer.File) {
    await this.reconciliationService.uploadAudio(user, file)
  }

  @Post('upload/contract')
  @Roles(Role.Artist)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('contract'))
  @Transactional()
  @ApiResponse({ status: HttpStatus.CREATED })
  @HttpCode(HttpStatus.CREATED)
  async uploadContract(@Request() { user }: CrospinRequest, @UploadedFile() file: Express.Multer.File) {
    await this.reconciliationService.uploadAudio(user, file)
  }

  @Post('list/audios')
  @Roles(Role.Artist)
  @UseGuards(JwtAuthGuard)
  @Transactional()
  @ApiResponse({ status: HttpStatus.OK })
  @HttpCode(HttpStatus.OK)
  async listAudios(@Request() { user }: CrospinRequest): Promise<ListAudiosResponse> {
    const userFiles = await this.reconciliationService.listAudios(user)
    return new ListAudiosResponse(userFiles)
  }

  @Post('multiplex')
  async multiplex(
    @Body() dto: MultiplexDTO,
    @Response({ passthrough: true }) res
  ) {
    const ffmpeg = createFFmpeg({ log: true })

    await ffmpeg.load()
    ffmpeg.FS('writeFile', 'v.mp4', await fetchFile(`./upload/${dto.video}`))
    ffmpeg.FS('writeFile', 'a.ogg', await fetchFile(`./upload/${dto.audio}`))
    await ffmpeg.run(
      '-i',
      'v.mp4',
      '-i',
      'a.ogg',
      '-c:v',
      'copy',
      '-map',
      '0:v:0',
      '-map',
      '1:a:0',
      'new.mp4'
    )
    // https://superuser.com/questions/1137612/ffmpeg-replace-audio-in-video
    // similar to run ffmpeg -i v.mp4 -i a.wav -c:v copy -map 0:v:0 -map 1:a:0 new.mp4

    const filename = `new-${Date.now()}.mp4`
    const name = `./upload/${filename}`
    await fs.promises.writeFile(name, ffmpeg.FS('readFile', 'new.mp4'))

    fs.unlink(`./upload/${dto.video}`, () => '')
    fs.unlink(`./upload/${dto.audio}`, () => '')

    const file = fs.createReadStream(name)
    res.set({
      'Content-Type': 'video/mp4',
      'Content-Disposition': `attachment; filename="${filename}"`,
    })
    return new StreamableFile(file)
  }
}

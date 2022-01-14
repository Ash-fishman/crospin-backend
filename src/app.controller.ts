import { Body, Controller, Post, UploadedFile, UseInterceptors, Response, StreamableFile, Get } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AppService } from './app.service'
import * as fs from 'fs'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'

interface MultiplexDTO {
    video: string
    audio: string
}
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('sarasa')
  getSarasa(){
    return this.appService.getHello()
  }

  @Get('secret')
  getSecret(){
    return this.appService.getSuperSecret()
  }

  @Post('upload/video')
  @UseInterceptors(FileInterceptor('video'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const { filename } = file
    return { filename }
  }

  @Post('upload/audio')
  @UseInterceptors(FileInterceptor('audio'))
  uploadAudio(@UploadedFile() file: Express.Multer.File) {
    const { filename } = file
    return { filename }
  }

  @Post('multiplex')
  async multiplex(@Body() dto: MultiplexDTO, @Response({ passthrough: true }) res) {
    const ffmpeg = createFFmpeg({ log: true })

    await ffmpeg.load()
    ffmpeg.FS('writeFile', 'v.mp4', await fetchFile(`./upload/${dto.video}`))
    ffmpeg.FS('writeFile', 'a.ogg', await fetchFile(`./upload/${dto.audio}`))
    await ffmpeg.run('-i', 'v.mp4', '-i', 'a.ogg', '-c:v', 'copy', '-map', '0:v:0', '-map', '1:a:0', 'new.mp4')
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

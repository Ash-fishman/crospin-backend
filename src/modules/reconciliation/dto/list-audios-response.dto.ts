import { ApiProperty } from '@nestjs/swagger'
import { UserFile } from '../../../models/user-file.entity'
import { UserFileDto } from './user-file.dto'

export class ListAudiosResponse {

  @ApiProperty()
  audios: Array<UserFileDto>

  constructor(userFiles: Array<UserFile>) {
    this.audios = userFiles.map((p) => new UserFileDto(p))
  }
}

import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { UserFile } from '../../../models/user-file.entity'

export class UserFileDto {
    @ApiProperty()
    @IsString()
    id: string

    @ApiProperty()
    @IsString()
    originalFileName: string

    constructor(userFile: UserFile) {
        this.id = userFile.id
        this.originalFileName = userFile.originalFileName
    }
}

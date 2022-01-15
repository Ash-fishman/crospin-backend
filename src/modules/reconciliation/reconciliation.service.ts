import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FileType } from '../../enums/file-type.enum'
import { uploadAudio, uploadContract } from '../../helpers/ipfs.helper'
import { Logger } from '../../helpers/logger.helper'
import { UserTokenInfo } from '../../interfaces/request.interface'
import { UserFile } from '../../models/user-file.entity'
import { ListAudiosRequestDto } from './dto/list-audios-request.dto'

@Injectable()
export class ReconciliationService {

  private readonly logger = new Logger(ReconciliationService.name)

  @InjectRepository(UserFile)
  private readonly userFileRepository: Repository<UserFile>

  async uploadAudio(user: UserTokenInfo, audio: Express.Multer.File) {
    this.logger.debug('Uploading audio:' + audio.originalname)
    const fileId = await uploadAudio(audio)
    this.logger.debug('Saving audio with file id:' + fileId)
    await this.userFileRepository.save({ user, fileId, originalFileName: audio.originalname, mimeType: audio.mimetype, size: audio.size, fileType: FileType.AUDIO })
  }

  async uploadContract(user: UserTokenInfo, audio: Express.Multer.File) {
    this.logger.debug('Uploading contract:' + audio.originalname)
    const fileId = await uploadContract(audio)
    this.logger.debug('Saving contract with file id:' + fileId)
    await this.userFileRepository.save({ user, fileId, originalFileName: audio.originalname, mimeType: audio.mimetype, size: audio.size, fileType: FileType.CONTRACT })
  }
  async listAudios(user: UserTokenInfo, filter: ListAudiosRequestDto): Promise<Array<UserFile>> {
    this.logger.debug('Listing audios of user:' + user.emailAddress)
    const query = this.userFileRepository.createQueryBuilder('a')
      .where('a.userId = :userId', { userId: user.id })
      .andWhere('a.fileType = :fileType', { fileType: FileType.AUDIO })

    if (filter.name) {
      query.where('LOWER(a.originalFileName) = LOWER(:name)', { name: filter.name })
    }

    return await query.getMany()
  }
}

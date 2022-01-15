import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserTokenInfo } from '../../interfaces/request.interface'
import { Repository } from 'typeorm'
import { Role } from '../../enums/role.enum'
import { Logger } from '../../helpers/logger.helper'
import { User, UserFile } from '../../models'
import { getPhoto, uploadPhoto } from '../../helpers/aws.helper'
import { FileType } from '../../enums/file-type.enum'

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)

  @InjectRepository(User)
  private readonly userRepository: Repository<User>

  @InjectRepository(UserFile)
  private readonly userFileRepository: Repository<UserFile>

  async get(emailAddress: string, provider): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { emailAddress, provider } })
  }

  async assignRole(id: string, role: Role) {
    this.logger.debug('Assigning role to user')
    const { affected } = await this.userRepository.update(id, { role })
    if (affected === 0) throw new NotFoundException()
  }

  async getOrCreate(
    emailAddress: string,
    fullName: string,
    provider
  ): Promise<User | undefined> {
    this.logger.debug('Getting or Creating User')
    let user = await this.get(emailAddress, provider)
    if (user) {
      this.logger.debug('User obtained: ' + user.emailAddress)
      return user
    }
    else {
      this.logger.debug('Creating User: ' + emailAddress)
      user = await this.userRepository.save({ emailAddress, fullName, provider, })
      return user
    }
  }

  async uploadPhoto(user: UserTokenInfo, photo: Express.Multer.File) {
    this.logger.debug('Uploading photo:' + photo.originalname)
    const fileId = await uploadPhoto(photo)
    this.logger.debug('Saving photo with file id:' + fileId)
    const userFile = await this.userFileRepository.save({ user, fileId, originalFileName: photo.originalname, mimeType: photo.mimetype, size: photo.size, fileType: FileType.PHOTO })

    this.logger.debug('Updating user file id:' + userFile.id)
    await this.userRepository.update(user.id, { photoId: userFile.id })
  }

  async getPhoto(user: UserTokenInfo, response): Promise<void> {
    const current = await this.userRepository.findOne(user.id);
    if (!current) throw new NotFoundException();

    const photo = await getPhoto(current.photoId);

    response.setHeader('Type', 'image');
    response.setHeader('Content-Disposition', 'inline; filename=' + current.id);
    response.setHeader('Content-Length', photo.ContentLength);
    response.status(HttpStatus.OK).send(photo.Body);
  }

}

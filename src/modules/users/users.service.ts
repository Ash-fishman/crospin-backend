import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Role } from '../../enums/role.enum'
import { Logger } from '../../helpers/logger.helper'
import { User } from '../../models'

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)

  @InjectRepository(User)
  private readonly userRepository: Repository<User>

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
      user = await this.userRepository.save({
        emailAddress,
        fullName,
        provider,
      })
      return user
    }
  }
}

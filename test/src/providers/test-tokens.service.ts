import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as faker from 'faker'
import { Connection } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { Provider } from '../../../src/enums/provider.enum'
import { Role } from '../../../src/enums/role.enum'
import { User } from '../../../src/models'

@Injectable()
export class TestTokens implements OnModuleInit {
  public artistToken: string
  public contentCreatorToken: string

  @Inject()
  private readonly connection: Connection

  @Inject()
  private readonly jwtService: JwtService

  async onModuleInit() {
    const artist = await this.connection.manager.save(User, {
      emailAddress: `${uuidv4()}.artist@ethglobal.com`,
      fullName: `${faker.name.firstName()} ${faker.name.lastName()}`,
      role: Role.Artist,
      provider: Provider.Facebook,
    })
    const contentCreator = await this.connection.manager.save(User, {
      emailAddress: `${uuidv4()}.contentcreator@ethglobal.com`,
      fullName: `${faker.name.firstName()} ${faker.name.lastName()}`,
      role: Role.ContentCreator,
      provider: Provider.Facebook,
    })
    this.artistToken = this.jwtService.sign({
      id: artist.id,
      emailAddress: artist.emailAddress,
      role: artist.role,
    })
    this.contentCreatorToken = this.jwtService.sign({
      id: contentCreator.id,
      emailAddress: contentCreator.emailAddress,
      role: contentCreator.role,
    })
  }
}

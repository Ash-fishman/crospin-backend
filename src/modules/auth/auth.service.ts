import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserTokenInfo } from '../../interfaces/request.interface'
import { AccessTokenType } from '../../types/access-token.type'
import { User } from '../../models'
import { UsersService } from '../users/users.service'
import { AssignRoleDto } from '../app/dto/assign-role.dto'

@Injectable()
export class AuthService {
  @Inject()
  private usersService: UsersService

  @Inject()
  private jwtService: JwtService

  async login(user: UserTokenInfo): Promise<AccessTokenType> {
    const access_token = this.jwtService.sign({ ...user })
    return {
      access_token,
    }
  }

  async assignRole(user: UserTokenInfo, assignRole: AssignRoleDto) {
    await this.usersService.assignRole(user.id, assignRole.role)
  }

  async createOrReplaceUser(
    emailAddress: string,
    fullName: string,
    provider: string
  ): Promise<User> {
    return await this.usersService.getOrCreate(
      emailAddress,
      fullName,
      provider
    )
  }
  async getUser(emailAddress: string, provider: string): Promise<User> {
    return await this.usersService.get(emailAddress, provider)
  }
}

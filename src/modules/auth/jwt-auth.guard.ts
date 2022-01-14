import { ExecutionContext, Inject, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Logger } from '../../helpers/logger.helper'
import { UserTokenInfo } from '../../interfaces/request.interface'
import { ROLES_KEY } from '../../decorators/roles.decorator'
import { Role } from '../../enums/role.enum'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name)

  @Inject()
  private reflector: Reflector

  async canActivate(context: ExecutionContext) {
    this.logger.verbose('Checking if token is valid')
    await super.canActivate(context)

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredRoles) {
      return true
    }

    this.logger.verbose('Checking if method is restricted to some role')
    const user: UserTokenInfo = context.switchToHttp().getRequest().user
    this.logger.verbose(JSON.stringify(user))
    return requiredRoles.some((role) => user.role?.includes(role))
  }
}

import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'
import { Role } from '../../../enums/role.enum'

export class AssignRoleDto {
  @ApiProperty()
  @IsEnum(Role)
  role: Role
}

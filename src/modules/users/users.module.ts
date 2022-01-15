import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User, UserFile } from '../../models'
import { UsersService } from './users.service'

@Module({
  imports: [TypeOrmModule.forFeature([User, UserFile])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule { }

import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MulterModule } from '@nestjs/platform-express'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RouterModule } from 'nest-router'
import { multerParams } from './helpers/multer.helpers'
import { rdbmsParams } from './helpers/rdbms.helper'
import { controllersModules, routes } from './routes'

@Module({
  imports: [
    ConfigModule.forRoot(),
    RouterModule.forRoutes(routes),
    TypeOrmModule.forRoot(rdbmsParams()),
    MulterModule.registerAsync(multerParams),
    ...controllersModules,
  ],
})
export class AppModule {}

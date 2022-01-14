import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserFile } from '../../models/user-file.entity'
import { ReconciliationController } from './reconciliation.controller'
import { ReconciliationService } from './reconciliation.service'

@Module({
  imports: [TypeOrmModule.forFeature([UserFile]), ConfigModule],
  controllers: [ReconciliationController],
  providers: [ReconciliationService],
  exports: [ReconciliationService],
})
export class ReconciliationModule { }

import { Column, PrimaryColumn } from 'typeorm'

export abstract class AbstractEntity {
  @PrimaryColumn({ name: 'id' })
  id: string

  @Column({ type: 'timestamp with time zone', name: 'deleted_at', nullable: true, select: false })
  deletedAt: Date
}

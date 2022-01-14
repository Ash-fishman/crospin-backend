import { FileType } from '../enums/file-type.enum'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { AbstractEntity } from './abstract-entity.entity'
import { User } from './user.entity'

@Entity('users_files')
export class UserFile extends AbstractEntity {
    @ManyToOne(() => User, (user: User) => user.artistsAudios, {
        nullable: false,
    })
    @JoinColumn({ name: 'user_id' })
    user: User

    @Column({ name: 'user_id', nullable: false })
    userId: string

    @Column('character varying', { nullable: false, length: 255, name: 'file_id' })
    fileId: string

    @Column('character varying', { nullable: false, length: 255, name: 'file_type' })
    fileType: FileType

    @Column('character varying', { nullable: true, length: 255, name: 'original_file_name' })
    originalFileName: string

    @Column('character varying', { nullable: true, length: 255, name: 'mime_type' })
    mimeType: string

    @Column('numeric', { nullable: true, default: 0, precision: 8, name: 'size' })
    size: number
}

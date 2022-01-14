import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import { AbstractEntity } from '../abstract-entity.entity'

@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface {
  beforeInsert(event: InsertEvent<AbstractEntity>) {
    event.entity.id = uuidv4()
  }
}

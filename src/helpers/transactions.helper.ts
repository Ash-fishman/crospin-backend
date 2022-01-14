import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked'

export const configureTypeORMTransactions = () => {
  initializeTransactionalContext() // Initialize cls-hooked
  patchTypeORMRepositoryWithBaseRepository() // patch Repository with BaseRepository.
}

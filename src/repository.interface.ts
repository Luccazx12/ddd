import { Option } from 'oxide.ts';
import { AggregateRoot } from './aggregate-root.base';

/**
 * Generic repository interface for basic CRUD operations.
 * Most repositories will likely need generic save/find/delete operations,
 * so it's easier to have some shared interfaces.
 * More specific queries should be defined in a respective repository.
 */
export interface IRepository<Entity extends AggregateRoot<unknown>> {
  /**
   * Inserts a new entity into the repository.
   * @param entity - The entity to be inserted.
   * @returns A promise that resolves when the insertion is complete.
   */
  insert(entity: Entity): Promise<void>;

  /**
   * Finds an entity by its ID.
   * @param id - The ID of the entity to find.
   * @returns A promise that resolves to an Option containing the found entity, if any.
   */
  findOneById(id: string): Promise<Option<Entity>>;

  /**
   * Deletes an entity from the repository.
   * @param entity - The entity to be deleted.
   * @returns A promise that resolves to `true` if the deletion is successful, `false` otherwise.
   */
  delete(entity: Entity): Promise<boolean>;

  /**
   * Executes a transaction, running the provided handler function.
   * @param handler - The function to be executed within a transaction.
   * @returns A promise that resolves to the result of the transaction.
   */
  transaction<T>(handler: () => Promise<T>): Promise<T>;
}

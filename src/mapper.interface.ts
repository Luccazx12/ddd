import { Entity } from "./entity.base";

/**
 * Mapper interface for translating between domain entities and database records.
 *
 * @typeparam DomainEntity - The domain entity type.
 * @typeparam DbRecord - The database record type.
 */
export interface Mapper<DomainEntity extends Entity<unknown>, DbRecord> {
  /**
   * Translates a domain entity to a database record.
   *
   * @param entity - The domain entity to be translated.
   * @returns The corresponding database record.
   */
  toPersistence(entity: DomainEntity): DbRecord;

  /**
   * Translates a database record to a domain entity.
   *
   * @param record - The database record to be translated.
   * @returns The corresponding domain entity.
   */
  toDomain<T>(record: T): DomainEntity;
}

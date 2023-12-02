import {
  ExceptionBase,
  ArgumentNotProvidedException,
  ArgumentInvalidException,
  ArgumentOutOfRangeException,
} from "@luccazx12/exceptions-base";
import { Guard } from "@luccazx12/guard";
import { Id } from "./id";
import { convertPropsToObject } from "./utils/convert-props-to-object.util";

const MAX_PROPS = 50;

export type AggregateId = Id;

export interface BaseEntityProps {
  id: AggregateId;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEntityProps<T> {
  id: AggregateId;
  props: T;
  createdAt?: Date;
  updatedAt?: Date;
}

/** Type definition for a valid entity with additional methods. */
type ValidEntity<EntityProps> = Entity<EntityProps> & {
  /**
   * Checks if two entities are equal by comparing their ID fields.
   * @param object - The entity to compare with.
   * @returns A boolean indicating whether the entities are equal.
   */
  equals(object?: Entity<EntityProps>): boolean;

  /**
   * Returns the current copy of the entity's properties.
   * @returns An object containing a copy of the entity's properties.
   */
  getPropsCopy(): EntityProps & BaseEntityProps;

  /**
   * Converts an entity and all sub-entities/Value Objects it contains
   * to a plain object with primitive types. Useful for logging.
   * @returns An object representing the entity.
   */
  toObject(): unknown;
};

/**
 * Abstract base class for entities in the domain.
 *
 * @typeparam EntityProps - The type of properties associated with the entity.
 */
export abstract class Entity<EntityProps> {
  /** Array to store validation errors. */
  private errors: ExceptionBase[] = [];

  /**
   * Creates an instance of the Entity class.
   * @param id - The unique identifier for the entity.
   * @param createdAt - The timestamp when the entity was created.
   * @param updatedAt - The timestamp when the entity was last updated.
   * @param props - The properties associated with the entity.
   */
  public constructor({
    id,
    createdAt,
    updatedAt,
    props,
  }: CreateEntityProps<EntityProps>) {
    // Set entity ID and validate properties during construction
    this.setId(id);
    this.validateProps(props);
    const now = new Date();
    this._createdAt = createdAt || now;
    this._updatedAt = updatedAt || now;
    this.props = props;
    // Validate entity-specific rules
    this.validate();
  }

  /** Protected properties for entity state. */
  protected readonly props: EntityProps;
  protected abstract _id: AggregateId;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  /** Public getter for the entity ID. */
  get id(): AggregateId {
    return this._id;
  }

  private setId(id: AggregateId): void {
    this._id = id;
  }

  /** Public getter for the timestamp when the entity was created. */
  get createdAt(): Date {
    return this._createdAt;
  }

  /** Public getter for the timestamp when the entity was last updated. */
  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Static method to check if an object is an instance of Entity.
   * @param entity - The object to check.
   * @returns A boolean indicating whether the object is an instance of Entity.
   */
  public static isEntity(entity: unknown): entity is Entity<unknown> {
    return entity instanceof Entity;
  }

  /**
   * Checks if the entity is valid by ensuring there are no validation errors.
   * @returns A boolean indicating whether the entity is valid.
   */
  public isValid(): this is ValidEntity<EntityProps> {
    // If there are errors, the entity is not valid
    if (this.errors.length > 0) return false;
    this.addValidEntityAttributes();
    return true;
  }

  /**
   * Adds an error to the errors array.
   * @param error - The error to add.
   */
  protected addError(error: ExceptionBase): void {
    this.errors.push(error);
  }

  /**
   * Validates the entity by checking certain invariants/rules.
   * Must be implemented by concrete entities.
   */
  public abstract validate(): void;

  /**
   * Validates the properties of the entity.
   * @param props - The properties to validate.
   * @addError {ArgumentNotProvidedException} - If entity props are empty.
   * @addError {ArgumentInvalidException} - If entity props are not an object.
   * @addError {ArgumentOutOfRangeException} - If entity props have too many properties.
   */
  private validateProps(props: EntityProps): void {
    if (Guard.isEmpty(props)) {
      this.addError(
        new ArgumentNotProvidedException("Entity props should not be empty")
      );
    }
    if (typeof props !== "object") {
      this.addError(
        new ArgumentInvalidException("Entity props should be an object")
      );
    }
    if (Object.keys(props as any).length > MAX_PROPS) {
      this.addError(
        new ArgumentOutOfRangeException(
          `Entity props should not have more than ${MAX_PROPS} properties`
        )
      );
    }
  }

  /**
   * Adds additional attributes to the Entity for valid instances.
   */
  private addValidEntityAttributes(): void {
    (this as any).equals = this.internalEquals.bind(this);
    (this as any).getPropsCopy = this.internalGetPropsCopy.bind(this);
    (this as any).toObject = this.internalToObject.bind(this);
  }

  /**
   * Checks if two entities are equal by comparing their ID fields.
   * @param object - The entity to compare with.
   * @returns A boolean indicating whether the entities are equal.
   */
  private internalEquals(object?: Entity<EntityProps>): boolean {
    return object !== null && object !== undefined && this.id === object.id;
  }

  /**
   * Returns the current copy of the entity's properties.
   * @returns An object containing a copy of the entity's properties.
   */
  private internalGetPropsCopy(): EntityProps & BaseEntityProps {
    const propsCopy = convertPropsToObject({
      id: this._id,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      ...this.props,
    });
    return Object.freeze(propsCopy);
  }

  /**
   * Converts an entity and all sub-entities/Value Objects it contains
   * to a plain object with primitive types. Useful for logging.
   * @returns An object representing the entity.
   */
  private internalToObject(): unknown {
    const plainProps = convertPropsToObject(this.props);

    const result = {
      id: this._id,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      ...plainProps,
    };
    return Object.freeze(result);
  }
}

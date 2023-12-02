import { ArgumentNotProvidedException } from "@luccazx12/exceptions-base";
import { Guard } from "@luccazx12/guard";
import { EventMetadata, Event } from "@luccazx12/eda";
import { AggregateId } from "../entity.base";
import { PrimitiveObject } from "../types";

/**
 * Properties for a domain event, excluding 'id', 'metadata', 'getName', 'getPrimitives', 'toPrimitives'.
 */
export type DomainEventProps<T> = Omit<
  T,
  "id" | "metadata" | "getName" | "getPrimitives" | "toPrimitives"
> & {
  aggregateId: AggregateId;
  metadata?: EventMetadata;
};

/**
 * Default primitive types for domain events.
 */
export interface DomainEventDefaultPrimitives extends PrimitiveObject {
  id: string;
  aggregateId: string;
  metadata?: EventMetadata;
}

/**
 * Primitive types for a domain event, excluding 'aggregateId'.
 */
export type DomainEventPrimitives<T> = Omit<DomainEventProps<T>, "aggregateId">;

/**
 * Parameter type for the 'fromPrimitives' method.
 */
export type FromPrimitivesParam<T> = T & DomainEventDefaultPrimitives;

/**
 * Abstract class representing a domain event.
 * Subclasses must implement the 'getPrimitives' method to convert the event to primitive types.
 */
export abstract class DomainEvent<Properties = unknown> extends Event {
  /**
   * Static method to create a domain event instance from primitive types.
   */
  public static fromPrimitives: (
    param: FromPrimitivesParam<any>
  ) => DomainEvent<any>;

  private committed = false;

  /** Aggregate ID where the domain event occurred. */
  public readonly aggregateId: string;

  /**
   * Creates an instance of DomainEvent.
   * @param props Properties for the domain event.
   */
  public constructor(props: DomainEventProps<unknown>) {
    super({ metadata: props.metadata });

    // Validate that props is not empty using Guard.
    if (Guard.isEmpty(props)) {
      throw new ArgumentNotProvidedException(
        `${this.constructor.name} props should not be empty`
      );
    }

    // Set the 'aggregateId' property from props.
    this.aggregateId = props.aggregateId.forceUnpack();
  }

  /**
   * Converts the domain event to primitive types.
   */
  public toPrimitives(): Omit<DomainEventProps<Properties>, "aggregateId"> &
    DomainEventDefaultPrimitives {
    return {
      id: this.id,
      aggregateId: this.aggregateId,
      metadata: this.metadata,
      ...this.getPrimitives(),
    };
  }

  /**
   * Method to be implemented by subclasses to provide the primitive types of the domain event.
   */
  protected abstract getPrimitives(): DomainEventPrimitives<Properties>;

  /**
   * Checks if the domain event has been committed.
   */
  public isCommitted(): boolean {
    return this.committed;
  }

  /**
   * Marks the domain event as committed.
   */
  public commit(): void {
    this.committed = true;
  }
}

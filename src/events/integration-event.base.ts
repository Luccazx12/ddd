import { EventMetadata, Event } from "@luccazx12/eda";
import { ArgumentNotProvidedException } from "@luccazx12/exceptions-base";
import { Guard } from "@luccazx12/guard";
import { Id } from "../id";

/**
 * Props for IntegrationEvent, excluding 'id' and 'metadata'.
 */
export type IntegrationEventProps<T> = Omit<T, "id" | "metadata"> & {
  id: Id;
  metadata?: EventMetadata;
  key?: string;
};

/**
 * IntegrationEvent is an abstract class representing an integration event in the system.
 * It extends the base Event class and includes additional properties like 'key'.
 */
export abstract class IntegrationEvent extends Event {
  /**
   * The version of the integration event.
   * Subclasses must provide their own implementation.
   */
  public abstract readonly version: string;

  /**
   * The optional 'key' associated with the integration event.
   */
  public readonly key?: string;

  /**
   * Creates an instance of IntegrationEvent.
   * @param props Properties for the integration event.
   */
  public constructor(props: IntegrationEventProps<unknown>) {
    super({ id: props.id.forceUnpack(), metadata: props.metadata });

    // Validate that props is not empty using Guard.
    if (Guard.isEmpty(props)) {
      throw new ArgumentNotProvidedException(
        `${this.constructor.name} props should not be empty`
      );
    }

    // Set the 'key' property from props, if provided.
    this.key = props.key;
  }
}

import { Handler } from "@luccazx12/eda";
import { DomainOrIntegrationEvent } from "../types";

/**
 * Interface for event handlers, extending the generic Handler interface.
 * It requires the implementation of a handle method to process events.
 */
export interface IEventHandler<E extends DomainOrIntegrationEvent> extends Handler<E> {
  /**
   * Handles the specified event.
   * @param event The event to be handled.
   * @returns A promise that resolves when the handling is complete.
   */
  handle(event: E): Promise<void>;
}

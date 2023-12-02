import { Bus } from "@luccazx12/eda";
import { DomainOrIntegrationEvent } from "../types";

/**
 * Interface for an event bus, extending the generic Bus interface.
 * It adds the ability to dispatch domain | integration events.
 */
export interface IEventBus extends Bus {
  /**
   * Dispatches the specified domain event.
   * @param event The domain | integration event to be dispatched.
   * @returns A promise that resolves when the dispatching is complete.
   */
  dispatch<T extends DomainOrIntegrationEvent>(event: T): Promise<void>;
}

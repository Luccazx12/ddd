import { DomainEvent } from "./domain-event.base";
import { IEventBus } from "./event-bus.interface";


/**
 * EventBusRouter is responsible for routing domain events to different event buses
 * based on their commitment status.
 */
export class EventBusRouter {
  /**
   * Creates an instance of EventBusRouter.
   * @param uncommittedEventBus The event bus for uncommitted events.
   * @param committedEventBus The event bus for committed events.
   */
  public constructor(
    private readonly uncommittedEventBus: IEventBus,
    private readonly committedEventBus: IEventBus,
  ) {}

  /**
   * Routes the specified domain event to the appropriate event bus
   * based on its commitment status.
   * @param domainEvent The domain event to be routed.
   * @returns A promise that resolves when the event is successfully dispatched.
   */
  public async route<T extends DomainEvent>(domainEvent: T): Promise<void> {
    if (domainEvent.isCommitted()) {
      return this.committedEventBus.dispatch(domainEvent);
    }

    return this.uncommittedEventBus.dispatch(domainEvent);
  }
}

import { ApplicationContext } from "@luccazx12/application-context";
import { Entity } from "./entity.base";
import { DomainEvent } from "./events/domain-event.base";
import { IEventBus } from "./events/event-bus.interface";
import { ILogger, Newable } from "./types";

/**
 * Abstract class representing an Aggregate Root.
 * @typeparam EntityProps - The type of properties of the entity.
 */
export abstract class AggregateRoot<EntityProps> extends Entity<EntityProps> {
  public static buildFromCreationEvent: (
    event: DomainEvent
  ) => AggregateRoot<any>;

  public version = 0;

  private _domainEvents: DomainEvent[] = [];

  /**
   * Pulls and returns the domain events.
   * Clears the internal domain events array.
   * @returns An array of domain events.
   */
  public pullDomainEvents(): DomainEvent[] {
    const domainEvents = this._domainEvents.slice();
    this._domainEvents = [];

    return domainEvents;
  }

  /**
   * Commits the internal domain events.
   */
  public commitEvents(): void {
    this._domainEvents.forEach((e) => e.commit());
  }

  /**
   * Clears the internal domain events array.
   */
  public clearEvents(): void {
    this._domainEvents = [];
  }

  /**
   * Publishes the internal domain events to the event bus.
   * @param logger - The logger instance.
   * @param eventBus - The event bus instance.
   */
  public async publishEvents(
    logger: ILogger,
    eventBus: IEventBus
  ): Promise<void> {
    await Promise.all(
      this._domainEvents.map(async (event) => {
        logger.debug(
          `${ApplicationContext.getCorrelationId()} - "${
            event.constructor.name
          }" event published for aggregate ${this.constructor.name} : ${
            this.id
          }`
        );
        event.commit();
        await eventBus.dispatch(event);
      })
    );
    this.clearEvents();
  }

  /**
   * Loads events from the history.
   * @param history - The array of domain events representing the history.
   * @param creationEvent - The creation event type.
   */
  public loadsFromHistory(
    history: DomainEvent[],
    creationEvent: Newable<DomainEvent>
  ): void {
    for (const event of history) {
      if (event instanceof creationEvent) continue;
      this.applyInternalEventChanges(event, false);
    }
  }

  /**
   * Applies a change to the aggregate and adds the event to the internal domain events array.
   * @param event - The domain event to apply.
   */
  protected applyChange(event: DomainEvent): void {
    this.applyInternalEventChanges(event, true);
  }

  private applyInternalEventChanges(event: DomainEvent, isNew: boolean): void {
    (this as any).apply(event);
    if (isNew) this._domainEvents.push(event);
  }
}

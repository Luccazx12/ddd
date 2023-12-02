import {
  EventEmitter,
  SubscriptionBus,
  AddSubscriberData,
} from "@luccazx12/eda";
import { DomainEvent } from "../domain-event.base";
import { IEventBus } from "../event-bus.interface";
import { DomainOrIntegrationEvent } from "../../types";

export class InMemoryAsyncEventBus implements IEventBus, SubscriptionBus {
  public constructor(protected readonly eventEmitter: EventEmitter) {}

  public async dispatch(event: DomainOrIntegrationEvent): Promise<void> {
    this.emit(event.getName(), event);
  }

  public addSubscriber(data: AddSubscriberData): void {
    const listener = async (event: DomainEvent) => data.handler.handle(event);
    this.on(data.messageConstructor.getName(), listener.bind(this));
  }

  private on<T>(eventName: string, listener: (data: T) => Promise<void>): void {
    this.eventEmitter.on(eventName, listener.bind(this));
  }

  private emit<T>(eventName: string, data: T): void {
    this.eventEmitter.emit(eventName, data);
  }
}

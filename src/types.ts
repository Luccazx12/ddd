import { DomainEvent } from "./events/domain-event.base";
import { IEventHandler } from "./events/event-handler.interface";
import { IntegrationEvent } from "./events/integration-event.base";

export type Newable<T> = new (...args: any[]) => T;
export type Primitives = string | number | boolean | symbol | undefined | null;

export interface StaticGetName {
  getName: () => string;
}

export interface NestedObject {
  [key: string]: Primitives | NestedObject;
}

export interface PrimitiveObject {
  [key: string]: Primitives | NestedObject;
}

export type ILogger = {
  debug(message: string, metadata?: any): void;
};

export type DomainOrIntegrationEvent = DomainEvent | IntegrationEvent;
export type EventHandlerType = IEventHandler<DomainOrIntegrationEvent>;
export type NewableEventHandler = Newable<EventHandlerType>;
export type NewableDomainOrIntegrationEvent =
  Newable<DomainOrIntegrationEvent> & StaticGetName;

import { HandlerRegistry } from "@luccazx12/eda";
import { NewableDomainOrIntegrationEvent, NewableEventHandler } from "../types";

/**
 * Decorator that registers an event handler for the specified events.
 * @param {NewableEvent[] | '*'} events - The events to register the handler for.
 * @returns {(handlerConstructor: T) => T} - The class decorator function.
 */
export function EventHandler<E extends NewableDomainOrIntegrationEvent>(
  events: E[] | "*"
): <T extends NewableEventHandler>(handlerConstructor: T) => T {
  /**
   * Class decorator function.
   * @param {T} handlerConstructor - The constructor of the event handler class.
   * @returns {T} - The modified event handler class.
   */
  return function classDecorator<T extends NewableEventHandler>(
    handlerConstructor: T
  ): T {
    // If events is a string '*', register the handler for all events.
    if (typeof events === "string") {
      HandlerRegistry.registerHandler(
        { getName: () => events } as NewableDomainOrIntegrationEvent,
        handlerConstructor,
        false
      );
    } else {
      // Register the handler for each specified event.
      events.forEach((event) =>
        HandlerRegistry.registerHandler(event, handlerConstructor, false)
      );
    }

    return handlerConstructor;
  };
}

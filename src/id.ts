import { ValueObject } from "./value-object.base";

export abstract class Id extends ValueObject<string> {
  /**
   * Returns a string representation of the ID.
   *
   * @returns The string representation of the ID.
   */
  public abstract toString(): string;
}

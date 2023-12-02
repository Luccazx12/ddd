import { ExceptionBase, ArgumentNotProvidedException } from "@luccazx12/exceptions-base";
import { Guard } from "@luccazx12/guard";
import { convertPropsToObject } from "./utils/convert-props-to-object.util";


/**
 * Domain Primitive is an object that contains only a single value.
 */
export type Primitives = string | number | boolean;
export interface DomainPrimitive<T extends Primitives | Date> {
  value: T;
}

type ValueObjectProps<T> = T extends Primitives | Date ? DomainPrimitive<T> : T;

type ValidValueObject<T> = ValueObject<T> & {
  /**
   * Compares the current ValueObject with another ValueObject for equality.
   * @param vo - The ValueObject to compare with.
   * @returns True if the ValueObjects are equal, False otherwise.
   */
  equals(vo?: ValueObject<T>): boolean;

  /**
   * Unpacks the value object to get its raw properties.
   * @returns The raw properties of the value object.
   */
  unpack(): T;
};

/**
 * Abstract base class for a Value Object in the domain.
 *
 * @typeparam T - The type of the value object.
 */
export abstract class ValueObject<T> {
  // Stores errors that occurred during validation.
  private readonly errors: ExceptionBase[] = [];

  /** The properties of the value object. */
  protected readonly props: ValueObjectProps<T>;

  // Checks if an object is an instance of ValueObject.
  static isValueObject(obj: unknown): obj is ValueObject<unknown> {
    return obj instanceof ValueObject;
  }

  /**
   * Creates an instance of the ValueObject class.
   * @param props - The properties of the value object.
   */
  public constructor(props: ValueObjectProps<T>) {
    this.checkIfEmpty(props);
    this.validate(props);
    this.props = props;
  }

  /**
   * Validates the properties of the value object.
   * @param props - The properties of the value object to validate.
   */
  protected abstract validate(props: ValueObjectProps<T>): void;

  /**
   * Forces the unpacking of the value object, returning its underlying properties.
   * Throws the accumulated validation errors if any.
   * @throws {ExceptionBase[]} - Array of validation errors, if any.
   * @returns The underlying properties of the unpacked value object.
   */
  public forceUnpack(): T {
    if (this.errors.length > 0) throw this.errors;
    return this.internalUnpack();
  }

  /**
   * Checks if the Value Object is valid.
   * @returns True if the Value Object is valid, False if there are validation errors.
   */
  public isValid(): this is ValidValueObject<T> {
    if (this.errors.length > 0) return false;
    this.addValidValueObjectAttributes();
    return true;
  }

  /**
   * Adds an error to the list of errors.
   * @param error - The error to be added.
   */
  protected addError(error: ExceptionBase): void {
    this.errors.push(error);
  }

  /**
   * Checks if properties are empty.
   * @param props - The properties to be checked.
   * @addError {ArgumentNotProvidedException} - If vo props are empty.
   */
  private checkIfEmpty(props: ValueObjectProps<T>): void {
    if (
      Guard.isEmpty(props) ||
      (this.isDomainPrimitive(props) && Guard.isEmpty(props.value))
    ) {
      this.addError(
        new ArgumentNotProvidedException('Properties cannot be empty'),
      );
    }
  }

  /**
   * Checks if an object is an instance of DomainPrimitive.
   * @param obj - The object to be checked.
   */
  private isDomainPrimitive(
    obj: unknown,
  ): obj is DomainPrimitive<T & (Primitives | Date)> {
    return Object.prototype.hasOwnProperty.call(obj, 'value');
  }

  /**
   * Adds additional attributes to the Value Object for valid instances.
   * @returns A boolean indicating whether the Value Object is valid.
   */
  private addValidValueObjectAttributes(): void {
    (this as any).equals = this.internalEquals.bind(this);
    (this as any).unpack = this.internalUnpack.bind(this);
  }

  /**
   * Unpacks the value object to get its raw properties.
   * @returns The raw properties of the value object.
   */
  private internalUnpack(): T {
    return this.isDomainPrimitive(this.props)
      ? this.props.value
      : Object.freeze(convertPropsToObject(this.props));
  }

  /**
   * Compares the current ValueObject with another ValueObject for equality.
   * @param vo - The ValueObject to compare with.
   * @returns True if the ValueObjects are equal, False otherwise.
   */
  private internalEquals(vo?: ValueObject<T>): boolean {
    return vo !== null && vo !== undefined
      ? JSON.stringify(this) === JSON.stringify(vo)
      : false;
  }
}

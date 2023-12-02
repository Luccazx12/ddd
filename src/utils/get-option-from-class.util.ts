import { Guard } from "@luccazx12/guard";
import { Option, None } from "oxide.ts/dist";
import { isDefinedAndNotEmpty } from "./is-defined-and-not-empty";
import { Newable } from "../types";


// eslint-disable-next-line complexity
export function getOptionFromClass<T>(
  classParameter: Newable<T>,
  value?: unknown
): Option<T> {
  if (
    Guard.isEmpty(value) ||
    Option(value).isNone() ||
    !isDefinedAndNotEmpty(value as string)
  ) {
    return None;
  }

  return Option(new classParameter(value));
}

export type ObjectMappingInstructions = Record<
  string,
  ObjectMappingInstruction
>;
export type ObjectMappingInstruction =
  | LazyValueInstruction
  | ConditionalLazyValueInstruction
  | SimpleValueInstruction
  | ConditionalValueInstruction
  | UnfilteredValue;
export type UnfilteredValue = any;
export type LazyValueInstruction = [FilterStatus, ValueSupplier];
export type ConditionalLazyValueInstruction = [
  FilterStatusSupplier,
  ValueSupplier
];
export type SimpleValueInstruction = [FilterStatus, Value];
export type ConditionalValueInstruction = [ValueFilteringFunction, Value];
export type FilterStatus = boolean | unknown | void;
export type FilterStatusSupplier = () => boolean;
export type ValueFilteringFunction = (value: any) => boolean;
export type ValueSupplier = () => any;
export type Value = any;
export declare function map(
  target: any,
  filter: (value: any) => boolean,
  instructions: Record<string, ValueSupplier | Value>
): typeof target;
export declare function map(
  instructions: Record<string, ObjectMappingInstruction>
): any;
export declare function map(
  target: any,
  instructions: Record<string, ObjectMappingInstruction>
): typeof target;
export declare const convertMap: (target: any) => Record<string, any>;

/// <amd-module name="@tensorflow/tfjs-core/dist/ops/sparse/sparse_reshape_util" />
/**
 * Generates sparse reshape multiple negative 1 output dimension error message.
 *
 * @param dim1 The first dimension with a negative 1 value.
 * @param dim2 The second dimension with a negative 1 value.
 */
export declare function getSparseReshapeMultipleNegativeOneOutputDimErrorMessage(dim1: number, dim2: number): string;
/**
 * Generates sparse reshape negative output dimension error message.
 *
 * @param dim The dimension with a negative value.
 * @param value The negative value.
 */
export declare function getSparseReshapeNegativeOutputDimErrorMessage(dim: number, value: number): string;
/**
 * Generates sparse reshape empty tensor zero output dimension error message.
 *
 */
export declare function getSparseReshapeEmptyTensorZeroOutputDimErrorMessage(): string;
/**
 * Generates sparse reshape input output multiple mismatch error message.
 *
 * @param inputShape the input shape.
 * @param outputShape the requested output shape.
 */
export declare function getSparseReshapeInputOutputMultipleErrorMessage(inputShape: number[], outputShape: number[]): string;
/**
 * Generates sparse reshape input output inequality error message.
 *
 * @param inputShape the input shape.
 * @param outputShape the requested output shape.
 */
export declare function getSparseReshapeInputOutputMismatchErrorMessage(inputShape: number[], outputShape: number[]): string;

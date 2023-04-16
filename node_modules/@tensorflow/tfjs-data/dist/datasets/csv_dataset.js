/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * =============================================================================
 */
import { util } from '@tensorflow/tfjs-core';
import { Dataset } from '../dataset';
import { TextLineDataset } from './text_line_dataset';
const CODE_QUOTE = '"';
const STATE_OUT = Symbol('out');
const STATE_FIELD = Symbol('field');
const STATE_QUOTE = Symbol('quote');
const STATE_QUOTE_AFTER_QUOTE = Symbol('quoteafterquote');
const STATE_WITHIN_QUOTE_IN_QUOTE = Symbol('quoteinquote');
/**
 * Represents a potentially large collection of delimited text records.
 *
 * The produced `TensorContainer`s each contain one key-value pair for
 * every column of the table.  When a field is empty in the incoming data, the
 * resulting value is `undefined`, or throw error if it is required.  Values
 * that can be parsed as numbers are emitted as type `number`, other values
 * are parsed as `string`.
 *
 * The results are not batched.
 *
 * @doc {heading: 'Data', subheading: 'Classes', namespace: 'data'}
 */
export class CSVDataset extends Dataset {
    /**
     * Create a `CSVDataset`.
     *
     * @param input A `DataSource` providing a chunked, UTF8-encoded byte stream.
     * @param csvConfig (Optional) A CSVConfig object that contains configurations
     *     of reading and decoding from CSV file(s).
     *
     *     hasHeader: (Optional) A boolean value that indicates whether the first
     *     row of provided CSV file is a header line with column names, and should
     *     not be included in the data. Defaults to `true`.
     *
     *     columnNames: (Optional) A list of strings that corresponds to
     *     the CSV column names, in order. If provided, it ignores the column
     *     names inferred from the header row. If not provided, infers the column
     *     names from the first row of the records. If hasHeader is false and
     *     columnNames is not provided, this method throws an error.
     *
     *     columnConfigs: (Optional) A dictionary whose key is column names, value
     *     is an object stating if this column is required, column's data type,
     *     default value, and if this column is label. If provided, keys must
     *     correspond to names provided in columnNames or inferred from the file
     *     header lines. If isLabel is true any column, returns an array of two
     *     items: the first item is a dict of features key/value pairs, the second
     *     item is a dict of labels key/value pairs. If no feature is marked as
     *     label, returns a dict of features only.
     *
     *     configuredColumnsOnly (Optional) If true, only columns provided in
     *     columnConfigs will be parsed and provided during iteration.
     *
     *     delimiter (Optional) The string used to parse each line of the input
     *     file. Defaults to `,`.
     */
    constructor(input, csvConfig) {
        super();
        this.input = input;
        this.hasHeader = true;
        this.fullColumnNames = null;
        this.columnNamesValidated = false;
        this.columnConfigs = null;
        this.configuredColumnsOnly = false;
        this.delimiter = ',';
        this.delimWhitespace = false;
        this.base = new TextLineDataset(input);
        if (!csvConfig) {
            csvConfig = {};
        }
        this.hasHeader = csvConfig.hasHeader === false ? false : true;
        this.fullColumnNames = csvConfig.columnNames;
        this.columnConfigs = csvConfig.columnConfigs;
        this.configuredColumnsOnly = csvConfig.configuredColumnsOnly;
        if (csvConfig.delimWhitespace) {
            util.assert(csvConfig.delimiter == null, () => 'Delimiter should not be provided when delimWhitespace is true.');
            this.delimWhitespace = true;
            this.delimiter = ' ';
        }
        else {
            this.delimiter = csvConfig.delimiter ? csvConfig.delimiter : ',';
        }
    }
    /**
     * Returns column names of the csv dataset. If `configuredColumnsOnly` is
     * true, return column names in `columnConfigs`. If `configuredColumnsOnly` is
     * false and `columnNames` is provided, `columnNames`. If
     * `configuredColumnsOnly` is false and `columnNames` is not provided, return
     * all column names parsed from the csv file. For example usage please go to
     * `tf.data.csv`.
     *
     * @doc {heading: 'Data', subheading: 'Classes'}
     */
    async columnNames() {
        if (!this.columnNamesValidated) {
            await this.setColumnNames();
        }
        return this.configuredColumnsOnly ? Object.keys(this.columnConfigs) :
            this.fullColumnNames;
    }
    /* 1) If `columnNames` is provided as string[], use this string[] as output
     * keys in corresponding order. The length must match the number of inferred
     * columns if `hasHeader` is true .
     * 2) If `columnNames` is not provided, parse header line as `columnNames` if
     * hasHeader is true. If `hasHeader` is false, throw an error.
     * 3) If `columnConfigs` is provided, all the keys in `columnConfigs` must
     * exist in parsed `columnNames`.
     */
    async setColumnNames() {
        const columnNamesFromFile = await this.maybeReadHeaderLine();
        if (!this.fullColumnNames && !columnNamesFromFile) {
            // Throw an error if columnNames is not provided and no header line.
            throw new Error('Column names must be provided if there is no header line.');
        }
        else if (this.fullColumnNames && columnNamesFromFile) {
            // Check provided columnNames match header line.
            util.assert(columnNamesFromFile.length === this.fullColumnNames.length, () => 'The length of provided columnNames (' +
                this.fullColumnNames.length.toString() +
                ') does not match the length of the header line read from ' +
                'file (' + columnNamesFromFile.length.toString() + ').');
        }
        if (!this.fullColumnNames) {
            this.fullColumnNames = columnNamesFromFile;
        }
        // Check if there are duplicate column names.
        const counts = this.fullColumnNames.reduce((countAcc, name) => {
            countAcc[name] = (countAcc[name] + 1) || 1;
            return countAcc;
        }, {});
        const duplicateNames = Object.keys(counts).filter((name) => (counts[name] > 1));
        util.assert(duplicateNames.length === 0, () => 'Duplicate column names found: ' + duplicateNames.toString());
        // Check if keys in columnConfigs match columnNames.
        if (this.columnConfigs) {
            for (const key of Object.keys(this.columnConfigs)) {
                const index = this.fullColumnNames.indexOf(key);
                if (index === -1) {
                    throw new Error('The key "' + key +
                        '" provided in columnConfigs does not match any of the column ' +
                        'names (' + this.fullColumnNames.toString() + ').');
                }
            }
        }
        this.columnNamesValidated = true;
    }
    async maybeReadHeaderLine() {
        if (this.hasHeader) {
            const iter = await this.base.iterator();
            const firstElement = await iter.next();
            if (firstElement.done) {
                throw new Error('No data was found for CSV parsing.');
            }
            const firstLine = firstElement.value;
            const headers = this.parseRow(firstLine, false);
            return headers;
        }
        else {
            return null;
        }
    }
    async iterator() {
        if (!this.columnNamesValidated) {
            await this.setColumnNames();
        }
        let lines = await this.base.iterator();
        if (this.hasHeader) {
            // We previously read the first line to get the columnNames.
            // Now that we're providing data, skip it.
            lines = lines.skip(1);
        }
        return lines.map(x => this.makeDataElement(x));
    }
    makeDataElement(line) {
        const values = this.parseRow(line);
        const features = {};
        const labels = {};
        for (let i = 0; i < this.fullColumnNames.length; i++) {
            const key = this.fullColumnNames[i];
            const config = this.columnConfigs ? this.columnConfigs[key] : null;
            if (this.configuredColumnsOnly && !config) {
                // This column is not selected.
                continue;
            }
            else {
                const value = values[i];
                let parsedValue = null;
                if (value === '') {
                    // If default value is provided, use it. If default value is not
                    // provided, set as undefined.
                    if (config && config.default !== undefined) {
                        parsedValue = config.default;
                    }
                    else if (config && (config.required || config.isLabel)) {
                        throw new Error(`Required column ${key} is empty in this line: ${line}`);
                    }
                    else {
                        parsedValue = undefined;
                    }
                }
                else {
                    // A value is present, so parse it based on type
                    const valueAsNum = Number(value);
                    if (isNaN(valueAsNum)) {
                        // The value is a string and this column is declared as boolean
                        // in config, parse it as boolean.
                        if (config && config.dtype === 'bool') {
                            parsedValue = this.getBoolean(value);
                        }
                        else {
                            // Set value as string
                            parsedValue = value;
                        }
                    }
                    else if (!config || !config.dtype) {
                        // If this value is a number and no type config is provided, return
                        // it as number.
                        parsedValue = valueAsNum;
                    }
                    else {
                        // If this value is a number and data type is provided, parse it
                        // according to provided data type.
                        switch (config.dtype) {
                            case 'float32':
                                parsedValue = valueAsNum;
                                break;
                            case 'int32':
                                parsedValue = Math.floor(valueAsNum);
                                break;
                            case 'bool':
                                parsedValue = this.getBoolean(value);
                                break;
                            default:
                                parsedValue = valueAsNum;
                        }
                    }
                }
                // Check if this column is label.
                (config && config.isLabel) ? labels[key] = parsedValue :
                    features[key] = parsedValue;
            }
        }
        // If label exists, return an object of features and labels as {xs:features,
        // ys:labels}, otherwise return features only.
        if (Object.keys(labels).length === 0) {
            return features;
        }
        else {
            return { xs: features, ys: labels };
        }
    }
    getBoolean(value) {
        if (value === '1' || value.toLowerCase() === 'true') {
            return 1;
        }
        else {
            return 0;
        }
    }
    // adapted from https://beta.observablehq.com/@mbostock/streaming-csv
    parseRow(line, validateElementCount = true) {
        const result = [];
        let readOffset = 0;
        const readLength = line.length;
        let currentState = STATE_OUT;
        // Goes through the line to parse quote.
        for (let i = 0; i < readLength; i++) {
            switch (currentState) {
                // Before enter a new field
                case STATE_OUT:
                    switch (line.charAt(i)) {
                        // Enter a quoted field
                        case CODE_QUOTE:
                            readOffset = i + 1;
                            currentState = STATE_QUOTE;
                            break;
                        // Read an empty field
                        case this.delimiter:
                            readOffset = i + 1;
                            // If delimiter is white space and configured to collapse
                            // multiple white spaces, ignore this white space.
                            if (this.delimiter === ' ' && this.delimWhitespace) {
                                break;
                            }
                            result.push('');
                            currentState = STATE_OUT;
                            break;
                        // Enter an unquoted field
                        default:
                            currentState = STATE_FIELD;
                            readOffset = i;
                            break;
                    }
                    break;
                // In an unquoted field
                case STATE_FIELD:
                    switch (line.charAt(i)) {
                        // Exit an unquoted field, add it to result
                        case this.delimiter:
                            result.push(line.substring(readOffset, i));
                            currentState = STATE_OUT;
                            readOffset = i + 1;
                            break;
                        default:
                    }
                    break;
                // In a quoted field
                case STATE_QUOTE:
                    switch (line.charAt(i)) {
                        // Read a quote after a quote
                        case CODE_QUOTE:
                            currentState = STATE_QUOTE_AFTER_QUOTE;
                            break;
                        default:
                    }
                    break;
                // This state means it's right after a second quote in a field
                case STATE_QUOTE_AFTER_QUOTE:
                    switch (line.charAt(i)) {
                        // Finished a quoted field
                        case this.delimiter:
                            result.push(line.substring(readOffset, i - 1));
                            currentState = STATE_OUT;
                            readOffset = i + 1;
                            break;
                        // Finished a quoted part in a quoted field
                        case CODE_QUOTE:
                            currentState = STATE_QUOTE;
                            break;
                        // In a quoted part in a quoted field
                        default:
                            currentState = STATE_WITHIN_QUOTE_IN_QUOTE;
                            break;
                    }
                    break;
                case STATE_WITHIN_QUOTE_IN_QUOTE:
                    switch (line.charAt(i)) {
                        // Exit a quoted part in a quoted field
                        case CODE_QUOTE:
                            currentState = STATE_QUOTE;
                            break;
                        default:
                    }
                    break;
                default:
            }
        }
        // Adds last item based on if it is quoted.
        if (currentState === STATE_QUOTE_AFTER_QUOTE) {
            result.push(line.substring(readOffset, readLength - 1));
        }
        else {
            result.push(line.substring(readOffset));
        }
        // Check if each row has the same number of elements as column names.
        if (validateElementCount && result.length !== this.fullColumnNames.length) {
            throw new Error(`Invalid row in csv file. Should have ${this.fullColumnNames.length} elements in a row, but got ${result}`);
        }
        return result;
    }
}
// TODO(soergel): add more basic datasets for parity with tf.data
// tf.data.FixedLengthRecordDataset()
// tf.data.TFRecordDataset()
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3N2X2RhdGFzZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi90ZmpzLWRhdGEvc3JjL2RhdGFzZXRzL2Nzdl9kYXRhc2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBRUgsT0FBTyxFQUFrQixJQUFJLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBSW5DLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUVwRCxNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUM7QUFDdkIsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2hDLE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNwQyxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDcEMsTUFBTSx1QkFBdUIsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUMxRCxNQUFNLDJCQUEyQixHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUUzRDs7Ozs7Ozs7Ozs7O0dBWUc7QUFDSCxNQUFNLE9BQU8sVUFBVyxTQUFRLE9BQXdCO0lBZ0d0RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQStCRztJQUNILFlBQStCLEtBQWlCLEVBQUUsU0FBcUI7UUFDckUsS0FBSyxFQUFFLENBQUM7UUFEcUIsVUFBSyxHQUFMLEtBQUssQ0FBWTtRQTlIeEMsY0FBUyxHQUFHLElBQUksQ0FBQztRQUNqQixvQkFBZSxHQUFhLElBQUksQ0FBQztRQUNqQyx5QkFBb0IsR0FBRyxLQUFLLENBQUM7UUFDN0Isa0JBQWEsR0FBa0MsSUFBSSxDQUFDO1FBQ3BELDBCQUFxQixHQUFHLEtBQUssQ0FBQztRQUM5QixjQUFTLEdBQUcsR0FBRyxDQUFDO1FBQ2hCLG9CQUFlLEdBQUcsS0FBSyxDQUFDO1FBMEg5QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDZCxTQUFTLEdBQUcsRUFBRSxDQUFDO1NBQ2hCO1FBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsU0FBUyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDOUQsSUFBSSxDQUFDLGVBQWUsR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBQzdDLElBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQztRQUM3QyxJQUFJLENBQUMscUJBQXFCLEdBQUcsU0FBUyxDQUFDLHFCQUFxQixDQUFDO1FBQzdELElBQUksU0FBUyxDQUFDLGVBQWUsRUFBRTtZQUM3QixJQUFJLENBQUMsTUFBTSxDQUNQLFNBQVMsQ0FBQyxTQUFTLElBQUksSUFBSSxFQUMzQixHQUFHLEVBQUUsQ0FDRCxnRUFBZ0UsQ0FBQyxDQUFDO1lBQzFFLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1lBQzVCLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO1NBQ3RCO2FBQU07WUFDTCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztTQUNsRTtJQUNILENBQUM7SUExSUQ7Ozs7Ozs7OztPQVNHO0lBQ0gsS0FBSyxDQUFDLFdBQVc7UUFDZixJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFO1lBQzlCLE1BQU0sSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQzdCO1FBQ0QsT0FBTyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDakMsSUFBSSxDQUFDLGVBQWUsQ0FBQztJQUMzRCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNLLEtBQUssQ0FBQyxjQUFjO1FBQzFCLE1BQU0sbUJBQW1CLEdBQUcsTUFBTSxJQUFJLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUM3RCxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsSUFBSSxDQUFDLG1CQUFtQixFQUFFO1lBQ2pELG9FQUFvRTtZQUNwRSxNQUFNLElBQUksS0FBSyxDQUNYLDJEQUEyRCxDQUFDLENBQUM7U0FDbEU7YUFBTSxJQUFJLElBQUksQ0FBQyxlQUFlLElBQUksbUJBQW1CLEVBQUU7WUFDdEQsZ0RBQWdEO1lBQ2hELElBQUksQ0FBQyxNQUFNLENBQ1AsbUJBQW1CLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUMxRCxHQUFHLEVBQUUsQ0FBQyxzQ0FBc0M7Z0JBQ3hDLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRTtnQkFDdEMsMkRBQTJEO2dCQUMzRCxRQUFRLEdBQUcsbUJBQW1CLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO1NBQ2xFO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDekIsSUFBSSxDQUFDLGVBQWUsR0FBRyxtQkFBbUIsQ0FBQztTQUM1QztRQUNELDZDQUE2QztRQUM3QyxNQUFNLE1BQU0sR0FBNEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQy9ELENBQUMsUUFBaUMsRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUMxQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNDLE9BQU8sUUFBUSxDQUFDO1FBQ2xCLENBQUMsRUFDRCxFQUFFLENBQUMsQ0FBQztRQUNSLE1BQU0sY0FBYyxHQUNoQixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsTUFBTSxDQUNQLGNBQWMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUMzQixHQUFHLEVBQUUsQ0FBQyxnQ0FBZ0MsR0FBRyxjQUFjLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztRQUN4RSxvREFBb0Q7UUFDcEQsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO1lBQ3RCLEtBQUssTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEVBQUU7Z0JBQ2pELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNoRCxJQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRTtvQkFDaEIsTUFBTSxJQUFJLEtBQUssQ0FDWCxXQUFXLEdBQUcsR0FBRzt3QkFDakIsK0RBQStEO3dCQUMvRCxTQUFTLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztpQkFDekQ7YUFDRjtTQUNGO1FBQ0QsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztJQUNuQyxDQUFDO0lBRU8sS0FBSyxDQUFDLG1CQUFtQjtRQUMvQixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbEIsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3hDLE1BQU0sWUFBWSxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3ZDLElBQUksWUFBWSxDQUFDLElBQUksRUFBRTtnQkFDckIsTUFBTSxJQUFJLEtBQUssQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO2FBQ3ZEO1lBQ0QsTUFBTSxTQUFTLEdBQVcsWUFBWSxDQUFDLEtBQUssQ0FBQztZQUM3QyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNoRCxPQUFPLE9BQU8sQ0FBQztTQUNoQjthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUM7U0FDYjtJQUNILENBQUM7SUF3REQsS0FBSyxDQUFDLFFBQVE7UUFDWixJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFO1lBQzlCLE1BQU0sSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQzdCO1FBQ0QsSUFBSSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3ZDLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQiw0REFBNEQ7WUFDNUQsMENBQTBDO1lBQzFDLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3ZCO1FBQ0QsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxlQUFlLENBQUMsSUFBWTtRQUMxQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25DLE1BQU0sUUFBUSxHQUFxQyxFQUFFLENBQUM7UUFDdEQsTUFBTSxNQUFNLEdBQXFDLEVBQUUsQ0FBQztRQUVwRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDcEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDbkUsSUFBSSxJQUFJLENBQUMscUJBQXFCLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ3pDLCtCQUErQjtnQkFDL0IsU0FBUzthQUNWO2lCQUFNO2dCQUNMLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDO2dCQUN2QixJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUU7b0JBQ2hCLGdFQUFnRTtvQkFDaEUsOEJBQThCO29CQUM5QixJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsT0FBTyxLQUFLLFNBQVMsRUFBRTt3QkFDMUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7cUJBQzlCO3lCQUFNLElBQUksTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUU7d0JBQ3hELE1BQU0sSUFBSSxLQUFLLENBQ1gsbUJBQW1CLEdBQUcsMkJBQTJCLElBQUksRUFBRSxDQUFDLENBQUM7cUJBQzlEO3lCQUFNO3dCQUNMLFdBQVcsR0FBRyxTQUFTLENBQUM7cUJBQ3pCO2lCQUNGO3FCQUFNO29CQUNMLGdEQUFnRDtvQkFDaEQsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUNqQyxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsRUFBRTt3QkFDckIsK0RBQStEO3dCQUMvRCxrQ0FBa0M7d0JBQ2xDLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxLQUFLLEtBQUssTUFBTSxFQUFFOzRCQUNyQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQzt5QkFDdEM7NkJBQU07NEJBQ0wsc0JBQXNCOzRCQUN0QixXQUFXLEdBQUcsS0FBSyxDQUFDO3lCQUNyQjtxQkFDRjt5QkFBTSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTt3QkFDbkMsbUVBQW1FO3dCQUNuRSxnQkFBZ0I7d0JBQ2hCLFdBQVcsR0FBRyxVQUFVLENBQUM7cUJBQzFCO3lCQUFNO3dCQUNMLGdFQUFnRTt3QkFDaEUsbUNBQW1DO3dCQUNuQyxRQUFRLE1BQU0sQ0FBQyxLQUFLLEVBQUU7NEJBQ3BCLEtBQUssU0FBUztnQ0FDWixXQUFXLEdBQUcsVUFBVSxDQUFDO2dDQUN6QixNQUFNOzRCQUNSLEtBQUssT0FBTztnQ0FDVixXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztnQ0FDckMsTUFBTTs0QkFDUixLQUFLLE1BQU07Z0NBQ1QsV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7Z0NBQ3JDLE1BQU07NEJBQ1I7Z0NBQ0UsV0FBVyxHQUFHLFVBQVUsQ0FBQzt5QkFDNUI7cUJBQ0Y7aUJBQ0Y7Z0JBQ0QsaUNBQWlDO2dCQUNqQyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQztvQkFDM0IsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFdBQVcsQ0FBQzthQUMxRDtTQUNGO1FBQ0QsNEVBQTRFO1FBQzVFLDhDQUE4QztRQUM5QyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNwQyxPQUFPLFFBQVEsQ0FBQztTQUVqQjthQUFNO1lBQ0wsT0FBTyxFQUFDLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBQyxDQUFDO1NBQ25DO0lBQ0gsQ0FBQztJQUVPLFVBQVUsQ0FBQyxLQUFhO1FBQzlCLElBQUksS0FBSyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssTUFBTSxFQUFFO1lBQ25ELE9BQU8sQ0FBQyxDQUFDO1NBQ1Y7YUFBTTtZQUNMLE9BQU8sQ0FBQyxDQUFDO1NBQ1Y7SUFDSCxDQUFDO0lBRUQscUVBQXFFO0lBQzdELFFBQVEsQ0FBQyxJQUFZLEVBQUUsb0JBQW9CLEdBQUcsSUFBSTtRQUN4RCxNQUFNLE1BQU0sR0FBYSxFQUFFLENBQUM7UUFDNUIsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ25CLE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDL0IsSUFBSSxZQUFZLEdBQUcsU0FBUyxDQUFDO1FBQzdCLHdDQUF3QztRQUN4QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ25DLFFBQVEsWUFBWSxFQUFFO2dCQUNwQiwyQkFBMkI7Z0JBQzNCLEtBQUssU0FBUztvQkFDWixRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQ3RCLHVCQUF1Qjt3QkFDdkIsS0FBSyxVQUFVOzRCQUNiLFVBQVUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDOzRCQUNuQixZQUFZLEdBQUcsV0FBVyxDQUFDOzRCQUMzQixNQUFNO3dCQUNSLHNCQUFzQjt3QkFDdEIsS0FBSyxJQUFJLENBQUMsU0FBUzs0QkFDakIsVUFBVSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7NEJBQ25CLHlEQUF5RDs0QkFDekQsa0RBQWtEOzRCQUNsRCxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssR0FBRyxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7Z0NBQ2xELE1BQU07NkJBQ1A7NEJBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQzs0QkFDaEIsWUFBWSxHQUFHLFNBQVMsQ0FBQzs0QkFDekIsTUFBTTt3QkFDUiwwQkFBMEI7d0JBQzFCOzRCQUNFLFlBQVksR0FBRyxXQUFXLENBQUM7NEJBQzNCLFVBQVUsR0FBRyxDQUFDLENBQUM7NEJBQ2YsTUFBTTtxQkFDVDtvQkFDRCxNQUFNO2dCQUNSLHVCQUF1QjtnQkFDdkIsS0FBSyxXQUFXO29CQUNkLFFBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRTt3QkFDdEIsMkNBQTJDO3dCQUMzQyxLQUFLLElBQUksQ0FBQyxTQUFTOzRCQUNqQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQzNDLFlBQVksR0FBRyxTQUFTLENBQUM7NEJBQ3pCLFVBQVUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDOzRCQUNuQixNQUFNO3dCQUNSLFFBQVE7cUJBQ1Q7b0JBQ0QsTUFBTTtnQkFDUixvQkFBb0I7Z0JBQ3BCLEtBQUssV0FBVztvQkFDZCxRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7d0JBQ3RCLDZCQUE2Qjt3QkFDN0IsS0FBSyxVQUFVOzRCQUNiLFlBQVksR0FBRyx1QkFBdUIsQ0FBQzs0QkFDdkMsTUFBTTt3QkFDUixRQUFRO3FCQUNUO29CQUNELE1BQU07Z0JBQ1IsOERBQThEO2dCQUM5RCxLQUFLLHVCQUF1QjtvQkFDMUIsUUFBUSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO3dCQUN0QiwwQkFBMEI7d0JBQzFCLEtBQUssSUFBSSxDQUFDLFNBQVM7NEJBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQy9DLFlBQVksR0FBRyxTQUFTLENBQUM7NEJBQ3pCLFVBQVUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDOzRCQUNuQixNQUFNO3dCQUNSLDJDQUEyQzt3QkFDM0MsS0FBSyxVQUFVOzRCQUNiLFlBQVksR0FBRyxXQUFXLENBQUM7NEJBQzNCLE1BQU07d0JBQ1IscUNBQXFDO3dCQUNyQzs0QkFDRSxZQUFZLEdBQUcsMkJBQTJCLENBQUM7NEJBQzNDLE1BQU07cUJBQ1Q7b0JBQ0QsTUFBTTtnQkFDUixLQUFLLDJCQUEyQjtvQkFDOUIsUUFBUSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO3dCQUN0Qix1Q0FBdUM7d0JBQ3ZDLEtBQUssVUFBVTs0QkFDYixZQUFZLEdBQUcsV0FBVyxDQUFDOzRCQUMzQixNQUFNO3dCQUNSLFFBQVE7cUJBQ1Q7b0JBQ0QsTUFBTTtnQkFDUixRQUFRO2FBQ1Q7U0FDRjtRQUNELDJDQUEyQztRQUMzQyxJQUFJLFlBQVksS0FBSyx1QkFBdUIsRUFBRTtZQUM1QyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3pEO2FBQU07WUFDTCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztTQUN6QztRQUNELHFFQUFxRTtRQUNyRSxJQUFJLG9CQUFvQixJQUFJLE1BQU0sQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUU7WUFDekUsTUFBTSxJQUFJLEtBQUssQ0FBQyx3Q0FDWixJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sK0JBQStCLE1BQU0sRUFBRSxDQUFDLENBQUM7U0FDekU7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0NBQ0Y7QUFFRCxpRUFBaUU7QUFDakUscUNBQXFDO0FBQ3JDLDRCQUE0QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCAyMDE4IEdvb2dsZSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICovXG5cbmltcG9ydCB7VGVuc29yQ29udGFpbmVyLCB1dGlsfSBmcm9tICdAdGVuc29yZmxvdy90ZmpzLWNvcmUnO1xuaW1wb3J0IHtEYXRhc2V0fSBmcm9tICcuLi9kYXRhc2V0JztcbmltcG9ydCB7RGF0YVNvdXJjZX0gZnJvbSAnLi4vZGF0YXNvdXJjZSc7XG5pbXBvcnQge0xhenlJdGVyYXRvcn0gZnJvbSAnLi4vaXRlcmF0b3JzL2xhenlfaXRlcmF0b3InO1xuaW1wb3J0IHtDb2x1bW5Db25maWcsIENTVkNvbmZpZ30gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHtUZXh0TGluZURhdGFzZXR9IGZyb20gJy4vdGV4dF9saW5lX2RhdGFzZXQnO1xuXG5jb25zdCBDT0RFX1FVT1RFID0gJ1wiJztcbmNvbnN0IFNUQVRFX09VVCA9IFN5bWJvbCgnb3V0Jyk7XG5jb25zdCBTVEFURV9GSUVMRCA9IFN5bWJvbCgnZmllbGQnKTtcbmNvbnN0IFNUQVRFX1FVT1RFID0gU3ltYm9sKCdxdW90ZScpO1xuY29uc3QgU1RBVEVfUVVPVEVfQUZURVJfUVVPVEUgPSBTeW1ib2woJ3F1b3RlYWZ0ZXJxdW90ZScpO1xuY29uc3QgU1RBVEVfV0lUSElOX1FVT1RFX0lOX1FVT1RFID0gU3ltYm9sKCdxdW90ZWlucXVvdGUnKTtcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgcG90ZW50aWFsbHkgbGFyZ2UgY29sbGVjdGlvbiBvZiBkZWxpbWl0ZWQgdGV4dCByZWNvcmRzLlxuICpcbiAqIFRoZSBwcm9kdWNlZCBgVGVuc29yQ29udGFpbmVyYHMgZWFjaCBjb250YWluIG9uZSBrZXktdmFsdWUgcGFpciBmb3JcbiAqIGV2ZXJ5IGNvbHVtbiBvZiB0aGUgdGFibGUuICBXaGVuIGEgZmllbGQgaXMgZW1wdHkgaW4gdGhlIGluY29taW5nIGRhdGEsIHRoZVxuICogcmVzdWx0aW5nIHZhbHVlIGlzIGB1bmRlZmluZWRgLCBvciB0aHJvdyBlcnJvciBpZiBpdCBpcyByZXF1aXJlZC4gIFZhbHVlc1xuICogdGhhdCBjYW4gYmUgcGFyc2VkIGFzIG51bWJlcnMgYXJlIGVtaXR0ZWQgYXMgdHlwZSBgbnVtYmVyYCwgb3RoZXIgdmFsdWVzXG4gKiBhcmUgcGFyc2VkIGFzIGBzdHJpbmdgLlxuICpcbiAqIFRoZSByZXN1bHRzIGFyZSBub3QgYmF0Y2hlZC5cbiAqXG4gKiBAZG9jIHtoZWFkaW5nOiAnRGF0YScsIHN1YmhlYWRpbmc6ICdDbGFzc2VzJywgbmFtZXNwYWNlOiAnZGF0YSd9XG4gKi9cbmV4cG9ydCBjbGFzcyBDU1ZEYXRhc2V0IGV4dGVuZHMgRGF0YXNldDxUZW5zb3JDb250YWluZXI+IHtcbiAgYmFzZTogVGV4dExpbmVEYXRhc2V0O1xuICBwcml2YXRlIGhhc0hlYWRlciA9IHRydWU7XG4gIHByaXZhdGUgZnVsbENvbHVtbk5hbWVzOiBzdHJpbmdbXSA9IG51bGw7XG4gIHByaXZhdGUgY29sdW1uTmFtZXNWYWxpZGF0ZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBjb2x1bW5Db25maWdzOiB7W2tleTogc3RyaW5nXTogQ29sdW1uQ29uZmlnfSA9IG51bGw7XG4gIHByaXZhdGUgY29uZmlndXJlZENvbHVtbnNPbmx5ID0gZmFsc2U7XG4gIHByaXZhdGUgZGVsaW1pdGVyID0gJywnO1xuICBwcml2YXRlIGRlbGltV2hpdGVzcGFjZSA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGNvbHVtbiBuYW1lcyBvZiB0aGUgY3N2IGRhdGFzZXQuIElmIGBjb25maWd1cmVkQ29sdW1uc09ubHlgIGlzXG4gICAqIHRydWUsIHJldHVybiBjb2x1bW4gbmFtZXMgaW4gYGNvbHVtbkNvbmZpZ3NgLiBJZiBgY29uZmlndXJlZENvbHVtbnNPbmx5YCBpc1xuICAgKiBmYWxzZSBhbmQgYGNvbHVtbk5hbWVzYCBpcyBwcm92aWRlZCwgYGNvbHVtbk5hbWVzYC4gSWZcbiAgICogYGNvbmZpZ3VyZWRDb2x1bW5zT25seWAgaXMgZmFsc2UgYW5kIGBjb2x1bW5OYW1lc2AgaXMgbm90IHByb3ZpZGVkLCByZXR1cm5cbiAgICogYWxsIGNvbHVtbiBuYW1lcyBwYXJzZWQgZnJvbSB0aGUgY3N2IGZpbGUuIEZvciBleGFtcGxlIHVzYWdlIHBsZWFzZSBnbyB0b1xuICAgKiBgdGYuZGF0YS5jc3ZgLlxuICAgKlxuICAgKiBAZG9jIHtoZWFkaW5nOiAnRGF0YScsIHN1YmhlYWRpbmc6ICdDbGFzc2VzJ31cbiAgICovXG4gIGFzeW5jIGNvbHVtbk5hbWVzKCkge1xuICAgIGlmICghdGhpcy5jb2x1bW5OYW1lc1ZhbGlkYXRlZCkge1xuICAgICAgYXdhaXQgdGhpcy5zZXRDb2x1bW5OYW1lcygpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb25maWd1cmVkQ29sdW1uc09ubHkgPyBPYmplY3Qua2V5cyh0aGlzLmNvbHVtbkNvbmZpZ3MpIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZ1bGxDb2x1bW5OYW1lcztcbiAgfVxuXG4gIC8qIDEpIElmIGBjb2x1bW5OYW1lc2AgaXMgcHJvdmlkZWQgYXMgc3RyaW5nW10sIHVzZSB0aGlzIHN0cmluZ1tdIGFzIG91dHB1dFxuICAgKiBrZXlzIGluIGNvcnJlc3BvbmRpbmcgb3JkZXIuIFRoZSBsZW5ndGggbXVzdCBtYXRjaCB0aGUgbnVtYmVyIG9mIGluZmVycmVkXG4gICAqIGNvbHVtbnMgaWYgYGhhc0hlYWRlcmAgaXMgdHJ1ZSAuXG4gICAqIDIpIElmIGBjb2x1bW5OYW1lc2AgaXMgbm90IHByb3ZpZGVkLCBwYXJzZSBoZWFkZXIgbGluZSBhcyBgY29sdW1uTmFtZXNgIGlmXG4gICAqIGhhc0hlYWRlciBpcyB0cnVlLiBJZiBgaGFzSGVhZGVyYCBpcyBmYWxzZSwgdGhyb3cgYW4gZXJyb3IuXG4gICAqIDMpIElmIGBjb2x1bW5Db25maWdzYCBpcyBwcm92aWRlZCwgYWxsIHRoZSBrZXlzIGluIGBjb2x1bW5Db25maWdzYCBtdXN0XG4gICAqIGV4aXN0IGluIHBhcnNlZCBgY29sdW1uTmFtZXNgLlxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyBzZXRDb2x1bW5OYW1lcygpIHtcbiAgICBjb25zdCBjb2x1bW5OYW1lc0Zyb21GaWxlID0gYXdhaXQgdGhpcy5tYXliZVJlYWRIZWFkZXJMaW5lKCk7XG4gICAgaWYgKCF0aGlzLmZ1bGxDb2x1bW5OYW1lcyAmJiAhY29sdW1uTmFtZXNGcm9tRmlsZSkge1xuICAgICAgLy8gVGhyb3cgYW4gZXJyb3IgaWYgY29sdW1uTmFtZXMgaXMgbm90IHByb3ZpZGVkIGFuZCBubyBoZWFkZXIgbGluZS5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnQ29sdW1uIG5hbWVzIG11c3QgYmUgcHJvdmlkZWQgaWYgdGhlcmUgaXMgbm8gaGVhZGVyIGxpbmUuJyk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmZ1bGxDb2x1bW5OYW1lcyAmJiBjb2x1bW5OYW1lc0Zyb21GaWxlKSB7XG4gICAgICAvLyBDaGVjayBwcm92aWRlZCBjb2x1bW5OYW1lcyBtYXRjaCBoZWFkZXIgbGluZS5cbiAgICAgIHV0aWwuYXNzZXJ0KFxuICAgICAgICAgIGNvbHVtbk5hbWVzRnJvbUZpbGUubGVuZ3RoID09PSB0aGlzLmZ1bGxDb2x1bW5OYW1lcy5sZW5ndGgsXG4gICAgICAgICAgKCkgPT4gJ1RoZSBsZW5ndGggb2YgcHJvdmlkZWQgY29sdW1uTmFtZXMgKCcgK1xuICAgICAgICAgICAgICB0aGlzLmZ1bGxDb2x1bW5OYW1lcy5sZW5ndGgudG9TdHJpbmcoKSArXG4gICAgICAgICAgICAgICcpIGRvZXMgbm90IG1hdGNoIHRoZSBsZW5ndGggb2YgdGhlIGhlYWRlciBsaW5lIHJlYWQgZnJvbSAnICtcbiAgICAgICAgICAgICAgJ2ZpbGUgKCcgKyBjb2x1bW5OYW1lc0Zyb21GaWxlLmxlbmd0aC50b1N0cmluZygpICsgJykuJyk7XG4gICAgfVxuICAgIGlmICghdGhpcy5mdWxsQ29sdW1uTmFtZXMpIHtcbiAgICAgIHRoaXMuZnVsbENvbHVtbk5hbWVzID0gY29sdW1uTmFtZXNGcm9tRmlsZTtcbiAgICB9XG4gICAgLy8gQ2hlY2sgaWYgdGhlcmUgYXJlIGR1cGxpY2F0ZSBjb2x1bW4gbmFtZXMuXG4gICAgY29uc3QgY291bnRzOiB7W2tleTogc3RyaW5nXTogbnVtYmVyfSA9IHRoaXMuZnVsbENvbHVtbk5hbWVzLnJlZHVjZShcbiAgICAgICAgKGNvdW50QWNjOiB7W2tleTogc3RyaW5nXTogbnVtYmVyfSwgbmFtZSkgPT4ge1xuICAgICAgICAgIGNvdW50QWNjW25hbWVdID0gKGNvdW50QWNjW25hbWVdICsgMSkgfHwgMTtcbiAgICAgICAgICByZXR1cm4gY291bnRBY2M7XG4gICAgICAgIH0sXG4gICAgICAgIHt9KTtcbiAgICBjb25zdCBkdXBsaWNhdGVOYW1lcyA9XG4gICAgICAgIE9iamVjdC5rZXlzKGNvdW50cykuZmlsdGVyKChuYW1lKSA9PiAoY291bnRzW25hbWVdID4gMSkpO1xuICAgIHV0aWwuYXNzZXJ0KFxuICAgICAgICBkdXBsaWNhdGVOYW1lcy5sZW5ndGggPT09IDAsXG4gICAgICAgICgpID0+ICdEdXBsaWNhdGUgY29sdW1uIG5hbWVzIGZvdW5kOiAnICsgZHVwbGljYXRlTmFtZXMudG9TdHJpbmcoKSk7XG4gICAgLy8gQ2hlY2sgaWYga2V5cyBpbiBjb2x1bW5Db25maWdzIG1hdGNoIGNvbHVtbk5hbWVzLlxuICAgIGlmICh0aGlzLmNvbHVtbkNvbmZpZ3MpIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHRoaXMuY29sdW1uQ29uZmlncykpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmZ1bGxDb2x1bW5OYW1lcy5pbmRleE9mKGtleSk7XG4gICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICdUaGUga2V5IFwiJyArIGtleSArXG4gICAgICAgICAgICAgICdcIiBwcm92aWRlZCBpbiBjb2x1bW5Db25maWdzIGRvZXMgbm90IG1hdGNoIGFueSBvZiB0aGUgY29sdW1uICcgK1xuICAgICAgICAgICAgICAnbmFtZXMgKCcgKyB0aGlzLmZ1bGxDb2x1bW5OYW1lcy50b1N0cmluZygpICsgJykuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5jb2x1bW5OYW1lc1ZhbGlkYXRlZCA9IHRydWU7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIG1heWJlUmVhZEhlYWRlckxpbmUoKSB7XG4gICAgaWYgKHRoaXMuaGFzSGVhZGVyKSB7XG4gICAgICBjb25zdCBpdGVyID0gYXdhaXQgdGhpcy5iYXNlLml0ZXJhdG9yKCk7XG4gICAgICBjb25zdCBmaXJzdEVsZW1lbnQgPSBhd2FpdCBpdGVyLm5leHQoKTtcbiAgICAgIGlmIChmaXJzdEVsZW1lbnQuZG9uZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGRhdGEgd2FzIGZvdW5kIGZvciBDU1YgcGFyc2luZy4nKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGZpcnN0TGluZTogc3RyaW5nID0gZmlyc3RFbGVtZW50LnZhbHVlO1xuICAgICAgY29uc3QgaGVhZGVycyA9IHRoaXMucGFyc2VSb3coZmlyc3RMaW5lLCBmYWxzZSk7XG4gICAgICByZXR1cm4gaGVhZGVycztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGBDU1ZEYXRhc2V0YC5cbiAgICpcbiAgICogQHBhcmFtIGlucHV0IEEgYERhdGFTb3VyY2VgIHByb3ZpZGluZyBhIGNodW5rZWQsIFVURjgtZW5jb2RlZCBieXRlIHN0cmVhbS5cbiAgICogQHBhcmFtIGNzdkNvbmZpZyAoT3B0aW9uYWwpIEEgQ1NWQ29uZmlnIG9iamVjdCB0aGF0IGNvbnRhaW5zIGNvbmZpZ3VyYXRpb25zXG4gICAqICAgICBvZiByZWFkaW5nIGFuZCBkZWNvZGluZyBmcm9tIENTViBmaWxlKHMpLlxuICAgKlxuICAgKiAgICAgaGFzSGVhZGVyOiAoT3B0aW9uYWwpIEEgYm9vbGVhbiB2YWx1ZSB0aGF0IGluZGljYXRlcyB3aGV0aGVyIHRoZSBmaXJzdFxuICAgKiAgICAgcm93IG9mIHByb3ZpZGVkIENTViBmaWxlIGlzIGEgaGVhZGVyIGxpbmUgd2l0aCBjb2x1bW4gbmFtZXMsIGFuZCBzaG91bGRcbiAgICogICAgIG5vdCBiZSBpbmNsdWRlZCBpbiB0aGUgZGF0YS4gRGVmYXVsdHMgdG8gYHRydWVgLlxuICAgKlxuICAgKiAgICAgY29sdW1uTmFtZXM6IChPcHRpb25hbCkgQSBsaXN0IG9mIHN0cmluZ3MgdGhhdCBjb3JyZXNwb25kcyB0b1xuICAgKiAgICAgdGhlIENTViBjb2x1bW4gbmFtZXMsIGluIG9yZGVyLiBJZiBwcm92aWRlZCwgaXQgaWdub3JlcyB0aGUgY29sdW1uXG4gICAqICAgICBuYW1lcyBpbmZlcnJlZCBmcm9tIHRoZSBoZWFkZXIgcm93LiBJZiBub3QgcHJvdmlkZWQsIGluZmVycyB0aGUgY29sdW1uXG4gICAqICAgICBuYW1lcyBmcm9tIHRoZSBmaXJzdCByb3cgb2YgdGhlIHJlY29yZHMuIElmIGhhc0hlYWRlciBpcyBmYWxzZSBhbmRcbiAgICogICAgIGNvbHVtbk5hbWVzIGlzIG5vdCBwcm92aWRlZCwgdGhpcyBtZXRob2QgdGhyb3dzIGFuIGVycm9yLlxuICAgKlxuICAgKiAgICAgY29sdW1uQ29uZmlnczogKE9wdGlvbmFsKSBBIGRpY3Rpb25hcnkgd2hvc2Uga2V5IGlzIGNvbHVtbiBuYW1lcywgdmFsdWVcbiAgICogICAgIGlzIGFuIG9iamVjdCBzdGF0aW5nIGlmIHRoaXMgY29sdW1uIGlzIHJlcXVpcmVkLCBjb2x1bW4ncyBkYXRhIHR5cGUsXG4gICAqICAgICBkZWZhdWx0IHZhbHVlLCBhbmQgaWYgdGhpcyBjb2x1bW4gaXMgbGFiZWwuIElmIHByb3ZpZGVkLCBrZXlzIG11c3RcbiAgICogICAgIGNvcnJlc3BvbmQgdG8gbmFtZXMgcHJvdmlkZWQgaW4gY29sdW1uTmFtZXMgb3IgaW5mZXJyZWQgZnJvbSB0aGUgZmlsZVxuICAgKiAgICAgaGVhZGVyIGxpbmVzLiBJZiBpc0xhYmVsIGlzIHRydWUgYW55IGNvbHVtbiwgcmV0dXJucyBhbiBhcnJheSBvZiB0d29cbiAgICogICAgIGl0ZW1zOiB0aGUgZmlyc3QgaXRlbSBpcyBhIGRpY3Qgb2YgZmVhdHVyZXMga2V5L3ZhbHVlIHBhaXJzLCB0aGUgc2Vjb25kXG4gICAqICAgICBpdGVtIGlzIGEgZGljdCBvZiBsYWJlbHMga2V5L3ZhbHVlIHBhaXJzLiBJZiBubyBmZWF0dXJlIGlzIG1hcmtlZCBhc1xuICAgKiAgICAgbGFiZWwsIHJldHVybnMgYSBkaWN0IG9mIGZlYXR1cmVzIG9ubHkuXG4gICAqXG4gICAqICAgICBjb25maWd1cmVkQ29sdW1uc09ubHkgKE9wdGlvbmFsKSBJZiB0cnVlLCBvbmx5IGNvbHVtbnMgcHJvdmlkZWQgaW5cbiAgICogICAgIGNvbHVtbkNvbmZpZ3Mgd2lsbCBiZSBwYXJzZWQgYW5kIHByb3ZpZGVkIGR1cmluZyBpdGVyYXRpb24uXG4gICAqXG4gICAqICAgICBkZWxpbWl0ZXIgKE9wdGlvbmFsKSBUaGUgc3RyaW5nIHVzZWQgdG8gcGFyc2UgZWFjaCBsaW5lIG9mIHRoZSBpbnB1dFxuICAgKiAgICAgZmlsZS4gRGVmYXVsdHMgdG8gYCxgLlxuICAgKi9cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHJlYWRvbmx5IGlucHV0OiBEYXRhU291cmNlLCBjc3ZDb25maWc/OiBDU1ZDb25maWcpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuYmFzZSA9IG5ldyBUZXh0TGluZURhdGFzZXQoaW5wdXQpO1xuICAgIGlmICghY3N2Q29uZmlnKSB7XG4gICAgICBjc3ZDb25maWcgPSB7fTtcbiAgICB9XG4gICAgdGhpcy5oYXNIZWFkZXIgPSBjc3ZDb25maWcuaGFzSGVhZGVyID09PSBmYWxzZSA/IGZhbHNlIDogdHJ1ZTtcbiAgICB0aGlzLmZ1bGxDb2x1bW5OYW1lcyA9IGNzdkNvbmZpZy5jb2x1bW5OYW1lcztcbiAgICB0aGlzLmNvbHVtbkNvbmZpZ3MgPSBjc3ZDb25maWcuY29sdW1uQ29uZmlncztcbiAgICB0aGlzLmNvbmZpZ3VyZWRDb2x1bW5zT25seSA9IGNzdkNvbmZpZy5jb25maWd1cmVkQ29sdW1uc09ubHk7XG4gICAgaWYgKGNzdkNvbmZpZy5kZWxpbVdoaXRlc3BhY2UpIHtcbiAgICAgIHV0aWwuYXNzZXJ0KFxuICAgICAgICAgIGNzdkNvbmZpZy5kZWxpbWl0ZXIgPT0gbnVsbCxcbiAgICAgICAgICAoKSA9PlxuICAgICAgICAgICAgICAnRGVsaW1pdGVyIHNob3VsZCBub3QgYmUgcHJvdmlkZWQgd2hlbiBkZWxpbVdoaXRlc3BhY2UgaXMgdHJ1ZS4nKTtcbiAgICAgIHRoaXMuZGVsaW1XaGl0ZXNwYWNlID0gdHJ1ZTtcbiAgICAgIHRoaXMuZGVsaW1pdGVyID0gJyAnO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRlbGltaXRlciA9IGNzdkNvbmZpZy5kZWxpbWl0ZXIgPyBjc3ZDb25maWcuZGVsaW1pdGVyIDogJywnO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGl0ZXJhdG9yKCk6IFByb21pc2U8TGF6eUl0ZXJhdG9yPFRlbnNvckNvbnRhaW5lcj4+IHtcbiAgICBpZiAoIXRoaXMuY29sdW1uTmFtZXNWYWxpZGF0ZWQpIHtcbiAgICAgIGF3YWl0IHRoaXMuc2V0Q29sdW1uTmFtZXMoKTtcbiAgICB9XG4gICAgbGV0IGxpbmVzID0gYXdhaXQgdGhpcy5iYXNlLml0ZXJhdG9yKCk7XG4gICAgaWYgKHRoaXMuaGFzSGVhZGVyKSB7XG4gICAgICAvLyBXZSBwcmV2aW91c2x5IHJlYWQgdGhlIGZpcnN0IGxpbmUgdG8gZ2V0IHRoZSBjb2x1bW5OYW1lcy5cbiAgICAgIC8vIE5vdyB0aGF0IHdlJ3JlIHByb3ZpZGluZyBkYXRhLCBza2lwIGl0LlxuICAgICAgbGluZXMgPSBsaW5lcy5za2lwKDEpO1xuICAgIH1cbiAgICByZXR1cm4gbGluZXMubWFwKHggPT4gdGhpcy5tYWtlRGF0YUVsZW1lbnQoeCkpO1xuICB9XG5cbiAgbWFrZURhdGFFbGVtZW50KGxpbmU6IHN0cmluZyk6IFRlbnNvckNvbnRhaW5lciB7XG4gICAgY29uc3QgdmFsdWVzID0gdGhpcy5wYXJzZVJvdyhsaW5lKTtcbiAgICBjb25zdCBmZWF0dXJlczoge1trZXk6IHN0cmluZ106IFRlbnNvckNvbnRhaW5lcn0gPSB7fTtcbiAgICBjb25zdCBsYWJlbHM6IHtba2V5OiBzdHJpbmddOiBUZW5zb3JDb250YWluZXJ9ID0ge307XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZnVsbENvbHVtbk5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBrZXkgPSB0aGlzLmZ1bGxDb2x1bW5OYW1lc1tpXTtcbiAgICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuY29sdW1uQ29uZmlncyA/IHRoaXMuY29sdW1uQ29uZmlnc1trZXldIDogbnVsbDtcbiAgICAgIGlmICh0aGlzLmNvbmZpZ3VyZWRDb2x1bW5zT25seSAmJiAhY29uZmlnKSB7XG4gICAgICAgIC8vIFRoaXMgY29sdW1uIGlzIG5vdCBzZWxlY3RlZC5cbiAgICAgICAgY29udGludWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHZhbHVlc1tpXTtcbiAgICAgICAgbGV0IHBhcnNlZFZhbHVlID0gbnVsbDtcbiAgICAgICAgaWYgKHZhbHVlID09PSAnJykge1xuICAgICAgICAgIC8vIElmIGRlZmF1bHQgdmFsdWUgaXMgcHJvdmlkZWQsIHVzZSBpdC4gSWYgZGVmYXVsdCB2YWx1ZSBpcyBub3RcbiAgICAgICAgICAvLyBwcm92aWRlZCwgc2V0IGFzIHVuZGVmaW5lZC5cbiAgICAgICAgICBpZiAoY29uZmlnICYmIGNvbmZpZy5kZWZhdWx0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHBhcnNlZFZhbHVlID0gY29uZmlnLmRlZmF1bHQ7XG4gICAgICAgICAgfSBlbHNlIGlmIChjb25maWcgJiYgKGNvbmZpZy5yZXF1aXJlZCB8fCBjb25maWcuaXNMYWJlbCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICBgUmVxdWlyZWQgY29sdW1uICR7a2V5fSBpcyBlbXB0eSBpbiB0aGlzIGxpbmU6ICR7bGluZX1gKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFyc2VkVmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEEgdmFsdWUgaXMgcHJlc2VudCwgc28gcGFyc2UgaXQgYmFzZWQgb24gdHlwZVxuICAgICAgICAgIGNvbnN0IHZhbHVlQXNOdW0gPSBOdW1iZXIodmFsdWUpO1xuICAgICAgICAgIGlmIChpc05hTih2YWx1ZUFzTnVtKSkge1xuICAgICAgICAgICAgLy8gVGhlIHZhbHVlIGlzIGEgc3RyaW5nIGFuZCB0aGlzIGNvbHVtbiBpcyBkZWNsYXJlZCBhcyBib29sZWFuXG4gICAgICAgICAgICAvLyBpbiBjb25maWcsIHBhcnNlIGl0IGFzIGJvb2xlYW4uXG4gICAgICAgICAgICBpZiAoY29uZmlnICYmIGNvbmZpZy5kdHlwZSA9PT0gJ2Jvb2wnKSB7XG4gICAgICAgICAgICAgIHBhcnNlZFZhbHVlID0gdGhpcy5nZXRCb29sZWFuKHZhbHVlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIFNldCB2YWx1ZSBhcyBzdHJpbmdcbiAgICAgICAgICAgICAgcGFyc2VkVmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKCFjb25maWcgfHwgIWNvbmZpZy5kdHlwZSkge1xuICAgICAgICAgICAgLy8gSWYgdGhpcyB2YWx1ZSBpcyBhIG51bWJlciBhbmQgbm8gdHlwZSBjb25maWcgaXMgcHJvdmlkZWQsIHJldHVyblxuICAgICAgICAgICAgLy8gaXQgYXMgbnVtYmVyLlxuICAgICAgICAgICAgcGFyc2VkVmFsdWUgPSB2YWx1ZUFzTnVtO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBJZiB0aGlzIHZhbHVlIGlzIGEgbnVtYmVyIGFuZCBkYXRhIHR5cGUgaXMgcHJvdmlkZWQsIHBhcnNlIGl0XG4gICAgICAgICAgICAvLyBhY2NvcmRpbmcgdG8gcHJvdmlkZWQgZGF0YSB0eXBlLlxuICAgICAgICAgICAgc3dpdGNoIChjb25maWcuZHR5cGUpIHtcbiAgICAgICAgICAgICAgY2FzZSAnZmxvYXQzMic6XG4gICAgICAgICAgICAgICAgcGFyc2VkVmFsdWUgPSB2YWx1ZUFzTnVtO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdpbnQzMic6XG4gICAgICAgICAgICAgICAgcGFyc2VkVmFsdWUgPSBNYXRoLmZsb29yKHZhbHVlQXNOdW0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICdib29sJzpcbiAgICAgICAgICAgICAgICBwYXJzZWRWYWx1ZSA9IHRoaXMuZ2V0Qm9vbGVhbih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcGFyc2VkVmFsdWUgPSB2YWx1ZUFzTnVtO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBDaGVjayBpZiB0aGlzIGNvbHVtbiBpcyBsYWJlbC5cbiAgICAgICAgKGNvbmZpZyAmJiBjb25maWcuaXNMYWJlbCkgPyBsYWJlbHNba2V5XSA9IHBhcnNlZFZhbHVlIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmZWF0dXJlc1trZXldID0gcGFyc2VkVmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIC8vIElmIGxhYmVsIGV4aXN0cywgcmV0dXJuIGFuIG9iamVjdCBvZiBmZWF0dXJlcyBhbmQgbGFiZWxzIGFzIHt4czpmZWF0dXJlcyxcbiAgICAvLyB5czpsYWJlbHN9LCBvdGhlcndpc2UgcmV0dXJuIGZlYXR1cmVzIG9ubHkuXG4gICAgaWYgKE9iamVjdC5rZXlzKGxhYmVscykubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gZmVhdHVyZXM7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHt4czogZmVhdHVyZXMsIHlzOiBsYWJlbHN9O1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0Qm9vbGVhbih2YWx1ZTogc3RyaW5nKTogbnVtYmVyIHtcbiAgICBpZiAodmFsdWUgPT09ICcxJyB8fCB2YWx1ZS50b0xvd2VyQ2FzZSgpID09PSAndHJ1ZScpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gIH1cblxuICAvLyBhZGFwdGVkIGZyb20gaHR0cHM6Ly9iZXRhLm9ic2VydmFibGVocS5jb20vQG1ib3N0b2NrL3N0cmVhbWluZy1jc3ZcbiAgcHJpdmF0ZSBwYXJzZVJvdyhsaW5lOiBzdHJpbmcsIHZhbGlkYXRlRWxlbWVudENvdW50ID0gdHJ1ZSk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCByZXN1bHQ6IHN0cmluZ1tdID0gW107XG4gICAgbGV0IHJlYWRPZmZzZXQgPSAwO1xuICAgIGNvbnN0IHJlYWRMZW5ndGggPSBsaW5lLmxlbmd0aDtcbiAgICBsZXQgY3VycmVudFN0YXRlID0gU1RBVEVfT1VUO1xuICAgIC8vIEdvZXMgdGhyb3VnaCB0aGUgbGluZSB0byBwYXJzZSBxdW90ZS5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlYWRMZW5ndGg7IGkrKykge1xuICAgICAgc3dpdGNoIChjdXJyZW50U3RhdGUpIHtcbiAgICAgICAgLy8gQmVmb3JlIGVudGVyIGEgbmV3IGZpZWxkXG4gICAgICAgIGNhc2UgU1RBVEVfT1VUOlxuICAgICAgICAgIHN3aXRjaCAobGluZS5jaGFyQXQoaSkpIHtcbiAgICAgICAgICAgIC8vIEVudGVyIGEgcXVvdGVkIGZpZWxkXG4gICAgICAgICAgICBjYXNlIENPREVfUVVPVEU6XG4gICAgICAgICAgICAgIHJlYWRPZmZzZXQgPSBpICsgMTtcbiAgICAgICAgICAgICAgY3VycmVudFN0YXRlID0gU1RBVEVfUVVPVEU7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgLy8gUmVhZCBhbiBlbXB0eSBmaWVsZFxuICAgICAgICAgICAgY2FzZSB0aGlzLmRlbGltaXRlcjpcbiAgICAgICAgICAgICAgcmVhZE9mZnNldCA9IGkgKyAxO1xuICAgICAgICAgICAgICAvLyBJZiBkZWxpbWl0ZXIgaXMgd2hpdGUgc3BhY2UgYW5kIGNvbmZpZ3VyZWQgdG8gY29sbGFwc2VcbiAgICAgICAgICAgICAgLy8gbXVsdGlwbGUgd2hpdGUgc3BhY2VzLCBpZ25vcmUgdGhpcyB3aGl0ZSBzcGFjZS5cbiAgICAgICAgICAgICAgaWYgKHRoaXMuZGVsaW1pdGVyID09PSAnICcgJiYgdGhpcy5kZWxpbVdoaXRlc3BhY2UpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXN1bHQucHVzaCgnJyk7XG4gICAgICAgICAgICAgIGN1cnJlbnRTdGF0ZSA9IFNUQVRFX09VVDtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAvLyBFbnRlciBhbiB1bnF1b3RlZCBmaWVsZFxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgY3VycmVudFN0YXRlID0gU1RBVEVfRklFTEQ7XG4gICAgICAgICAgICAgIHJlYWRPZmZzZXQgPSBpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIC8vIEluIGFuIHVucXVvdGVkIGZpZWxkXG4gICAgICAgIGNhc2UgU1RBVEVfRklFTEQ6XG4gICAgICAgICAgc3dpdGNoIChsaW5lLmNoYXJBdChpKSkge1xuICAgICAgICAgICAgLy8gRXhpdCBhbiB1bnF1b3RlZCBmaWVsZCwgYWRkIGl0IHRvIHJlc3VsdFxuICAgICAgICAgICAgY2FzZSB0aGlzLmRlbGltaXRlcjpcbiAgICAgICAgICAgICAgcmVzdWx0LnB1c2gobGluZS5zdWJzdHJpbmcocmVhZE9mZnNldCwgaSkpO1xuICAgICAgICAgICAgICBjdXJyZW50U3RhdGUgPSBTVEFURV9PVVQ7XG4gICAgICAgICAgICAgIHJlYWRPZmZzZXQgPSBpICsgMTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gSW4gYSBxdW90ZWQgZmllbGRcbiAgICAgICAgY2FzZSBTVEFURV9RVU9URTpcbiAgICAgICAgICBzd2l0Y2ggKGxpbmUuY2hhckF0KGkpKSB7XG4gICAgICAgICAgICAvLyBSZWFkIGEgcXVvdGUgYWZ0ZXIgYSBxdW90ZVxuICAgICAgICAgICAgY2FzZSBDT0RFX1FVT1RFOlxuICAgICAgICAgICAgICBjdXJyZW50U3RhdGUgPSBTVEFURV9RVU9URV9BRlRFUl9RVU9URTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgLy8gVGhpcyBzdGF0ZSBtZWFucyBpdCdzIHJpZ2h0IGFmdGVyIGEgc2Vjb25kIHF1b3RlIGluIGEgZmllbGRcbiAgICAgICAgY2FzZSBTVEFURV9RVU9URV9BRlRFUl9RVU9URTpcbiAgICAgICAgICBzd2l0Y2ggKGxpbmUuY2hhckF0KGkpKSB7XG4gICAgICAgICAgICAvLyBGaW5pc2hlZCBhIHF1b3RlZCBmaWVsZFxuICAgICAgICAgICAgY2FzZSB0aGlzLmRlbGltaXRlcjpcbiAgICAgICAgICAgICAgcmVzdWx0LnB1c2gobGluZS5zdWJzdHJpbmcocmVhZE9mZnNldCwgaSAtIDEpKTtcbiAgICAgICAgICAgICAgY3VycmVudFN0YXRlID0gU1RBVEVfT1VUO1xuICAgICAgICAgICAgICByZWFkT2Zmc2V0ID0gaSArIDE7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgLy8gRmluaXNoZWQgYSBxdW90ZWQgcGFydCBpbiBhIHF1b3RlZCBmaWVsZFxuICAgICAgICAgICAgY2FzZSBDT0RFX1FVT1RFOlxuICAgICAgICAgICAgICBjdXJyZW50U3RhdGUgPSBTVEFURV9RVU9URTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAvLyBJbiBhIHF1b3RlZCBwYXJ0IGluIGEgcXVvdGVkIGZpZWxkXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICBjdXJyZW50U3RhdGUgPSBTVEFURV9XSVRISU5fUVVPVEVfSU5fUVVPVEU7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBTVEFURV9XSVRISU5fUVVPVEVfSU5fUVVPVEU6XG4gICAgICAgICAgc3dpdGNoIChsaW5lLmNoYXJBdChpKSkge1xuICAgICAgICAgICAgLy8gRXhpdCBhIHF1b3RlZCBwYXJ0IGluIGEgcXVvdGVkIGZpZWxkXG4gICAgICAgICAgICBjYXNlIENPREVfUVVPVEU6XG4gICAgICAgICAgICAgIGN1cnJlbnRTdGF0ZSA9IFNUQVRFX1FVT1RFO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgfVxuICAgIH1cbiAgICAvLyBBZGRzIGxhc3QgaXRlbSBiYXNlZCBvbiBpZiBpdCBpcyBxdW90ZWQuXG4gICAgaWYgKGN1cnJlbnRTdGF0ZSA9PT0gU1RBVEVfUVVPVEVfQUZURVJfUVVPVEUpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGxpbmUuc3Vic3RyaW5nKHJlYWRPZmZzZXQsIHJlYWRMZW5ndGggLSAxKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdC5wdXNoKGxpbmUuc3Vic3RyaW5nKHJlYWRPZmZzZXQpKTtcbiAgICB9XG4gICAgLy8gQ2hlY2sgaWYgZWFjaCByb3cgaGFzIHRoZSBzYW1lIG51bWJlciBvZiBlbGVtZW50cyBhcyBjb2x1bW4gbmFtZXMuXG4gICAgaWYgKHZhbGlkYXRlRWxlbWVudENvdW50ICYmIHJlc3VsdC5sZW5ndGggIT09IHRoaXMuZnVsbENvbHVtbk5hbWVzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHJvdyBpbiBjc3YgZmlsZS4gU2hvdWxkIGhhdmUgJHtcbiAgICAgICAgICB0aGlzLmZ1bGxDb2x1bW5OYW1lcy5sZW5ndGh9IGVsZW1lbnRzIGluIGEgcm93LCBidXQgZ290ICR7cmVzdWx0fWApO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8vIFRPRE8oc29lcmdlbCk6IGFkZCBtb3JlIGJhc2ljIGRhdGFzZXRzIGZvciBwYXJpdHkgd2l0aCB0Zi5kYXRhXG4vLyB0Zi5kYXRhLkZpeGVkTGVuZ3RoUmVjb3JkRGF0YXNldCgpXG4vLyB0Zi5kYXRhLlRGUmVjb3JkRGF0YXNldCgpXG4iXX0=
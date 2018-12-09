import * as moment from 'moment';
import * as _ from 'lodash';

export const TIME_FORMAT = {
  '24': 'HH:mm',
  'AMPM': 'hh:mm A',
  'ampm': 'hh:mm a',
};

/** Parse string, moment, Date.
 * 
 * Return unedfined on invalid input.
 */
export function parseValue(value, dateFormat) {
  if (!_.isNil(value) && !_.isNil(dateFormat)) {
    const date = moment(value, dateFormat);
    if (date.isValid()) {
      return date;
    }
  }
}

/** Parse string, moment, Date, string[], moment[], Date[].
 * 
 * Return array of moments. Returned value contains only valid moments.
 * Return undefined if none of the input values are valid.
 */
export function parseArrayOrValue(data, dateFormat) {
  if (_.isArray(data)) {
    const parsed = _.compact(data.map(item => parseValue(item, dateFormat)));
    if (parsed.length > 0) {
      return parsed;
    }
  }
  const parsedValue = parseValue(data, dateFormat);
  return parsedValue && [parsedValue];
}

/** Create moment.
 * 
 * Creates moment using `dateParams` or `initialDate` arguments (if provided).
 * Precedense order: dateParams -> initialDate -> default value
 */
export function getInitializer(context/*value, initialDate, dateFormat, dateParams*/) {
  const {
    dateParams,
    initialDate,
    dateFormat,
  } = context;
  if (dateParams) {
    const parsedParams = moment(dateParams);
    if (parsedParams.isValid()) {
      return parsedParams;
    }
  }
  const parsedInitialDate = parseValue(initialDate, dateFormat);
  if (parsedInitialDate) {
    return parsedInitialDate;
  }
  return moment();
}

/** Return initial date if `value` is empty and if `initialDate` provided. */
export function chooseValue(value, initialDate) {
  if (value === '' && initialDate) {
    return initialDate;
  }
  return value;
}

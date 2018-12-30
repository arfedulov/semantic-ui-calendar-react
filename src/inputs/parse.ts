import * as _ from 'lodash';
import * as moment from 'moment';

export const TIME_FORMAT = {
  24: 'HH:mm',
  AMPM: 'hh:mm A',
  ampm: 'hh:mm a',
};

type ParseValueData =
  | string
  | moment.Moment
  | Date;

/** Parse string, moment, Date.
 *
 * Return unedfined on invalid input.
 */
export function parseValue(value: ParseValueData, dateFormat: string): moment.Moment {
  if (!_.isNil(value) && !_.isNil(dateFormat)) {
    const date = moment(value, dateFormat);
    if (date.isValid()) {
      return date;
    }
  }
}

type ParseArrayOrValueData =
  | ParseValueData
  | ParseValueData[];

/** Parse string, moment, Date, string[], moment[], Date[].
 *
 * Return array of moments. Returned value contains only valid moments.
 * Return undefined if none of the input values are valid.
 */
export function parseArrayOrValue(data: ParseArrayOrValueData, dateFormat: string) {
  if (_.isArray(data)) {
    const parsed = _.compact((data as ParseValueData[]).map((item) => parseValue(item, dateFormat)));
    if (parsed.length > 0) {
      return parsed;
    }
  }
  const parsedValue = parseValue((data as ParseValueData), dateFormat);

  return parsedValue && [parsedValue];
}

interface DateParams {
  year?: number;
  month?: number;
  date?: number;
  hour?: number;
  minute?: number;
}

interface GetInitializerParams {
  initialDate?: ParseValueData;
  dateFormat?: string;
  dateParams?: DateParams;
}

/** Create moment.
 *
 * Creates moment using `dateParams` or `initialDate` arguments (if provided).
 * Precedense order: dateParams -> initialDate -> default value
 */
export function getInitializer(context: GetInitializerParams): moment.Moment {
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

type InitialDate = string | moment.Moment | Date;
type DateValue = InitialDate;

/** Return initial date if `value` is empty and if `initialDate` provided. */
export function chooseValue(value: string,
                            initialDate?: InitialDate): DateValue {
  if (value === '' && initialDate) {
    return initialDate;
  }

  return value;
}

export function dateValueToString(value: DateValue, dateFormat: string): string {
  if (_.isString(value)) {
    return value;
  }
  if (moment.isMoment(value)) {
    return (value as moment.Moment).format(dateFormat);
  }

  return moment(value, dateFormat).format(dateFormat);
}

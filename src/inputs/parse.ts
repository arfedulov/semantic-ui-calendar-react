import isNil from 'lodash/isNil';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import compact from 'lodash/compact';

import moment, { Moment } from 'moment';

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
export function parseValue(value: ParseValueData, dateFormat: string, localization: string): moment.Moment {
  if (!isNil(value) && !isNil(dateFormat)) {
    const date = moment(value, dateFormat);
    if (date.isValid()) {
      date.locale(localization);

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
export function parseArrayOrValue(data: ParseArrayOrValueData, dateFormat: string, localization: string) {
  if (isArray(data)) {
    const parsed = compact((data as ParseValueData[]).map((item) => parseValue(item, dateFormat, localization)));
    if (parsed.length > 0) {
      return parsed;
    }
  }
  const parsedValue = parseValue((data as ParseValueData), dateFormat, localization);

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
  localization?: string;
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
    localization,
  } = context;
  if (dateParams) {
    const parsedParams = localization ? moment(dateParams).locale(localization) : moment(dateParams);
    if (parsedParams.isValid()) {
      return parsedParams;
    }
  }
  const parsedInitialDate = parseValue(initialDate, dateFormat, localization);
  if (parsedInitialDate) {
    return parsedInitialDate;
  }

  return localization ? moment().locale(localization) : moment();
}

type InitialDate = string | moment.Moment | Date;
type DateValue = InitialDate;

/** Creates moment instance from provided value or initialDate.
 *  Creates today by default.
 */
export function buildValue(value: ParseValueData,
                           initialDate: InitialDate,
                           localization: string,
                           dateFormat: string,
                           defaultVal = moment()): Moment {
  const valueParsed = parseValue(value, dateFormat, localization);
  if (valueParsed) {
    return valueParsed;
  }
  const initialDateParsed = parseValue(initialDate, dateFormat, localization);
  if (initialDateParsed) {
    return initialDateParsed;
  }
  const _defaultVal = defaultVal ? defaultVal.clone() : defaultVal;
  if (_defaultVal) {
    _defaultVal.locale(localization);
  }

  return _defaultVal;
}

export function dateValueToString(value: DateValue, dateFormat: string, locale: string): string {
  if (isString(value)) {
    return value;
  }
  if (moment.isMoment(value)) {
    const _value = value.clone();
    _value.locale(locale);

    return _value.format(dateFormat);
  }

  const date = moment(value, dateFormat);
  if (date.isValid()) {
    date.locale(locale);

    return date.format(dateFormat);
  }

  return '';
}

function cleanDate(inputString: string, dateFormat: string): string {
  const formattedDateLength = moment().format(dateFormat).length;

  return inputString.trim().slice(0, formattedDateLength);
}

interface Range {
  start?: moment.Moment;
  end?: moment.Moment;
}

/**
 * Extract start and end dates from input string.
 * Return { start: Moment|undefined, end: Moment|undefined }
 * @param {string} inputString Row input string from user
 * @param {string} dateFormat Moment formatting string
 * @param {string} inputSeparator Separator for split inputString
 */
export function parseDatesRange(
  inputString: string = '',
  dateFormat: string = '',
  inputSeparator: string = ' - ',
): Range {
  const dates = inputString.split(inputSeparator)
    .map((date) => cleanDate(date, dateFormat));
  const result: Range = {};
  let start;
  let end;

  start = moment(dates[0], dateFormat);
  if (dates.length === 2) {
    end = moment(dates[1], dateFormat);
  }
  if (start && start.isValid()) {
    result.start = start;
  }
  if (end && end.isValid()) {
    result.end = end;
  }

  return result;
}

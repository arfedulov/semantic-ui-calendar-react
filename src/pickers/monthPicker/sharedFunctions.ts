import range from 'lodash/range';
import includes from 'lodash/includes';
import isNil from 'lodash/isNil';
import isArray from 'lodash/isArray';
import uniq from 'lodash/uniq';
import some from 'lodash/some';

import moment from 'moment';
import { MONTHS_IN_YEAR } from './const';

const buildCalendarValues = (localization?: string): string[] => {
  /*
    Return array of months (strings) like ['Aug', 'Sep', ...]
    that used to populate calendar's page.
  */
  const localLocale = localization ? moment.localeData(localization) : undefined;

  return localLocale ? localLocale.monthsShort() : moment.monthsShort();
};

const getInitialDatePosition = (
  selectable: number[],
  currentDate: moment.Moment,
): number => {
  if (selectable.indexOf(currentDate.month()) < 0) {
    return selectable[0];
  }

  return currentDate.month();
};

const getDisabledPositions = (
  enable: moment.Moment[],
  disable: moment.Moment[],
  maxDate: moment.Moment,
  minDate: moment.Moment,
  currentDate: moment.Moment,
): number[] => {
  /*
    Return position numbers of months that should be displayed as disabled
    (position in array returned by `this.buildCalendarValues`).
  */
  let disabled = [];
  if (isArray(enable)) {
    const enabledMonthPositions = enable
      .filter((monthMoment) => monthMoment.isSame(currentDate, 'year'))
      .map((monthMoment) => monthMoment.month());
    disabled = disabled.concat(range(0, MONTHS_IN_YEAR)
      .filter((monthPosition) => !includes(enabledMonthPositions, monthPosition)));
  }
  if (isArray(disable)) {
    disabled = disabled.concat(disable
      .filter((monthMoment) => monthMoment.year() === currentDate.year())
      .map((monthMoment) => monthMoment.month()));
  }
  if (!isNil(maxDate)) {
    if (maxDate.year() === currentDate.year()) {
      disabled = disabled.concat(
        range(maxDate.month() + 1, MONTHS_IN_YEAR));
    }
    if (maxDate.year() < currentDate.year()) {
      disabled = range(0, MONTHS_IN_YEAR);
    }
  }
  if (!isNil(minDate)) {
    if (minDate.year() === currentDate.year()) {
      disabled = disabled.concat(range(0, minDate.month()));
    }
    if (minDate.year() > currentDate.year()) {
      disabled = range(0, MONTHS_IN_YEAR);
    }
  }
  if (disabled.length > 0) {
    return uniq(disabled);
  }
};

const isNextPageAvailable = (
  maxDate: moment.Moment,
  enable: moment.Moment[],
  currentDate: moment.Moment,
): boolean => {
  if (isArray(enable)) {
    return some(enable, (enabledMonth) => enabledMonth.isAfter(currentDate, 'year'));
  }
  if (isNil(maxDate)) {
    return true;
  }

  return currentDate.year() < maxDate.year();
};

const isPrevPageAvailable = (
  minDate: moment.Moment,
  enable: moment.Moment[],
  currentDate: moment.Moment,
): boolean => {
  if (isArray(enable)) {
    return some(enable, (enabledMonth) => enabledMonth.isBefore(currentDate, 'year'));
  }
  if (isNil(minDate)) {
    return true;
  }

  return currentDate.year() > minDate.year();
};

export {
  buildCalendarValues,
  getInitialDatePosition,
  getDisabledPositions,
  isNextPageAvailable,
  isPrevPageAvailable,
};

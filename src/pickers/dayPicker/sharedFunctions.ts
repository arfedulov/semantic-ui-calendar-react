import indexOf from 'lodash/indexOf';
import lastIndexOf from 'lodash/lastIndexOf';
import range from 'lodash/range';
import includes from 'lodash/includes';
import isNil from 'lodash/isNil';
import isArray from 'lodash/isArray';
import concat from 'lodash/concat';
import uniq from 'lodash/uniq';
import first from 'lodash/first';
import sortBy from 'lodash/sortBy';
import slice from 'lodash/slice';
import find from 'lodash/find';

import { Moment } from 'moment';

/** Build days to fill page. */
export function buildDays(date: Moment, daysOnPage: number) {
  const start = date.clone().startOf('month').startOf('week');

  return getDaysArray(
    start.date(),
    getBrakepoints(date),
    daysOnPage).map((d) => d.toString());
}

/** Return dates from ends of months.
 *
 * On one datepicker's page not only days from current month are displayed
 * but also some days from adjacent months. This function returns days
 * that separate one month from other (last day in month).
 * Return array of one or two numbers.
 */
function getBrakepoints(referenceDate: Moment): number[] {
  const dateInCurrentMonth = referenceDate.clone();
  const currentMonth = dateInCurrentMonth.month();
  const brakepoints = [];

  const firstDateOnPage = dateInCurrentMonth.clone().startOf('month').startOf('week');
  if (firstDateOnPage.month() !== currentMonth) {
    brakepoints.push(firstDateOnPage.clone().endOf('month').date());
  }
  brakepoints.push(dateInCurrentMonth.clone().endOf('month').date());

  return brakepoints;
}

/* Return array of day positions that are not disabled by default. */
export function getDefaultEnabledDayPositions(allDays: string[], date: Moment): number[] {
  const dateClone = date.clone();
  const brakepoints = getBrakepoints(dateClone);
  if (brakepoints.length === 1) {
    return range(0, indexOf(allDays, brakepoints[0].toString()) + 1);
  } else {
    return range(indexOf(allDays, brakepoints[0].toString()) + 1,
                   lastIndexOf(allDays, brakepoints[1].toString()) + 1);
  }
}

/** Return day positions that shoud be displayed as disabled. */
export function getDisabledDays(
  disable: Moment[],
  maxDate: Moment,
  minDate: Moment,
  currentDate: Moment,
  daysOnPage: number,
  enable: Moment[]): number[] {
  const dayPositions = range(daysOnPage);
  const daysInCurrentMonthPositions = getDefaultEnabledDayPositions(buildDays(currentDate, daysOnPage), currentDate);
  let disabledDays = dayPositions.filter((dayPosition) => !includes(daysInCurrentMonthPositions, dayPosition));
  if (isArray(enable)) {
    const enabledDaysPositions = enable
      .filter((date) => date.isSame(currentDate, 'month'))
      .map((date) => date.date())
      .map((date) => daysInCurrentMonthPositions[date - 1]);
    disabledDays = concat(disabledDays,
                            dayPositions.filter((position) => {
                              return !includes(enabledDaysPositions, position);
                            }));
  }
  if (isArray(disable)) {
    disabledDays = concat(disabledDays,
                            disable
                              .filter((date) => date.isSame(currentDate, 'month'))
                              .map((date) => date.date())
                              .map((date) => daysInCurrentMonthPositions[date - 1]));
  }
  if (!isNil(maxDate)) {
    if (maxDate.isBefore(currentDate, 'month')) {
      disabledDays = dayPositions;
    }
    if (maxDate.isSame(currentDate, 'month')) {
      disabledDays = concat(disabledDays,
                              range(1, daysInCurrentMonthPositions.length + 1)
                                .filter((date) => date > maxDate.date())
                                .map((date) => daysInCurrentMonthPositions[date - 1]));
    }
  }
  if (!isNil(minDate)) {
    if (minDate.isAfter(currentDate, 'month')) {
      disabledDays = dayPositions;
    }
    if (minDate.isSame(currentDate, 'month')) {
      disabledDays = concat(disabledDays,
                              range(1, daysInCurrentMonthPositions.length + 1)
                                .filter((date) => date < minDate.date())
                                .map((date) => daysInCurrentMonthPositions[date - 1]));
    }
  }

  return sortBy(uniq(disabledDays).filter((day) => !isNil(day)));
}

/** Return day positions that should be displayed as marked. */
export function getMarkedDays(
  marked: Moment[],
  currentDate: Moment,
  daysOnPage: number): number[] {
    if (marked.length === 0) {
      return [];
    }
    const allDates = buildDays(currentDate, daysOnPage);
    const activeDayPositions = getDefaultEnabledDayPositions(allDates, currentDate);
    const allDatesNumb = allDates.map((date) => parseInt(date, 10));

    /*
     * The following will clear all dates before the 1st of the current month.
     * This is to prevent marking days before the 1st, that shouldn't be marked.
     * If the incorrect dates are marked, instead of the legitimate ones, the legitimate dates
     * will not be marked at all.
    */
    const fillTo = allDatesNumb.indexOf(1);
    for (let i = 0; i < fillTo; i++) {
      allDatesNumb[i] = 0;
    }

    const markedIndexes = marked
      .filter((date) => date.isSame(currentDate, 'month'))
      .map((date) => date.date())
      .map((date) => allDatesNumb.indexOf(date));

    return markedIndexes.filter((index) => includes(activeDayPositions, index));
}

export function isNextPageAvailable(date: Moment, maxDate: Moment): boolean {
  if (isNil(maxDate)) {
    return true;
  }
  if (date.isSameOrAfter(maxDate, 'month')) {
    return false;
  }

  return true;
}

export function isPrevPageAvailable(date: Moment, minDate: Moment): boolean {
  if (isNil(minDate)) {
    return true;
  }
  if (date.isSameOrBefore(minDate, 'month')) {
    return false;
  }

  return true;
}

// helper
function getDaysArray(start: number, brakepoints: number[], length: number): number[] {
  let currentDay = start;
  const days = [];
  let brakepointsLeft = brakepoints.slice();

  while (! (days.length === length)) {
    days.push(currentDay);
    const bp = first(brakepointsLeft);
    if (currentDay === bp) {
      currentDay = 1;
      brakepointsLeft = slice(brakepointsLeft, 1);
    } else {
      currentDay = currentDay + 1;
    }
  }

  return days;
}

export const testExport = {
  buildDays,
  getBrakepoints,
  getDisabledDays,
  isNextPageAvailable,
  isPrevPageAvailable,
  getDaysArray,
  getDefaultEnabledDayPositions,
};

export function getInitialDatePosition(initDate: string,
                                       values: string[],
                                       selectablePositions: number[]): number {
const selectable = selectablePositions.reduce((acc, pos) => {
acc.push({ value: values[pos], position: pos });

return acc;
}, []);
const res = find(selectable, (item) => item.value === initDate);
if (res) {
return res.position;
}

return selectable[0].position;
}

import * as _ from 'lodash';
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
    return _.range(0, _.indexOf(allDays, brakepoints[0].toString()) + 1);
  } else {
    return _.range(_.indexOf(allDays, brakepoints[0].toString()) + 1,
                   _.lastIndexOf(allDays, brakepoints[1].toString()) + 1);
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
  const dayPositions = _.range(daysOnPage);
  const daysInCurrentMonthPositions = getDefaultEnabledDayPositions(buildDays(currentDate, daysOnPage), currentDate);
  let disabledDays = dayPositions.filter((dayPosition) => !_.includes(daysInCurrentMonthPositions, dayPosition));
  if (_.isArray(enable)) {
    const enabledDaysPositions = enable
      .filter((date) => date.isSame(currentDate, 'month'))
      .map((date) => date.date())
      .map((date) => daysInCurrentMonthPositions[date - 1]);
    disabledDays = _.concat(disabledDays,
                            dayPositions.filter((position) => {
                              return !_.includes(enabledDaysPositions, position);
                            }));
  }
  if (_.isArray(disable)) {
    disabledDays = _.concat(disabledDays,
                            disable
                              .filter((date) => date.isSame(currentDate, 'month'))
                              .map((date) => date.date())
                              .map((date) => daysInCurrentMonthPositions[date - 1]));
  }
  if (!_.isNil(maxDate)) {
    if (maxDate.isBefore(currentDate, 'month')) {
      disabledDays = dayPositions;
    }
    if (maxDate.isSame(currentDate, 'month')) {
      disabledDays = _.concat(disabledDays,
                              _.range(1, daysInCurrentMonthPositions.length + 1)
                                .filter((date) => date > maxDate.date())
                                .map((date) => daysInCurrentMonthPositions[date - 1]));
    }
  }
  if (!_.isNil(minDate)) {
    if (minDate.isAfter(currentDate, 'month')) {
      disabledDays = dayPositions;
    }
    if (minDate.isSame(currentDate, 'month')) {
      disabledDays = _.concat(disabledDays,
                              _.range(1, daysInCurrentMonthPositions.length + 1)
                                .filter((date) => date < minDate.date())
                                .map((date) => daysInCurrentMonthPositions[date - 1]));
    }
  }

  return _.sortBy(_.uniq(disabledDays).filter((day) => !_.isNil(day)));
}

export function isNextPageAvailable(date: Moment, maxDate: Moment): boolean {
  if (_.isNil(maxDate)) {
    return true;
  }
  if (date.isSameOrAfter(maxDate, 'month')) {
    return false;
  }

  return true;
}

export function isPrevPageAvailable(date: Moment, minDate: Moment): boolean {
  if (_.isNil(minDate)) {
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
    const bp = _.first(brakepointsLeft);
    if (currentDay === bp) {
      currentDay = 1;
      brakepointsLeft = _.slice(brakepointsLeft, 1);
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

import _ from 'lodash';

/** Build days to fill page. */
export function buildDays(date/*moment*/, daysOnPage/*number*/) {
  const start = date.clone().startOf('month').startOf('week');
  return getDaysArray(
    start.date(),
    getBrakepoints(date),
    daysOnPage).map((date) => date.toString());
}

/** Return dates from ends of months.
 * 
 * On one datepicker's page not only days from current month are displayed
 * but also some days from adjacent months. This function returns days
 * that separate one month from other (last day in month).
 * Return array of one or two numbers.
 */
export function getBrakepoints(date/*moment*/) {
  const dateClone = date.clone();
  const currentMonth = dateClone.month();
  const brakepoints = [];

  dateClone.startOf('month').startOf('week');
  if (dateClone.month() !== currentMonth) {
    brakepoints.push(dateClone.endOf('month').date());
    dateClone.add(1, 'month');
  }
  brakepoints.push(dateClone.endOf('month').date());
  return brakepoints;
}

/* Return array of day positions that are not disabled by default. */
export function getDefaultEnabledDayPositions(allDays/*string[]*/, date/*moment*/) {
  const dateClone = date.clone();
  const brakepoints = getBrakepoints(dateClone);
  if (brakepoints.length === 1) {
    return _.range(0, _.indexOf(allDays, brakepoints[0].toString()) + 1);
  } else {
    return _.range(
      _.indexOf(allDays, brakepoints[0].toString()) + 1,
      _.lastIndexOf(allDays, brakepoints[1].toString()) + 1
    );
  }
}

/** Return day positions that shoud be displayed as disabled. */
export function getDisabledDays(disable, maxDate, minDate, date, daysOnPage) {
  const dayPositions = _.range(daysOnPage);
  const daysInCurrentMonthPositions = getDefaultEnabledDayPositions(buildDays(date, daysOnPage), date);
  let disabledDays = dayPositions.filter((dayPosition) => !_.includes(daysInCurrentMonthPositions, dayPosition));
  if (_.isArray(disable)) {
    disabledDays = _.concat(
      disabledDays,
      disable
        .filter(date => date.year() === date.year() && date.month() === date.month())
        .map(date => date.date())
        .map(date => daysInCurrentMonthPositions[date - 1])
    );
  }
  if (!_.isNil(maxDate)) {
    if (maxDate.isBefore(date, 'month')) {
      disabledDays = dayPositions;
    }
    if (maxDate.isSame(date, 'month')) {
      disabledDays = _.concat(
        disabledDays,
        _.range(1, daysInCurrentMonthPositions.length + 1).filter(date => date > maxDate.date())
          .map((date) => daysInCurrentMonthPositions[date - 1])
      );
    }
  }
  if (!_.isNil(minDate)) {
    if (minDate.isAfter(date, 'month')) {
      disabledDays = dayPositions;
    }
    if (minDate.isSame(date, 'month')) {
      disabledDays = _.concat(
        disabledDays,
        _.range(1, daysInCurrentMonthPositions.length + 1).filter(date => date < minDate.date())
          .map((date) => daysInCurrentMonthPositions[date - 1])
      );
    }
  }
  return _.sortBy(_.uniq(disabledDays).filter((day) => !_.isNil(day)));
}

export function isNextPageAvailable(date, maxDate) {
  if (_.isNil(maxDate)) return true;
  if (date.isSameOrAfter(maxDate, 'month')) return false;
  return true;
}

export function isPrevPageAvailable(date, minDate) {
  if (_.isNil(minDate)) return true;
  if (date.isSameOrBefore(minDate, 'month')) return false;
  return true;
}

// helper
export function getDaysArray(start/*number*/, brakepoints/*number[]*/, length) {
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

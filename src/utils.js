import moment from 'moment';

const _getCalendarStart = (referenceDate) => {
  return referenceDate.clone().startOf('month').startOf('week');
};

const getArrayOfWeeks = (referenceDate, weeks = 6 ) => {
  const weeksList = new Array(weeks);
  let day = _getCalendarStart(referenceDate).clone();
  for (let i = 0; i < weeksList.length; i++) {
    weeksList[i] = [];
    for (let j = 0; j < 7; j++) {
      weeksList[i][j] = day.clone();
      day.add(1, 'd');
    }
  }
  return weeksList;
};

/** Compare two `moment`'s by date. */
const compareDates = (oneDate, otherDate) => {
  return oneDate.year() === otherDate.year() && oneDate.month() === otherDate.month() && oneDate.date() === otherDate.date();
};

/** Check if date should be showed as active in calendar.
 * Check if date is the same as `active` or is date included in given date's interval.
 * @param {moment} checkedDate Date which compared with `active`
 * @param {moment||{start: moment, end: moment}} active Eather date or date's interval as [start, end]
*/
const isActiveDate = (checkedDate, active) => {
  if (active.hasOwnProperty('start') && active.hasOwnProperty('end')) {
    if (!active.start) {
      return;
    }
    if (!active.end) {
      return compareDates(checkedDate, active.start);
    }
    const normStart = moment({
      year: active.start.year(),
      month: active.start.month(),
      date: active.start.date()
    });
    const normEnd = moment({
      year: active.end.year(),
      month: active.end.month(),
      date: active.end.date()
    });
    const normCheckedDate = moment({
      year: checkedDate.year(),
      month: checkedDate.month(),
      date: checkedDate.date()
    });
    return normStart.isBefore(normCheckedDate)
      && normEnd.isAfter(normCheckedDate)
      || normStart.isSame(normCheckedDate)
      || normEnd.isSame(normCheckedDate);
  }
  return compareDates(checkedDate, active);
};

/** Check if given day is in the `date`'s month. */
const isDayInMonth = (day, date) => {
  const currentMonth = date.month();
  return day.month() === currentMonth;
};

/** Return array of week day names.
 * 
 * getWeekDays() --> ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Su']
 */
const getWeekDays = (long = false) => {
  const weekDays = [];
  let day = moment().startOf('week');
  for (let i = 0; i < 7; i++) {
    weekDays[i] = day.format(long? 'dddd' : 'dd');
    day.add(1, 'd');
  }
  return weekDays;
};

/**
 * Returns an object consisting of props beyond the scope of the Component.
 * Useful for getting and spreading unknown props from the user.
 * @param {function} Component A function or ReactClass.
 * @param {object} props A ReactElement props object
 * @returns {{}} A shallow copy of the prop object
 */
const getUnhandledProps = (Component, props) => {
  // Note that `handledProps` are generated automatically during build with `babel-plugin-transform-react-handled-props`
  const { handledProps = [] } = Component;

  return Object.keys(props).reduce((acc, propKey) => {
    if (propKey === 'childKey') return acc;
    if (handledProps.indexOf(propKey) === -1) acc[propKey] = props[propKey];
    return acc;
  }, {});
};

export {
  getArrayOfWeeks,
  isActiveDate,
  isDayInMonth,
  getWeekDays,
  getUnhandledProps
};
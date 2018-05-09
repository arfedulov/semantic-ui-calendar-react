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

export {
  getArrayOfWeeks,
  compareDates,
  isDayInMonth,
  getWeekDays
};
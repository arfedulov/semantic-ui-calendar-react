import moment from 'moment';

const _getCalendarStart = () => {
  return moment().startOf('month').startOf('week');
};

const getArrayOfWeeks = (start = _getCalendarStart(), weeks = 6 ) => {
  const weeksList = new Array(weeks);
  let day = start.clone();
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

/** Check if given day is in the current month. */
const isDayInCurrentMonth = (day) => {
  const currentMonth = moment().month();
  return day.month() === currentMonth;
};

export {
  getArrayOfWeeks,
  compareDates,
  isDayInCurrentMonth
};
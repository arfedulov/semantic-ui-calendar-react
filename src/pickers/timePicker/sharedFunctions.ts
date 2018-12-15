import { Moment } from 'moment';

import { TimeFormat } from '../BasePicker';

export function buildTimeStringWithSuffix(
  hour: string,
  minute: string,
  timeFormat: TimeFormat): string {
  if (timeFormat === 'ampm') {
    if (parseInt(hour, 10) < 12) {
      return `${convertHourTo_12_Format(hour)}:${minute} am`;
    }

    return `${convertHourTo_12_Format(hour)}:${minute} pm`;
  }
  if (timeFormat === 'AMPM') {
    if (parseInt(hour, 10) < 12) {
      return `${convertHourTo_12_Format(hour)}:${minute} AM`;
    }

    return `${convertHourTo_12_Format(hour)}:${minute} PM`;
  }

  return `${hour}:${minute}`;
}

function convertHourTo_12_Format(hour: string): string {
  if (hour === '00' || hour === '12') {
    return '12';
  }
  if (parseInt(hour, 10) < 12) {
    return hour;
  }
  const h = (parseInt(hour, 10) - 12).toString();
  if (h.length === 1) {
    return '0' + h;
  }

  return h;
}

export function isNextPageAvailable(date: Moment, maxDate: Moment): boolean {
  if (maxDate) {
    return maxDate.isAfter(date, 'day');
  }

  return true;
}

export function isPrevPageAvailable(date: Moment, minDate: Moment): boolean {
  if (minDate) {
    return minDate.isBefore(date, 'day');
  }

  return true;
}

export function getCurrentDate(date: Moment): string {
  return date.format('MMMM DD, YYYY');
}

import * as _ from 'lodash';
import * as moment from 'moment';
import { MONTHS_IN_YEAR } from './const';

const buildCalendarValues = (): string[] => {
  /*
    Return array of months (strings) like ['Aug', 'Sep', ...]
    that used to populate calendar's page.
  */
  return moment.monthsShort();
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
  if (_.isArray(enable)) {
    const enabledMonthPositions = enable
      .filter((monthMoment) => monthMoment.isSame(currentDate, 'year'))
      .map((monthMoment) => monthMoment.month());
    disabled = disabled.concat(_.range(0, MONTHS_IN_YEAR)
      .filter((monthPosition) => !_.includes(enabledMonthPositions, monthPosition)));
  }
  if (_.isArray(disable)) {
    disabled = disabled.concat(disable
      .filter((monthMoment) => monthMoment.year() === currentDate.year())
      .map((monthMoment) => monthMoment.month()));
  }
  if (!_.isNil(maxDate)) {
    if (maxDate.year() === currentDate.year()) {
      disabled = disabled.concat(
        _.range(maxDate.month() + 1, MONTHS_IN_YEAR));
    }
    if (maxDate.year() < currentDate.year()) {
      disabled = _.range(0, MONTHS_IN_YEAR);
    }
  }
  if (!_.isNil(minDate)) {
    if (minDate.year() === currentDate.year()) {
      disabled = disabled.concat(_.range(0, minDate.month()));
    }
    if (minDate.year() > currentDate.year()) {
      disabled = _.range(0, MONTHS_IN_YEAR);
    }
  }
  if (disabled.length > 0) {
    return _.uniq(disabled);
  }
};

const isNextPageAvailable = (
  maxDate: moment.Moment,
  enable: moment.Moment[],
  currentDate: moment.Moment,
): boolean => {
  if (_.isArray(enable)) {
    return _.some(enable, (enabledMonth) => enabledMonth.isAfter(currentDate, 'year'));
  }
  if (_.isNil(maxDate)) {
    return true;
  }

  return currentDate.year() < maxDate.year();
};

const isPrevPageAvailable = (
  minDate: moment.Moment,
  enable: moment.Moment[],
  currentDate: moment.Moment,
): boolean => {
  if (_.isArray(enable)) {
    return _.some(enable, (enabledMonth) => enabledMonth.isBefore(currentDate, 'year'));
  }
  if (_.isNil(minDate)) {
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

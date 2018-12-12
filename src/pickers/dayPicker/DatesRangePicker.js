import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as moment from 'moment';
import * as _ from 'lodash';

import DatesRangeView from '../../views/DatesRangeView';
import { DAYS_ON_PAGE } from './DayPicker';
import { getUnhandledProps } from '../../lib';
import {
  buildDays,
  getDefaultEnabledDayPositions,
  getDisabledDays,
  isNextPageAvailable,
  isPrevPageAvailable,
} from './sharedFunctions';
import { RangeSelectionPicker } from '../BasePicker';

const PAGE_WIDTH = 7;

/** Return position of a given date on the page.
 *
 * Page consists of some dates from previous month, dates from current month
 * and some dates from next month.
 * Return undefined if date that is under test is out of page.
 *
 * @param {Moment} prevMonth
 * @param {Moment} currentMonth
 * @param {Moment} nextMonth
 * @param {Moment} date Date to test
 * @param {number[]} fromPrevMonthDates
 * @param {number[]} fromCurrentMonthDates
 * @param {number[]} fromNextMonthDates
 */
function getDatePosition(
  prevMonth,
  currentMonth,
  nextMonth,
  date,
  fromPrevMonthDates,
  fromCurrentMonthDates,
  fromNextMonthDates) {
  if (date.isSame(prevMonth, 'month')) {
    const position = fromPrevMonthDates.indexOf(date.date());
    if (position >= 0) {
      return position;
    }
  }
  if (date.isSame(currentMonth, 'month')) {
    return fromCurrentMonthDates.indexOf(date.date()) + fromPrevMonthDates.length;
  }
  if (date.isSame(nextMonth, 'month')) {
    const position = fromNextMonthDates.indexOf(date.date());
    if (position >= 0) {
      return position + fromPrevMonthDates.length + fromCurrentMonthDates.length;
    }
  }
}

function getDatesFromPrevMonth(date, allDays, currentMonthStartPosition) {
  if (currentMonthStartPosition === 0) {
    return [];
  }
  return allDays.slice(0, currentMonthStartPosition).map(date => parseInt(date));
}

function getDatesFromNextMonth(date, allDays, nextMonthStartPosition) {
  if (nextMonthStartPosition === allDays.length) {
    return [];
  }
  return allDays.slice(nextMonthStartPosition, allDays.length).map(date => parseInt(date));
}

/** Build moment based on current page and date position on that page. */
function buildMoment(date/*Moment*/, firstOnPage/*number*/, dateToBuildPosition/*number*/) {
  let result;
  if (firstOnPage === 1/* page starts from first day in month */) {
    result = moment({ year: date.year(), month: date.month(), date: firstOnPage });
  } else {
    /* page starts from day in previous month */
    result = moment({ year: date.month() ? date.year() : date.year() - 1,
      month: (date.month() + 11) % 12,
      date: firstOnPage});
  }
  result.add(dateToBuildPosition, 'day');
  return result;
}

class DatesRangePicker extends RangeSelectionPicker {
  constructor(props) {
    super(props);
    this.state = {
      /* moment instance */
      date: props.initializeWith.clone(),
    };
    this.PAGE_WIDTH = PAGE_WIDTH;
  }

  buildCalendarValues() {
    /*
      Return array of dates (strings) like ['31', '1', ...]
      that used to populate calendar's page.
    */
    return buildDays(this.state.date, DAYS_ON_PAGE);
  }

  getSelectableCellPositions = () => {
    return _.filter(
      _.range(0, DAYS_ON_PAGE),
      d => !_.includes(this.getDisabledDaysPositions(), d),
    );
  }

  getInitialDatePosition = () => {
    return this.buildCalendarValues().indexOf(this.state.date.date().toString());
  }

  // TODO: too complicated method
  getActiveCellsPositions() {
    /*
      Return starting and ending positions of dates range that should be displayed as active
      { start: number, end: number }
      (position in array returned by `this.buildCalendarValues`).
    */
    const { date } = this.state;
    const {
      start,
      end,
    } = this.props;
    const allDays = this.buildCalendarValues();
    const fromCurrentMonthDayPositions = getDefaultEnabledDayPositions(allDays, date);

    const fromPrevMonthDates = getDatesFromPrevMonth(date, allDays, fromCurrentMonthDayPositions[0]);
    const fromNextMonthDates = getDatesFromNextMonth(date, allDays, _.last(fromCurrentMonthDayPositions) + 1);
    const fromCurrentMonthDates = _.range(1, this.state.date.daysInMonth() + 1);

    const prevMonth = date.clone();
    prevMonth.subtract(1, 'month');
    const nextMonth = date.clone();
    nextMonth.add(1, 'month');

    if (start && end) {
      const startPosition = getDatePosition(
        prevMonth,
        this.state.date,
        nextMonth,
        start,
        fromPrevMonthDates,
        fromCurrentMonthDates,
        fromNextMonthDates);

      const endPosition = getDatePosition(
        prevMonth,
        this.state.date,
        nextMonth,
        end,
        fromPrevMonthDates,
        fromCurrentMonthDates,
        fromNextMonthDates);
      if (startPosition && endPosition) {
        return { start: startPosition, end: endPosition };
      }
      if (startPosition) {
        return { start: startPosition, end: DAYS_ON_PAGE - 1};
      }
      if (endPosition) {
        return { start: 0, end: endPosition};
      }
      if (this.state.date.isBetween(start, end)) {
        return { start: 0, end: DAYS_ON_PAGE - 1};
      }
    }
    if (start) {
      const startPosition = getDatePosition(
        prevMonth,
        this.state.date,
        nextMonth,
        start,
        fromPrevMonthDates,
        fromCurrentMonthDates,
        fromNextMonthDates);
      return { start: startPosition, end: undefined };
    }
    return { start: undefined, end: undefined };
  }

  getDisabledDaysPositions() {
    /*
      Return position numbers of dates that should be displayed as disabled
      (position in array returned by `this.buildCalendarValues`).
    */
    const {
      maxDate,
      minDate,
    } = this.props;
    return getDisabledDays(undefined, maxDate, minDate, this.state.date, DAYS_ON_PAGE);
  }

  isNextPageAvailable() {
    return isNextPageAvailable(this.state.date, this.props.maxDate);
  }

  isPrevPageAvailable() {
    return isPrevPageAvailable(this.state.date, this.props.minDate);
  }

  getCurrentDate() {
    /* Return currently selected year and month(string) to display in calendar header. */
    return this.state.date.format('MMMM YYYY');
  }

  getSelectedRange() {
    /* Return currently selected dates range(string) to display in calendar header. */
    const {
      start,
      end,
      dateFormat,
    } = this.props;
    return `${start? start.format(dateFormat) : '- - -'} - ${end? end.format(dateFormat) : '- - -'}`;
  }

  handleChange = (e, { itemPosition }) => {
    // call `onChange` with value: { start: moment, end: moment }
    const {
      start,
      end,
    } = this.props;
    const firstOnPage = parseInt(this.buildCalendarValues()[0]);
    if (_.isNil(start) && _.isNil(end)) {
      const range = {
        start: buildMoment(this.state.date, firstOnPage, itemPosition),
      };
      _.invoke(this.props, 'onChange', e, { ...this.props, value: range });
    } else if (!_.isNil(start) && _.isNil(end)) {
      const selectedDate = buildMoment(this.state.date, firstOnPage, itemPosition);
      if (selectedDate.isAfter(start, 'date')) {
        const range = {
          start,
          end: selectedDate,
        };
        _.invoke(this.props, 'onChange', e, { ...this.props, value: range });
      } else {
        _.invoke(this.props, 'onChange', e, { ...this.props, value: {} });
      }
    } else {
      _.invoke(this.props, 'onChange', e, { ...this.props, value: {} });
    }
  }

  switchToNextPage = () => {
    this.setState(({ date }) => {
      const nextDate = date.clone();
      nextDate.add(1, 'month');
      return { date: nextDate };
    });
  }

  switchToPrevPage = () => {
    this.setState(({ date }) => {
      const prevDate = date.clone();
      prevDate.subtract(1, 'month');
      return { date: prevDate };
    });
  }

  render() {
    const rest = getUnhandledProps(DatesRangePicker, this.props);
    return (
      <DatesRangeView
        { ...rest }
        values={this.buildCalendarValues()}
        onNextPageBtnClick={this.switchToNextPage}
        onPrevPageBtnClick={this.switchToPrevPage}
        onCellHover={this.onHoveredCellPositionChange}
        hoveredItemIndex={this.state.hoveredCellPosition}
        onValueClick={this.handleChange}
        inline={this.props.inline}
        hasPrevPage={this.isPrevPageAvailable()}
        hasNextPage={this.isNextPageAvailable()}
        onBlur={this.handleBlur}
        onMount={this.props.onCalendarViewMount}
        currentHeadingValue={this.getCurrentDate()}
        currentRangeHeadingValue={this.getSelectedRange()}
        activeRange={this.getActiveCellsPositions()}
        disabledItemIndexes={this.getDisabledDaysPositions()} />
    );
  }
}

DatesRangePicker.propTypes = {
  /** Called after day is selected. */
  onChange: PropTypes.func.isRequired,
  /** A value for initializing day picker's state. */
  initializeWith: PropTypes.instanceOf(moment).isRequired,
  /** Moment date formatting string. */
  dateFormat: PropTypes.string.isRequired,
  /** Start of currently selected dates range. */
  start: PropTypes.instanceOf(moment),
  /** End of currently selected dates range. */
  end: PropTypes.instanceOf(moment),
  /** Minimal date that could be selected. */
  minDate: PropTypes.instanceOf(moment),
  /** Maximal date that could be selected. */
  maxDate: PropTypes.instanceOf(moment),
  isPickerInFocus: PropTypes.func,
  isTriggerInFocus: PropTypes.func,
  onCalendarViewMount: PropTypes.func,
  /** Force popup to close. */
  closePopup: PropTypes.func,
  inline: PropTypes.bool,
};

export default DatesRangePicker;

import filter from 'lodash/filter';
import range from 'lodash/range';
import includes from 'lodash/includes';
import last from 'lodash/last';
import isNil from 'lodash/isNil';
import moment from 'moment';
import { Moment } from 'moment';
import * as React from 'react';

import { RangeIndexes } from '../../views/BaseCalendarView';
import DatesRangeView from '../../views/DatesRangeView';
import {
  BasePickerOnChangeData,
  BasePickerProps,
  MinMaxValueProps,
  ProvideHeadingValue,
  RangeSelectionPicker,
  MarkedValuesProps,
} from '../BasePicker';
import { DAYS_ON_PAGE } from './DayPicker';
import {
  buildDays,
  getDefaultEnabledDayPositions,
  getDisabledDays,
  getInitialDatePosition,
  isNextPageAvailable,
  isPrevPageAvailable,
  getMarkedDays,
} from './sharedFunctions';

const PAGE_WIDTH = 7;

interface DatesRangePickerProps extends BasePickerProps, MinMaxValueProps, MarkedValuesProps {
  /** Moment date formatting string. */
  dateFormat: string;
  /** Start of currently selected dates range. */
  start: Moment;
  /** End of currently selected dates range. */
  end: Moment;
  /** Allow end date to be the same as start date. */
  allowSameEndDate: boolean;
}

export type DatesRangePickerOnChangeData = BasePickerOnChangeData;

class DatesRangePicker
  extends RangeSelectionPicker<DatesRangePickerProps>
  implements ProvideHeadingValue {
  constructor(props) {
    super(props);
    this.PAGE_WIDTH = PAGE_WIDTH;
  }

  public render() {
    const {
      onChange,
      value,
      initializeWith,
      closePopup,
      inline,
      isPickerInFocus,
      isTriggerInFocus,
      onCalendarViewMount,
      dateFormat,
      start,
      end,
      minDate,
      maxDate,
      marked,
      markColor,
      localization,
      allowSameEndDate,
      ...rest
    } = this.props;

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
        markedItemIndexes={this.getMarkedPositions()}
        markColor={markColor}
        disabledItemIndexes={this.getDisabledPositions()}
        localization={localization}
      />
    );
  }

  public getCurrentDate(): string {
    /* Return currently selected year and month(string) to display in calendar header. */
    return this.state.date.format('MMMM YYYY');
  }

  protected getMarkedPositions(): number[] {
    /*
      Return position numbers of dates that should be displayed as marked
      (position in array returned by `this.buildCalendarValues`).
    */
    const {
      marked,
    } = this.props;

    if (marked) {
      return getMarkedDays(marked, this.state.date, DAYS_ON_PAGE);
    } else {
      return [];
    }
  }

  protected buildCalendarValues(): string[] {
    /*
      Return array of dates (strings) like ['31', '1', ...]
      that used to populate calendar's page.
    */
    return buildDays(this.state.date, DAYS_ON_PAGE);
  }

  protected getSelectableCellPositions(): number[] {
    return filter(
      range(0, DAYS_ON_PAGE),
      (d) => !includes(this.getDisabledPositions(), d),
    );
  }

  protected getInitialDatePosition(): number {
    return getInitialDatePosition(this.state.date.date().toString(),
                                  this.buildCalendarValues(),
                                  this.getSelectableCellPositions());
  }

  // TODO: too complicated method
  protected getActiveCellsPositions(): RangeIndexes {
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
    const fromNextMonthDates = getDatesFromNextMonth(date, allDays, last(fromCurrentMonthDayPositions) + 1);
    const fromCurrentMonthDates = range(1, this.state.date.daysInMonth() + 1);

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

  protected getDisabledPositions(): number[] {
    /*
      Return position numbers of dates that should be displayed as disabled
      (position in array returned by `this.buildCalendarValues`).
    */
    const {
      maxDate,
      minDate,
    } = this.props;

    return getDisabledDays(undefined, maxDate, minDate, this.state.date, DAYS_ON_PAGE, undefined);
  }

  protected isNextPageAvailable(): boolean {
    return isNextPageAvailable(this.state.date, this.props.maxDate);
  }

  protected isPrevPageAvailable(): boolean {
    return isPrevPageAvailable(this.state.date, this.props.minDate);
  }

  protected getSelectedRange(): string {
    /* Return currently selected dates range(string) to display in calendar header. */
    const {
      start,
      end,
      dateFormat,
    } = this.props;

    return `${start ? start.format(dateFormat) : '- - -'} - ${end ? end.format(dateFormat) : '- - -'}`;
  }

  protected handleChange = (e: React.SyntheticEvent<HTMLElement>, { itemPosition }) => {
    // call `onChange` with value: { start: moment, end: moment }
    const {
      start,
      end,
      localization,
      allowSameEndDate,
    } = this.props;
    const data: DatesRangePickerOnChangeData = {
      ...this.props,
      value: {},
    };
    const firstOnPage = parseInt(this.buildCalendarValues()[0], 10);

    if (isNil(start) && isNil(end)) {
      data.value = { start: buildMoment(this.state.date, firstOnPage, itemPosition, localization) };
    } else if (!isNil(start) && isNil(end)) {
      const selectedDate = buildMoment(this.state.date, firstOnPage, itemPosition, localization);
      if (selectedDate.isAfter(start, 'date') || (allowSameEndDate && selectedDate.isSame(start, 'date'))) {
        data.value = {
          start,
          end: selectedDate,
        };
      }
    }
    this.props.onChange(e, data);
  }

  protected switchToNextPage = (e: React.SyntheticEvent<HTMLElement>,
                                data: any,
                                callback: () => void): void => {
    this.setState(({ date }) => {
      const nextDate = date.clone();
      nextDate.add(1, 'month');

      return { date: nextDate };
    }, callback);
  }

  protected switchToPrevPage = (e: React.SyntheticEvent<HTMLElement>,
                                data: any,
                                callback: () => void): void => {
    this.setState(({ date }) => {
      const prevDate = date.clone();
      prevDate.subtract(1, 'month');

      return { date: prevDate };
    }, callback);
  }
}

/** Return position of a given date on the page.
 *
 * Page consists of some dates from previous month, dates from current month
 * and some dates from next month.
 *
 * Return undefined if date that is under test is out of page.
 */
function getDatePosition(
  prevMonth: Moment,
  currentMonth: Moment,
  nextMonth: Moment,
  date: Moment,
  fromPrevMonthDates: number[],
  fromCurrentMonthDates: number[],
  fromNextMonthDates: number[]): number | undefined {
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

  return allDays.slice(0, currentMonthStartPosition).map((d) => parseInt(d, 10));
}

function getDatesFromNextMonth(date, allDays, nextMonthStartPosition) {
  if (nextMonthStartPosition === allDays.length) {
    return [];
  }

  return allDays.slice(nextMonthStartPosition, allDays.length).map((d) => parseInt(d, 10));
}

/** Build moment based on current page and date position on that page. */
function buildMoment(pageReferenceDate: Moment,
                     firstOnPage: number,
                     dateToBuildPosition: number,
                     localization: string): Moment {
  let result;
  if (firstOnPage === 1/* page starts from first day in month */) {
    const dateOptions = {
      year: pageReferenceDate.year(),
      month: pageReferenceDate.month(),
      date: firstOnPage,
    };
    result = localization ? moment(dateOptions).locale(localization) : moment(dateOptions);
  } else {
    /* page starts from day in previous month */
    const dateOptions = {
      year: pageReferenceDate.month() ? pageReferenceDate.year() : pageReferenceDate.year() - 1,
      month: (pageReferenceDate.month() + 11) % 12,
      date: firstOnPage,
    };
    result = localization ? moment(dateOptions).locale(localization) : moment(dateOptions);
  }
  result.add(dateToBuildPosition, 'day');

  return result;
}

export default DatesRangePicker;

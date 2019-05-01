import filter from 'lodash/filter';
import range from 'lodash/range';
import includes from 'lodash/includes';
import isNil from 'lodash/isNil';

import {Moment} from 'moment';
import moment from 'moment';
import * as React from 'react';

import {RangeIndexes} from '../../views/BaseCalendarView';
import MonthRangeView from '../../views/MonthRangeView';
import {
  BasePickerOnChangeData,
  BasePickerProps,
  MinMaxValueProps,
  ProvideHeadingValue,
  RangeSelectionPicker,
} from '../BasePicker';
import {
  MONTH_PAGE_WIDTH,
  MONTHS_IN_YEAR,
} from './const';
import {
  buildCalendarValues,
  getDisabledPositions,
  getInitialDatePosition,
  isNextPageAvailable,
  isPrevPageAvailable,
} from './sharedFunctions';

interface MonthRangePickerProps extends BasePickerProps, MinMaxValueProps {
  /** Moment date formatting string. */
  dateFormat: string;
  /** Start of currently selected dates range. */
  start: Moment;
  /** End of currently selected dates range. */
  end: Moment;
}

export type MonthRangePickerOnChangeData = BasePickerOnChangeData;

class MonthRangePicker
  extends RangeSelectionPicker<MonthRangePickerProps>
  implements ProvideHeadingValue {
  constructor(props) {
    super(props);
    this.PAGE_WIDTH = MONTH_PAGE_WIDTH;
  }

  public render() {
    const {
      onChange,
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
      localization,
      ...rest
    } = this.props;

    return (
      <MonthRangeView
        {...rest}
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
        disabledItemIndexes={this.getDisabledPositions()}
        localization={localization}/>
    );
  }

  public getCurrentDate(): string {
    /* Return currently selected year and month(string) to display in calendar header. */
    return this.state.date.format('YYYY');
  }

  protected buildCalendarValues(): string[] {
    const { localization } = this.props;

    return buildCalendarValues(localization);
  }

  protected getSelectableCellPositions(): number[] {
    return filter(
      range(0, MONTHS_IN_YEAR),
      (d) => !includes(this.getDisabledPositions(), d),
    );
  }

  protected getActiveCellsPositions(): RangeIndexes {
    /*
      Return starting and ending positions of month range that should be displayed as active
      { start: number, end: number }
    */
    const {
      start,
      end,
    } = this.props;
    const currentYear = this.state.date.year();
    const result = {
      start: undefined,
      end: undefined,
    };

    if (start && end) {
      if (currentYear < start.year() || currentYear > end.year()) {
        return result;
      }

      result.start = currentYear === start.year() ? start.month() : 0;
      result.end = currentYear === end.year() ? end.month() : MONTHS_IN_YEAR - 1;
    }
    if (start && !end) {
      result.start = currentYear === start.year() ? start.month() : undefined;
    }

    return result;
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

    return getDisabledPositions(undefined, undefined, maxDate, minDate, this.state.date);
  }

  protected isNextPageAvailable(): boolean {
    const {maxDate} = this.props;

    return isNextPageAvailable(maxDate, undefined, this.state.date);
  }

  protected isPrevPageAvailable(): boolean {
    const {minDate} = this.props;

    return isPrevPageAvailable(minDate, undefined, this.state.date);
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

  protected handleChange = (e: React.SyntheticEvent<HTMLElement>, {itemPosition}) => {
    // call `onChange` with value: { start: moment, end: moment }
    const {
      start,
      end,
      localization,
    } = this.props;
    const data: MonthRangePickerOnChangeData = {
      ...this.props,
      value: {},
    };

    if (isNil(start) && isNil(end)) {
      data.value =
      localization
      ? {start: moment({year: this.state.date.year(), month: itemPosition, date: 1}).locale(localization)}
      : {start: moment({year: this.state.date.year(), month: itemPosition, date: 1})};
    } else if (!isNil(start) && isNil(end)) {
      data.value =
      localization
      ? {
        start,
        end: moment({year: this.state.date.year(), month: itemPosition, date: 1}).locale(localization).endOf('month'),
      }
      : {
        start,
        end: moment({year: this.state.date.year(), month: itemPosition, date: 1}).endOf('month'),
      };
    }

    this.props.onChange(e, data);
  }

  protected switchToNextPage = (e: React.SyntheticEvent<HTMLElement>,
                                data: any,
                                callback: () => void): void => {
    this.setState(({date}) => {
      const nextDate = date.clone();
      nextDate.add(1, 'year');

      return {date: nextDate};
    }, callback);
  }

  protected switchToPrevPage = (e: React.SyntheticEvent<HTMLElement>,
                                data: any,
                                callback: () => void): void => {
    this.setState(({date}) => {
      const prevDate = date.clone();
      prevDate.subtract(1, 'year');

      return {date: prevDate};
    }, callback);
  }

  protected getInitialDatePosition = (): number => {
    const selectable = this.getSelectableCellPositions();

    return getInitialDatePosition(selectable, this.state.date);
  }
}

export default MonthRangePicker;

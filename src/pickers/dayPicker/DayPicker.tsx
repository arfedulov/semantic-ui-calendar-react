import filter from 'lodash/filter';
import range from 'lodash/range';
import includes from 'lodash/includes';
import isArray from 'lodash/isArray';
import some from 'lodash/some';

import * as React from 'react';

import DayView from '../../views/DayView';
import { WEEKS_TO_DISPLAY } from '../../views/DayView';
import {
  BasePickerOnChangeData,
  BasePickerProps,
  DisableValuesProps,
  EnableValuesProps,
  MinMaxValueProps,
  MarkedValuesProps,
  ProvideHeadingValue,
  SingleSelectionPicker,
} from '../BasePicker';
import {
  buildDays,
  getDisabledDays,
  getMarkedDays,
  getInitialDatePosition,
  isNextPageAvailable,
  isPrevPageAvailable,
} from './sharedFunctions';

const PAGE_WIDTH = 7;
export const DAYS_ON_PAGE = WEEKS_TO_DISPLAY * PAGE_WIDTH;

export interface DayPickerOnChangeData extends BasePickerOnChangeData {
  value: {
    year: number;
    month: number;
    date: number;
  };
}

type DayPickerProps = BasePickerProps
  & DisableValuesProps
  & EnableValuesProps
  & MinMaxValueProps
  & MarkedValuesProps;

class DayPicker
  extends SingleSelectionPicker<DayPickerProps>
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
      disable,
      enable,
      minDate,
      maxDate,
      marked,
      markColor,
      localization,
      ...rest
    } = this.props;

    return (
      <DayView
        { ...rest }
        values={this.buildCalendarValues()}
        hasNextPage={this.isNextPageAvailable()}
        hasPrevPage={this.isPrevPageAvailable()}
        onNextPageBtnClick={this.switchToNextPage}
        onPrevPageBtnClick={this.switchToPrevPage}
        onValueClick={this.handleChange}
        onBlur={this.handleBlur}
        inline={this.props.inline}
        onMount={this.props.onCalendarViewMount}
        hoveredItemIndex={this.state.hoveredCellPosition}
        onCellHover={this.onHoveredCellPositionChange}
        currentHeadingValue={this.getCurrentDate()}
        disabledItemIndexes={this.getDisabledPositions()}
        activeItemIndex={this.getActiveCellPosition()}
        markedItemIndexes={this.getMarkedPositions()}
        markColor={markColor}
        localization={localization} />
    );
  }

  public getCurrentDate(): string {
    /* Return currently selected year and month(string) to display in calendar header. */
    return this.state.date.format('MMMM YYYY');
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

  protected getActiveCellPosition(): number {
    /*
      Return position of a date that should be displayed as active
      (position in array returned by `this.buildCalendarValues`).
    */
    if (this.props.value && this.props.value.isSame(this.state.date, 'month')) {
      const disabledPositions = this.getDisabledPositions();
      const active = this.buildCalendarValues()
        .map((day, i) => includes(disabledPositions, i) ? undefined : day)
        .indexOf(this.props.value.date().toString());
      if (active >= 0) {
        return active;
      }
    }
  }

  protected getDisabledPositions(): number[] {
    /*
      Return position numbers of dates that should be displayed as disabled
      (position in array returned by `this.buildCalendarValues`).
    */
    const {
      disable,
      maxDate,
      minDate,
      enable,
    } = this.props;

    return getDisabledDays(disable, maxDate, minDate, this.state.date, DAYS_ON_PAGE, enable);
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

  protected isNextPageAvailable = (): boolean => {
    const {
      maxDate,
      enable,
    } = this.props;
    if (isArray(enable)) {
      return some(enable, (enabledDate) => enabledDate.isAfter(this.state.date, 'month'));
    }

    return isNextPageAvailable(this.state.date, maxDate);
  }

  protected isPrevPageAvailable = (): boolean => {
    const {
      minDate,
      enable,
    } = this.props;
    if (isArray(enable)) {
      return some(enable, (enabledDate) => enabledDate.isBefore(this.state.date, 'month'));
    }

    return isPrevPageAvailable(this.state.date, minDate);
  }

  protected handleChange = (e: React.SyntheticEvent<HTMLElement>, { value }): void => {
    // `value` is selected date(string) like '31' or '1'
    const data: DayPickerOnChangeData = {
      ...this.props,
      value: {
        year: this.state.date.year(),
        month: this.state.date.month(),
        date: parseInt(value, 10),
      },
    };

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

export default DayPicker;

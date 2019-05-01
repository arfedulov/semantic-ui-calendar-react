import filter from 'lodash/filter';
import range from 'lodash/range';
import includes from 'lodash/includes';
import isNil from 'lodash/isNil';

import * as React from 'react';

import MonthView from '../../views/MonthView';
import {
  BasePickerOnChangeData,
  BasePickerProps,
  DisableValuesProps,
  EnableValuesProps,
  MinMaxValueProps,
  OptionalHeaderProps,
  ProvideHeadingValue,
  SingleSelectionPicker,
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

type MonthPickerProps = BasePickerProps
  & DisableValuesProps
  & EnableValuesProps
  & MinMaxValueProps
  & OptionalHeaderProps;

export interface MonthPickerOnChangeData extends BasePickerOnChangeData {
  value: {
    year: number,
    month: number,
  };
}

class MonthPicker
  extends SingleSelectionPicker<MonthPickerProps>
  implements ProvideHeadingValue {
  /*
    Note:
      use it like this <MonthPicker key={someInputValue} />
      to make react create new instance when input value changes
  */
  constructor(props) {
    super(props);
    this.PAGE_WIDTH = MONTH_PAGE_WIDTH;
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
      localization,
      ...rest
    } = this.props;

    return (
      <MonthView
        { ...rest }
        values={this.buildCalendarValues()}
        onValueClick={this.handleChange}
        onCellHover={this.onHoveredCellPositionChange}
        onNextPageBtnClick={this.switchToNextPage}
        onPrevPageBtnClick={this.switchToPrevPage}
        hasPrevPage={this.isPrevPageAvailable()}
        hasNextPage={this.isNextPageAvailable()}
        onBlur={this.handleBlur}
        inline={this.props.inline}
        onMount={this.props.onCalendarViewMount}
        disabledItemIndexes={this.getDisabledPositions()}
        activeItemIndex={this.getActiveCellPosition()}
        hoveredItemIndex={this.state.hoveredCellPosition}
        currentHeadingValue={this.getCurrentDate()}
        localization={localization} />
    );
  }

  public getCurrentDate(): string {
    /* Return current year(string) to display in calendar header. */
    return this.state.date.year().toString();
  }

  protected buildCalendarValues(): string[] {
    const { localization } = this.props;

    return buildCalendarValues(localization);
  }

  protected getSelectableCellPositions(): number[] {
    return filter(
      range(0, MONTHS_IN_YEAR),
      (m) => !includes(this.getDisabledPositions(), m),
    );
  }

  protected getInitialDatePosition(): number {
    const selectable = this.getSelectableCellPositions();

    return getInitialDatePosition(selectable, this.state.date);
  }

  protected getActiveCellPosition(): number {
    /*
      Return position of a month that should be displayed as active
      (position in array returned by `this.buildCalendarValues`).
    */
    if (!isNil(this.props.value)) {
      if (this.props.value.year() === this.state.date.year()) {
        return this.props.value.month();
      }
    }
  }

  protected getDisabledPositions(): number[] {
    const {
      maxDate,
      minDate,
      enable,
      disable,
    } = this.props;

    return getDisabledPositions(enable, disable, maxDate, minDate, this.state.date);
  }

  protected isNextPageAvailable(): boolean {
    const {
      maxDate,
      enable,
    } = this.props;

    return isNextPageAvailable(maxDate, enable, this.state.date);
  }

  protected isPrevPageAvailable(): boolean {
    const {
      minDate,
      enable,
    } = this.props;

    return isPrevPageAvailable(minDate, enable, this.state.date);
  }

  protected handleChange = (e: React.SyntheticEvent<HTMLElement>, { value }): void => {
    const data: MonthPickerOnChangeData = {
      ...this.props,
      value: {
        year: parseInt(this.getCurrentDate(), 10),
        month: this.buildCalendarValues().indexOf(value),
      },
    };
    this.props.onChange(e, data);
  }

  protected switchToNextPage = (e: React.SyntheticEvent<HTMLElement>,
                                data: any,
                                callback: () => void): void => {
    this.setState(({ date }) => {
      const nextDate = date.clone();
      nextDate.add(1, 'year');

      return { date: nextDate };
    }, callback);
  }

  protected switchToPrevPage = (e: React.SyntheticEvent<HTMLElement>,
                                data: any,
                                callback: () => void): void => {
    this.setState(({ date }) => {
      const prevDate = date.clone();
      prevDate.subtract(1, 'year');

      return { date: prevDate };
    }, callback);
  }
}

export default MonthPicker;

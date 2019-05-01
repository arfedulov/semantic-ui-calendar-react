import range from 'lodash/range';
import includes from 'lodash/includes';
import isNil from 'lodash/isNil';
import isArray from 'lodash/isArray';
import concat from 'lodash/concat';
import uniq from 'lodash/uniq';
import filter from 'lodash/filter';
import last from 'lodash/last';
import first from 'lodash/first';
import some from 'lodash/some';

import * as React from 'react';

import YearView from '../views/YearView';
import {
  BasePickerOnChangeData,
  BasePickerProps,
  DisableValuesProps,
  EnableValuesProps,
  MinMaxValueProps,
  SingleSelectionPicker,
} from './BasePicker';

const PAGE_WIDTH = 3;
const PAGE_HEIGHT = 4;
const YEARS_ON_PAGE = PAGE_WIDTH * PAGE_HEIGHT;

type YearPickerProps = BasePickerProps
  & DisableValuesProps
  & EnableValuesProps
  & MinMaxValueProps;

export interface YearPickerOnChangeData extends BasePickerOnChangeData {
  value: {
    year: number,
  };
}

class YearPicker extends SingleSelectionPicker<YearPickerProps> {
  /*
    Note:
      use it like this <YearPicker key={someInputValue} />
      to make react create new instance when input value changes
  */
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
      localization,
      ...rest
    } = this.props;

    return (
      <YearView
        { ...rest }
        values={this.buildCalendarValues()}
        onNextPageBtnClick={this.switchToNextPage}
        onPrevPageBtnClick={this.switchToPrevPage}
        onValueClick={this.handleChange}
        onBlur={this.handleBlur}
        inline={this.props.inline}
        onMount={this.props.onCalendarViewMount}
        hoveredItemIndex={this.state.hoveredCellPosition}
        onCellHover={this.onHoveredCellPositionChange}
        hasPrevPage={this.isPrevPageAvailable()}
        hasNextPage={this.isNextPageAvailable()}
        disabledItemIndexes={this.getDisabledPositions()}
        activeItemIndex={this.getActiveCellPosition()}
        localization={localization} />
    );
  }

  protected buildCalendarValues(): string[] {
    /*
      Return array of years (strings) like ['2012', '2013', ...]
      that used to populate calendar's page.
    */
    const years = [];
    const date = this.state.date;
    const padd = date.year() % YEARS_ON_PAGE;
    const firstYear = date.year() - padd;
    for (let i = 0; i < YEARS_ON_PAGE; i++) {
      years[i] = (firstYear + i).toString();
    }

    return years;
  }

  protected getInitialDatePosition(): number {
    const selectable = this.getSelectableCellPositions();
    const values = this.buildCalendarValues();
    const currentYearIndex = values.indexOf(this.state.date.year().toString());
    if (selectable.indexOf(currentYearIndex) < 0) {
      return selectable[0];
    }

    return currentYearIndex;
  }

  protected getActiveCellPosition(): number {
    /*
      Return position of a year that should be displayed as active
      (position in array returned by `this.buildCalendarValues`).
    */
    if (!isNil(this.props.value)) {
      const years = this.buildCalendarValues();
      const yearIndex = years.indexOf(this.props.value.year().toString());
      if (yearIndex >= 0) {
        return yearIndex;
      }
    }
  }

  protected getSelectableCellPositions(): number[] {
    return filter(
      range(0, YEARS_ON_PAGE),
      (y) => !includes(this.getDisabledPositions(), y),
    );
  }

  protected getDisabledPositions(): number[] {
    /*
      Return position numbers of years that should be displayed as disabled
      (position in array returned by `this.buildCalendarValues`).
    */
    let disabled = [];
    const years = this.buildCalendarValues();
    if (isArray(this.props.enable)) {
      const enabledYears = this.props.enable.map((yearMoment) => yearMoment.year().toString());
      disabled = concat(disabled,
                          years
                            .filter((year) => !includes(enabledYears, year))
                            .map((year) => years.indexOf(year)));
    }
    if (isArray(this.props.disable)) {
      disabled = concat(disabled,
                          this.props.disable
                            .filter((yearMoment) => includes(years, yearMoment.year().toString()))
                            .map((yearMoment) => years.indexOf(yearMoment.year().toString())));
    }
    if (!isNil(this.props.maxDate)) {
      if (parseInt(first(years), 10) > this.props.maxDate.year()) {
        disabled = range(0, years.length);
      } else if (includes(years, this.props.maxDate.year().toString())) {
        disabled = concat(
          disabled,
          range(years.indexOf(this.props.maxDate.year().toString()) + 1, years.length));
      }
    }
    if (!isNil(this.props.minDate)) {
      if (parseInt(last(years), 10) < this.props.minDate.year()) {
        disabled = range(0, years.length);
      } else if (includes(years, this.props.minDate.year().toString())) {
        disabled = concat(
          disabled,
          range(0, years.indexOf(this.props.minDate.year().toString())));
      }
    }
    if (disabled.length > 0) {
      return uniq(disabled);
    }
  }

  protected isNextPageAvailable(): boolean {
    const {
      maxDate,
      enable,
    } = this.props;
    const lastOnPage = parseInt(last(this.buildCalendarValues()), 10);

    if (isArray(enable)) {
      return some(enable, (enabledYear) => enabledYear.year() > lastOnPage);
    }
    if (isNil(maxDate)) {
      return true;
    }

    return lastOnPage < maxDate.year();
  }

  protected isPrevPageAvailable(): boolean {
    const {
      minDate,
      enable,
    } = this.props;
    const firstOnPage = parseInt(first(this.buildCalendarValues()), 10);

    if (isArray(enable)) {
      return some(enable, (enabledYear) => enabledYear.year() < firstOnPage);
    }
    if (isNil(minDate)) {
      return true;
    }

    return firstOnPage > minDate.year();
  }

  protected handleChange = (e: React.SyntheticEvent<HTMLElement>, { value }): void => {
    const data: YearPickerOnChangeData = {
      ...this.props,
      value: { year: parseInt(value, 10) },
    };
    this.props.onChange(e, data);
  }

  protected switchToNextPage = (e: React.SyntheticEvent<HTMLElement>,
                                data: any,
                                callback: () => void): void => {
    this.setState(({ date }) => {
      const nextDate = date.clone();
      nextDate.add(YEARS_ON_PAGE, 'year');

      return { date: nextDate };
    }, callback);
  }

  protected switchToPrevPage = (e: React.SyntheticEvent<HTMLElement>,
                                data: any,
                                callback: () => void): void => {
    this.setState(({ date }) => {
      const prevDate = date.clone();
      prevDate.subtract(YEARS_ON_PAGE, 'year');

      return { date: prevDate };
    }, callback);
  }
}

export default YearPicker;

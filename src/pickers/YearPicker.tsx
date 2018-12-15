import * as _ from 'lodash';
import * as React from 'react';

import YearView from '../views/YearView';
import {
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
        activeItemIndex={this.getActiveCellPosition()} />
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
    const first = date.year() - padd;
    for (let i = 0; i < YEARS_ON_PAGE; i++) {
      years[i] = (first + i).toString();
    }

    return years;
  }

  protected getInitialDatePosition(): number {
    return this.buildCalendarValues().indexOf(this.state.date.year().toString());
  }

  protected getActiveCellPosition(): number {
    /*
      Return position of a year that should be displayed as active
      (position in array returned by `this.buildCalendarValues`).
    */
    if (!_.isNil(this.props.value)) {
      const years = this.buildCalendarValues();
      const yearIndex = years.indexOf(this.props.value.year().toString());
      if (yearIndex >= 0) {
        return yearIndex;
      }
    }
  }

  protected getSelectableCellPositions(): number[] {
    return _.filter(
      _.range(0, YEARS_ON_PAGE),
      (y) => !_.includes(this.getDisabledPositions(), y),
    );
  }

  protected getDisabledPositions(): number[] {
    /*
      Return position numbers of years that should be displayed as disabled
      (position in array returned by `this.buildCalendarValues`).
    */
    let disabled = [];
    const years = this.buildCalendarValues();
    if (_.isArray(this.props.enable)) {
      const enabledYears = this.props.enable.map((yearMoment) => yearMoment.year().toString());
      disabled = _.concat(disabled,
                          years
                            .filter((year) => !_.includes(enabledYears, year))
                            .map((year) => years.indexOf(year)));
    }
    if (_.isArray(this.props.disable)) {
      disabled = _.concat(disabled,
                          this.props.disable
                            .filter((yearMoment) => _.includes(years, yearMoment.year().toString()))
                            .map((yearMoment) => years.indexOf(yearMoment.year().toString())));
    }
    if (!_.isNil(this.props.maxDate)) {
      if (parseInt(_.first(years), 10) > this.props.maxDate.year()) {
        disabled = _.range(0, years.length);
      } else if (_.includes(years, this.props.maxDate.year().toString())) {
        disabled = _.concat(
          disabled,
          _.range(years.indexOf(this.props.maxDate.year().toString()) + 1, years.length));
      }
    }
    if (!_.isNil(this.props.minDate)) {
      if (parseInt(_.last(years), 10) < this.props.minDate.year()) {
        disabled = _.range(0, years.length);
      } else if (_.includes(years, this.props.minDate.year().toString())) {
        disabled = _.concat(
          disabled,
          _.range(0, years.indexOf(this.props.minDate.year().toString())));
      }
    }
    if (disabled.length > 0) {
      return _.uniq(disabled);
    }
  }

  protected isNextPageAvailable(): boolean {
    const {
      maxDate,
      enable,
    } = this.props;
    const lastOnPage = parseInt(_.last(this.buildCalendarValues()), 10);

    if (_.isArray(enable)) {
      return _.some(enable, (enabledYear) => enabledYear.year() > lastOnPage);
    }
    if (_.isNil(maxDate)) {
      return true;
    }

    return lastOnPage < maxDate.year();
  }

  protected isPrevPageAvailable(): boolean {
    const {
      minDate,
      enable,
    } = this.props;
    const firstOnPage = parseInt(_.first(this.buildCalendarValues()), 10);

    if (_.isArray(enable)) {
      return _.some(enable, (enabledYear) => enabledYear.year() < firstOnPage);
    }
    if (_.isNil(minDate)) {
      return true;
    }

    return firstOnPage > minDate.year();
  }

  protected handleChange = (e, { value }): void => {
    const year = parseInt(value, 10);
    _.invoke(this.props, 'onChange', e, { ...this.props, value: { year } });
  }

  protected switchToNextPage = (e, data, callback): void => {
    this.setState(({ date }) => {
      const nextDate = date.clone();
      nextDate.add(YEARS_ON_PAGE, 'year');

      return { date: nextDate };
    }, callback);
  }

  protected switchToPrevPage = (e, data, callback): void => {
    this.setState(({ date }) => {
      const prevDate = date.clone();
      prevDate.subtract(YEARS_ON_PAGE, 'year');

      return { date: prevDate };
    }, callback);
  }
}

export default YearPicker;

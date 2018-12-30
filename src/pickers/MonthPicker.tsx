import * as _ from 'lodash';
import * as moment from 'moment';
import * as React from 'react';

import MonthView from '../views/MonthView';
import {
  BasePickerOnChangeData,
  BasePickerProps,
  DisableValuesProps,
  EnableValuesProps,
  MinMaxValueProps,
  OptionalHeaderProps,
  ProvideHeadingValue,
  SingleSelectionPicker,
} from './BasePicker';

const MONTHS_IN_YEAR = 12;
const PAGE_WIDTH = 3;

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
        currentHeadingValue={this.getCurrentDate()} />
    );
  }

  public getCurrentDate(): string {
    /* Return current year(string) to display in calendar header. */
    return this.state.date.year().toString();
  }

  protected buildCalendarValues(): string[] {
    /*
      Return array of months (strings) like ['Aug', 'Sep', ...]
      that used to populate calendar's page.
    */
    return moment.monthsShort();
  }

  protected getSelectableCellPositions(): number[] {
    return _.filter(
      _.range(0, MONTHS_IN_YEAR),
      (m) => !_.includes(this.getDisabledPositions(), m),
    );
  }

  protected getInitialDatePosition(): number {
    const selectable = this.getSelectableCellPositions();
    if (selectable.indexOf(this.state.date.month()) < 0) {
      return selectable[0];
    }

    return this.state.date.month();
  }

  protected getActiveCellPosition(): number {
    /*
      Return position of a month that should be displayed as active
      (position in array returned by `this.buildCalendarValues`).
    */
    if (!_.isNil(this.props.value)) {
      if (this.props.value.year() === this.state.date.year()) {
        return this.props.value.month();
      }
    }
  }

  protected getDisabledPositions(): number[] {
    /*
      Return position numbers of months that should be displayed as disabled
      (position in array returned by `this.buildCalendarValues`).
    */
    let disabled = [];
    if (_.isArray(this.props.enable)) {
      const enabledMonthPositions = this.props.enable
        .filter((monthMoment) => monthMoment.isSame(this.state.date, 'year'))
        .map((monthMoment) => monthMoment.month());
      disabled = disabled.concat(_.range(0, MONTHS_IN_YEAR)
        .filter((monthPosition) => !_.includes(enabledMonthPositions, monthPosition)));
    }
    if (_.isArray(this.props.disable)) {
      disabled = disabled.concat(this.props.disable
        .filter((monthMoment) => monthMoment.year() === this.state.date.year())
        .map((monthMoment) => monthMoment.month()));
    }
    if (!_.isNil(this.props.maxDate)) {
      if (this.props.maxDate.year() === this.state.date.year()) {
        disabled = disabled.concat(
          _.range(this.props.maxDate.month() + 1, MONTHS_IN_YEAR));
      }
      if (this.props.maxDate.year() < this.state.date.year()) {
        disabled = _.range(0, MONTHS_IN_YEAR);
      }
    }
    if (!_.isNil(this.props.minDate)) {
      if (this.props.minDate.year() === this.state.date.year()) {
        disabled = disabled.concat(_.range(0, this.props.minDate.month()));
      }
      if (this.props.minDate.year() > this.state.date.year()) {
        disabled = _.range(0, MONTHS_IN_YEAR);
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
    if (_.isArray(enable)) {
      return _.some(enable, (enabledMonth) => enabledMonth.isAfter(this.state.date, 'year'));
    }
    if (_.isNil(maxDate)) {
      return true;
    }
    if (this.state.date.year() >= maxDate.year()) {
      return false;
    }

    return true;
  }

  protected isPrevPageAvailable(): boolean {
    const {
      minDate,
      enable,
    } = this.props;
    if (_.isArray(enable)) {
      return _.some(enable, (enabledMonth) => enabledMonth.isBefore(this.state.date, 'year'));
    }
    if (_.isNil(minDate)) {
      return true;
    }
    if (this.state.date.year() <= minDate.year()) {
      return false;
    }

    return true;
  }

  protected handleChange = (e: React.SyntheticEvent, { value }): void => {
    const data: MonthPickerOnChangeData = {
      ...this.props,
      value: {
        year: parseInt(this.getCurrentDate(), 10),
        month: this.buildCalendarValues().indexOf(value),
      },
    };
    this.props.onChange(e, data);
  }

  protected switchToNextPage = (): void => {
    this.setState(({ date }) => {
      const nextDate = date.clone();
      nextDate.add(1, 'year');

      return { date: nextDate };
    });
  }

  protected switchToPrevPage = (): void => {
    this.setState(({ date }) => {
      const prevDate = date.clone();
      prevDate.subtract(1, 'year');

      return { date: prevDate };
    });
  }
}

export default MonthPicker;

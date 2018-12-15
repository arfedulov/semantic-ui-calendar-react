import * as _ from 'lodash';
import * as React from 'react';

import MinuteView from '../../views/MinuteView';
import {
  BasePickerProps,
  DisableValuesProps,
  MinMaxValueProps,
  ProvideHeadingValue,
  SingleSelectionPicker,
  TimeFormat,
  TimePickerProps,
} from '../BasePicker';
import {
  buildTimeStringWithSuffix,
  getCurrentDate,
  isNextPageAvailable,
  isPrevPageAvailable,
} from './sharedFunctions';

const MINUTES_STEP = 5;
const MINUTES_ON_PAGE = 12;
const PAGE_WIDTH = 3;

type MinutePickerProps = BasePickerProps
  & MinMaxValueProps
  & DisableValuesProps
  & TimePickerProps;

class MinutePicker
  extends SingleSelectionPicker<MinutePickerProps>
  implements ProvideHeadingValue {
  public static readonly defaultProps: { timeFormat: TimeFormat } = {
    timeFormat: '24',
  };

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
      minDate,
      maxDate,
      disable,
      timeFormat,
      ...rest
    } = this.props;

    return (
      <MinuteView
        { ...rest }
        values={this.buildCalendarValues()}
        onNextPageBtnClick={this.switchToNextPage}
        onPrevPageBtnClick={this.switchToPrevPage}
        onValueClick={this.handleChange}
        hoveredItemIndex={this.state.hoveredCellPosition}
        onCellHover={this.onHoveredCellPositionChange}
        onBlur={this.handleBlur}
        inline={this.props.inline}
        onMount={this.props.onCalendarViewMount}
        hasNextPage={this.isNextPageAvailable()}
        hasPrevPage={this.isPrevPageAvailable()}
        disabledItemIndexes={this.getDisabledPositions()}
        currentHeadingValue={this.getCurrentDate()}
        activeItemIndex={this.getActiveCellPosition()} />
    );
  }

  public getCurrentDate(): string {
    /* Return currently selected month, date and year(string) to display in calendar header. */
    return getCurrentDate(this.state.date);
  }

  protected buildCalendarValues(): string[] {
    /*
      Return array of minutes (strings) like ['16:15', '16:20', ...]
      that used to populate calendar's page.
    */
    const hour = this.state.date.hour() < 10
      ? '0' + this.state.date.hour().toString()
      : this.state.date.hour().toString();

    return _.range(0, 60, MINUTES_STEP)
      .map((minute) => `${minute < 10 ? '0' : ''}${minute}`)
      .map((minute) => buildTimeStringWithSuffix(hour, minute, this.props.timeFormat));
  }

  protected getSelectableCellPositions(): number[] {
    return _.range(0, MINUTES_ON_PAGE);
  }

  protected getInitialDatePosition(): number {
    return 0;
  }

  protected getDisabledPositions(): number[] {
    const {
      disable,
      minDate,
      maxDate,
    } = this.props;
    let disabledByDisable = [];
    let disabledByMaxDate = [];
    let disabledByMinDate = [];

    if (_.isArray(disable)) {
      disabledByDisable = _.concat(
        disabledByDisable,
        disable.filter((date) => date.isSame(this.state.date, 'day'))
          .map((date) => getMinuteCellPosition(date.minute())));
    }
    if (minDate) {
      if (minDate.isSame(this.state.date, 'day')) {
        disabledByMinDate = _.concat(
          disabledByMinDate,
          _.range(0 , minDate.minute()).map((m) => getMinuteCellPosition(m)));
      }
    }
    if (maxDate) {
      if (maxDate.isSame(this.state.date, 'day')) {
        disabledByMaxDate = _.concat(
          disabledByMaxDate,
          _.range(maxDate.minute() + MINUTES_STEP, 60).map((m) => getMinuteCellPosition(m)));
      }
    }
    const result = _.sortBy(
      _.uniq(
        _.concat(disabledByDisable, disabledByMaxDate, disabledByMinDate)));
    if (result.length > 0) {
      return result;
    }
  }

  protected getActiveCellPosition(): number {
    /*
      Return position of a minute that should be displayed as active
      (position in array returned by `this.buildCalendarValues`).
    */
    const { value } = this.props;
    if (value && value.isSame(this.state.date, 'date')) {
      return Math.floor(this.props.value.minutes() / MINUTES_STEP);
    }
  }

  protected isNextPageAvailable(): boolean {
    return isNextPageAvailable(this.state.date, this.props.maxDate);
  }

  protected isPrevPageAvailable(): boolean {
    return isPrevPageAvailable(this.state.date, this.props.minDate);
  }

  protected handleChange = (e, { value }): void => {
    const data = {
      year: this.state.date.year(),
      month: this.state.date.month(),
      date: this.state.date.date(),
      hour: this.state.date.hour(),
      minute: this.buildCalendarValues().indexOf(value) * MINUTES_STEP,
    };
    _.invoke(this.props, 'onChange', e, { ...this.props, value: data });
  }

  protected switchToNextPage = (): void => {
    this.setState(({ date }) => {
      const nextDate = date.clone();
      nextDate.add(1, 'day');

      return { date: nextDate };
    });
  }

  protected switchToPrevPage = (): void => {
    this.setState(({ date }) => {
      const prevDate = date.clone();
      prevDate.subtract(1, 'day');

      return { date: prevDate };
    });
  }
}

function getMinuteCellPosition(minute: number): number {
  return Math.floor(minute / MINUTES_STEP);
}

export default MinutePicker;

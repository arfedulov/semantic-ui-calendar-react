import * as _ from 'lodash';
import * as React from 'react';

import HourView from '../../views/HourView';
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

const HOURS_ON_PAGE = 24;
const PAGE_WIDTH = 4;

type HourPickerProps = BasePickerProps
  & MinMaxValueProps
  & DisableValuesProps
  & TimePickerProps;

class HourPicker
  extends SingleSelectionPicker<HourPickerProps>
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
      <HourView
        { ...rest }
        values={this.buildCalendarValues()}
        onNextPageBtnClick={this.switchToNextPage}
        onPrevPageBtnClick={this.switchToPrevPage}
        hasPrevPage={this.isPrevPageAvailable()}
        hasNextPage={this.isNextPageAvailable()}
        onValueClick={this.handleChange}
        onBlur={this.handleBlur}
        inline={this.props.inline}
        onMount={this.props.onCalendarViewMount}
        hoveredItemIndex={this.state.hoveredCellPosition}
        onCellHover={this.onHoveredCellPositionChange}
        disabledItemIndexes={this.getDisabledPositions()}
        activeItemIndex={this.getActiveCellPosition()}
        currentHeadingValue={this.getCurrentDate()} />
    );
  }

  public getCurrentDate(): string {
    /* Return currently selected month, date and year(string) to display in calendar header. */
    return getCurrentDate(this.state.date);
  }

  protected buildCalendarValues(): string[] {
    /*
      Return array of hours (strings) like ['16:00', '17:00', ...]
      that used to populate calendar's page.
    */
    return _.range(0, 24).map((h) => {
      return `${h < 10 ? '0' : ''}${h}`;
    }).map((hour) => buildTimeStringWithSuffix(hour, '00', this.props.timeFormat));
  }

  protected getSelectableCellPositions(): number[] {
    return _.filter(
      _.range(0, HOURS_ON_PAGE),
      (h) => !_.includes(this.getDisabledPositions(), h),
    );
  }

  protected getInitialDatePosition(): number {
    return 0;
  }

  protected getActiveCellPosition(): number {
    /*
      Return position of an hour that should be displayed as active
      (position in array returned by `this.buildCalendarValues`).
    */
    const { value } = this.props;
    if (value && value.isSame(this.state.date, 'date')) {
      return this.props.value.hour();
    }
  }

  protected isNextPageAvailable(): boolean {
    return isNextPageAvailable(this.state.date, this.props.maxDate);
  }

  protected isPrevPageAvailable(): boolean {
    return isPrevPageAvailable(this.state.date, this.props.minDate);
  }

  protected getDisabledPositions(): number[] {
    /*
      Return position numbers of hours that should be displayed as disabled
      (position in array returned by `this.buildCalendarValues`).
    */
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
          .map((date) => date.hour()));
    }
    if (minDate) {
      if (minDate.isSame(this.state.date, 'day')) {
        disabledByMinDate = _.concat(
          disabledByMinDate,
          _.range(0 , minDate.hour()));
      }
    }
    if (maxDate) {
      if (maxDate.isSame(this.state.date, 'day')) {
        disabledByMaxDate = _.concat(
          disabledByMaxDate,
          _.range(maxDate.hour() + 1, 24));
      }
    }
    const result = _.sortBy(
      _.uniq(
        _.concat(disabledByDisable, disabledByMaxDate, disabledByMinDate)));
    if (result.length > 0) {
      return result;
    }
  }

  protected handleChange = (e, { value }): void => {
    const data = {
      year: this.state.date.year(),
      month: this.state.date.month(),
      date: this.state.date.date(),
      hour: this.buildCalendarValues().indexOf(value),
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

export default HourPicker;

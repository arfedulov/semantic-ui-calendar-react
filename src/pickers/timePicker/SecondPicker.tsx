import range from 'lodash/range';
import isArray from 'lodash/isArray';
import concat from 'lodash/concat';
import uniq from 'lodash/uniq';
import sortBy from 'lodash/sortBy';

import * as React from 'react';

import SecondView from '../../views/SecondView';
import {
  BasePickerOnChangeData,
  BasePickerProps,
  DisableValuesProps,
  MinMaxValueProps,
  OptionalHeaderProps,
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

const SECONDS_STEP = 5;
const SECONDS_ON_PAGE = 12;
const PAGE_WIDTH = 3;

type SecondPickerProps = BasePickerProps
  & MinMaxValueProps
  & DisableValuesProps
  & TimePickerProps
  & OptionalHeaderProps;

export interface SecondPickerOnChangeData extends BasePickerOnChangeData {
  value: {
    year: number,
    month: number,
    date: number,
    hour: number,
    minute: number,
    second: number,
  };
}

class SecondPicker
  extends SingleSelectionPicker<SecondPickerProps>
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
      localization,
      disableSecond,
      ...rest
    } = this.props;

    return (
      <SecondView
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
        activeItemIndex={this.getActiveCellPosition()}
        localization={localization}/>
    );
  }

  public getCurrentDate(): string {
    /* Return currently selected month, date and year(string) to display in calendar header. */
    return getCurrentDate(this.state.date);
  }

  protected buildCalendarValues(): string[] {
    /*
      Return array of seconds (strings) like ['15', '20', ...]
      that used to populate calendar's page.
    */
    const hour = this.state.date.hour() < 10
      ? '0' + this.state.date.hour().toString()
      : this.state.date.hour().toString();

    const minute = this.state.date.minute() < 10
      ? '0' + this.state.date.minute().toString()
      : this.state.date.minute().toString();

    return range(0, 60, SECONDS_STEP)
      .map((second) => `${second < 10 ? '0' : ''}${second}`)
      .map((second) => buildTimeStringWithSuffix(hour, minute, this.props.timeFormat, second));
  }

  protected getSelectableCellPositions(): number[] {
    const disabled = this.getDisabledPositions();
    const all = range(0, SECONDS_ON_PAGE);
    if (disabled) {
      return all.filter((pos) => {
        return disabled.indexOf(pos) < 0;
      });
    }

    return all;
  }

  protected getInitialDatePosition(): number {
    const selectable = this.getSelectableCellPositions();
    if (selectable.indexOf(getSecondCellPosition(this.state.date.second())) < 0) {
      return selectable[0];
    }

    return getSecondCellPosition(this.state.date.second());
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

    if (isArray(disable)) {
      disabledByDisable = concat(
        disabledByDisable,
        disable.filter((date) => date.isSame(this.state.date, 'day'))
          .map((date) => getSecondCellPosition(date.second())));
    }
    if (minDate) {
      if (minDate.isSame(this.state.date, 'minute')) {
        disabledByMinDate = concat(
          disabledByMinDate,
          range(0 , minDate.second()).map((s) => getSecondCellPosition(s)));
      }
    }
    if (maxDate) {
      if (maxDate.isSame(this.state.date, 'minute')) {
        disabledByMaxDate = concat(
          disabledByMaxDate,
          range(maxDate.second() + SECONDS_STEP, 60).map((s) => getSecondCellPosition(s)));
      }
    }
    const result = sortBy(
      uniq(
        concat(disabledByDisable, disabledByMaxDate, disabledByMinDate)));
    if (result.length > 0) {
      return result;
    }
  }

  protected getActiveCellPosition(): number {
    /*
      Return position of a second that should be displayed as active
      (position in array returned by `this.buildCalendarValues`).
    */
    const { value } = this.props;
    if (value && value.isSame(this.state.date, 'date')) {
      return Math.floor(this.props.value.seconds() / SECONDS_STEP);
    }
  }

  protected isNextPageAvailable(): boolean {
    return isNextPageAvailable(this.state.date, this.props.maxDate);
  }

  protected isPrevPageAvailable(): boolean {
    return isPrevPageAvailable(this.state.date, this.props.minDate);
  }

  protected handleChange = (e: React.SyntheticEvent<HTMLElement>, { value }): void => {
    const data: SecondPickerOnChangeData = {
      ...this.props,
      value: {
        year: this.state.date.year(),
        month: this.state.date.month(),
        date: this.state.date.date(),
        hour: this.state.date.hour(),
        minute: this.state.date.minute(),
        second: this.buildCalendarValues().indexOf(value) * SECONDS_STEP,
      },
    };
    this.props.onChange(e, data);
  }

  protected switchToNextPage = (e: React.SyntheticEvent<HTMLElement>,
                                data: any,
                                callback: () => void): void => {
    this.setState(({ date }) => {
      const nextDate = date.clone();
      nextDate.add(1, 'day');

      return { date: nextDate };
    }, callback);
  }

  protected switchToPrevPage = (e: React.SyntheticEvent<HTMLElement>,
                                data: any,
                                callback: () => void): void => {
    this.setState(({ date }) => {
      const prevDate = date.clone();
      prevDate.subtract(1, 'day');

      return { date: prevDate };
    }, callback);
  }
}

function getSecondCellPosition(second: number): number {
  return Math.floor(second / SECONDS_STEP);
}

export default SecondPicker;

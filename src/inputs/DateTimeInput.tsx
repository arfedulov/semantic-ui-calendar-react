import isNil from 'lodash/isNil';
import invoke from 'lodash/invoke';

import moment, { Moment } from 'moment';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import {
  BasePickerOnChangeData,
} from '../pickers/BasePicker';
import DayPicker from '../pickers/dayPicker/DayPicker';
import MonthPicker from '../pickers/monthPicker/MonthPicker';
import HourPicker from '../pickers/timePicker/HourPicker';
import MinutePicker from '../pickers/timePicker/MinutePicker';
import SecondPicker from '../pickers/timePicker/SecondPicker';
import YearPicker from '../pickers/YearPicker';
import InputView from '../views/InputView';
import BaseInput, {
  BaseInputProps,
  BaseInputPropTypes,
  BaseInputState,
  DateRelatedProps,
  DateRelatedPropTypes,
  DisableValuesProps,
  DisableValuesPropTypes,
  MinMaxValueProps,
  MinMaxValuePropTypes,
  MultimodeProps,
  MultimodePropTypes,
  TimeRelatedProps,
  TimeRelatedPropTypes,
  MarkedValuesProps,
  MarkedValuesPropTypes,
} from './BaseInput';

import { tick } from '../lib';
import {
  parseArrayOrValue,
  parseValue,
  TIME_FORMAT,
  TIME_FORMAT_WITH_SECONDS,
  buildValue,
  dateValueToString,
} from './parse';
import {
  getDisabledMonths,
  getDisabledYears,
} from './shared';

type CalendarMode =
  | 'year'
  | 'month'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second';

const nextMode: { [key: string]: CalendarMode } = {
  year: 'month',
  month: 'day',
  day: 'hour',
  hour: 'minute',
  minute: 'second',
  second: 'year'
};

function getNextMode(currentMode: CalendarMode): CalendarMode {
  return nextMode[currentMode];
}

const prevMode: { [key: string]: CalendarMode } = {
  second: 'minute',
  minute: 'hour',
  hour: 'day',
  day: 'month',
  month: 'year',
  year: 'second',
};

function getPrevMode(currentMode: CalendarMode): CalendarMode {
  return prevMode[currentMode];
}

export interface DateTimeInputProps extends
  BaseInputProps,
  DateRelatedProps,
  TimeRelatedProps,
  MultimodeProps,
  DisableValuesProps,
  MarkedValuesProps,
  MinMaxValueProps {
  startMode?: 'year' | 'month' | 'day';
  /** Date and time divider. */
  divider?: string;
  /** Preserve last mode (day, hour, minute) each time user opens dialog. */
  preserveViewMode?: boolean;
  /** Datetime formatting string. */
  dateTimeFormat?: string;
  /** If true, minutes picker won't be shown after picking the hour. Default: false */
  disableMinute?: boolean;
  /** If true, seconds picker won't be shown after picking the minute. Default: true */
  disableSecond?: boolean;
}

export type DateTimeInputOnChangeData = DateTimeInputProps;

interface DateTimeInputState extends BaseInputState {
  mode: CalendarMode;
  year: number;
  month: number;
  date: number;
  hour: number;
  minute: number;
  second: number;
}

class DateTimeInput extends BaseInput<DateTimeInputProps, DateTimeInputState> {
  /**
   * Component responsibility:
   *  - parse input value
   *  - handle underlying picker change
   */
  public static readonly defaultProps = {
    ...BaseInput.defaultProps,
    dateFormat: 'DD-MM-YYYY',
    timeFormat: '24',
    startMode: 'day',
    divider: ' ',
    icon: 'calendar',
    preserveViewMode: true,
    disableMinute: false,
    disableSecond: true,
  };

  public static readonly propTypes = {
    ...BaseInputPropTypes,
    ...DateRelatedPropTypes,
    ...TimeRelatedPropTypes,
    ...MultimodePropTypes,
    ...DisableValuesPropTypes,
    ...MarkedValuesPropTypes,
    ...MinMaxValuePropTypes,
    ...{
      startMode: PropTypes.oneOf([ 'year', 'month', 'day' ]),
      /** Date and time divider. */
      divider: PropTypes.string,
      /** Datetime formatting string. */
      dateTimeFormat: PropTypes.string,
    },
  };

  constructor(props: DateTimeInputProps) {
    super(props);
    const parsedValue = parseValue(props.value, this.getDateTimeFormat(), props.localization);
    this.state = {
      mode: props.startMode,
      year: parsedValue ? parsedValue.year() : undefined,
      month: parsedValue ? parsedValue.month() : undefined,
      date: parsedValue ? parsedValue.date() : undefined,
      hour: parsedValue ? parsedValue.hour() : undefined,
      minute: parsedValue ? parsedValue.minute() : undefined,
      second: parsedValue ? parsedValue.second() : undefined,
      popupIsClosed: true,
    };
  }

  public componentDidUpdate = (prevProps: DateTimeInputProps) => {
    // update internal date if ``value`` prop changed and successuffly parsed
    if (prevProps.value !== this.props.value) {
      const parsed = parseValue(this.props.value, this.getDateTimeFormat(), this.props.localization);
      if (parsed) {
        this.setState({
          year: parsed.year(),
          month: parsed.month(),
          date: parsed.date(),
          hour: parsed.hour(),
          minute: parsed.minute(),
          second: parsed.second(),
        });
      }
    }
  }

  public render() {
    const {
      value,
      dateTimeFormat,
      dateFormat,
      timeFormat,
      initialDate,
      disable,
      maxDate,
      minDate,
      preserveViewMode,
      startMode,
      divider,
      closable,
      markColor,
      marked,
      localization,
      onChange,
      disableMinute,
      disableSecond,
      ...rest
    } = this.props;

    return (
      <InputView
        popupIsClosed={this.state.popupIsClosed}
        closePopup={this.closePopup}
        openPopup={this.openPopup}
        onFocus={this.onFocus}
        onMount={this.onInputViewMount}
        onChange={this.onInputValueChange}
        {...rest}
        value={dateValueToString(value, dateFormat, localization)}
        renderPicker={() => this.getPicker()}
      />
    );
  }

  private parseInternalValue(): Moment {
    /*
      Creates moment instance from values stored in component's state
      (year, month, date, hour, minute, second) in order to pass this moment instance to
      underlying picker.
      Return undefined if none of these state fields has value.
    */
    const {
      year,
      month,
      date,
      hour,
      minute,
      second,
    } = this.state;
    if (!isNil(year)
      || !isNil(month)
      || !isNil(date)
      || !isNil(hour)
      || !isNil(minute)
      || !isNil(second)) {
      return moment({ year, month, date, hour, minute, second });
    }
  }

  private getDateTimeFormat(): string {
    const {
      dateFormat,
      divider,
      timeFormat,
      dateTimeFormat,
      disableSecond
    } = this.props;

    return dateTimeFormat
    || `${dateFormat}${divider}${disableSecond ? TIME_FORMAT[timeFormat] : TIME_FORMAT_WITH_SECONDS[timeFormat]}`;
  }

  private getPicker(): React.ReactNode {
    const {
      value,
      initialDate,
      dateFormat,
      disable,
      minDate,
      maxDate,
      inline,
      marked,
      markColor,
      localization,
      tabIndex,
      pickerStyle,
      pickerWidth,
      disableSecond,
    } = this.props;
    const dateTimeFormat = this.getDateTimeFormat();
    const pickerProps = {
      tabIndex,
      isPickerInFocus: this.isPickerInFocus,
      isTriggerInFocus: this.isTriggerInFocus,
      inline,
      pickerWidth,
      pickerStyle,
      onCalendarViewMount: this.onCalendarViewMount,
      closePopup: this.closePopup,
      onChange: this.handleSelect,
      onHeaderClick: this.switchToPrevMode,
      initializeWith: buildValue(this.parseInternalValue(), initialDate, localization, dateTimeFormat),
      value: buildValue(value, null, localization, dateTimeFormat, null),
      minDate: parseValue(minDate, dateTimeFormat, localization),
      maxDate: parseValue(maxDate, dateTimeFormat, localization),
      localization,
    };
    const disableParsed = parseArrayOrValue(disable, dateTimeFormat, localization);
    const { mode } = this.state;
    const markedParsed = parseArrayOrValue(marked, dateTimeFormat, localization);
    if (mode === 'year') {
      return (
        <YearPicker
          {...pickerProps}
          disable={getDisabledYears(disableParsed)}
        />
      );
    }
    if (mode === 'month') {
      return (
        <MonthPicker
          {...pickerProps}
          hasHeader
          disable={getDisabledMonths(disableParsed)}
        />
      );
    }
    if (mode === 'day') {
      return (
        <DayPicker
          {...pickerProps}
          marked={markedParsed}
          markColor={markColor}
          disable={disableParsed}
        />
      );
    }
    if (mode === 'hour') {
      return (
        <HourPicker
          timeFormat={this.props.timeFormat}
          hasHeader
          {...pickerProps}
          disable={disableParsed}
          disableSecond={disableSecond}
        />
      );
    }
    if (mode === 'minute') {
      return (
        <MinutePicker
        timeFormat={this.props.timeFormat}
        hasHeader
        {...pickerProps}
        disable={disableParsed}
        disableSecond={disableSecond}
        />
      );
    }

    return (
      <SecondPicker
      timeFormat={this.props.timeFormat}
      hasHeader
      {...pickerProps}
      disable={disableParsed}
      disableSecond={disableSecond}
      />
    );

  }

  private switchToNextModeUndelayed = (): void => {
    this.setState(({ mode }) => {
      return { mode: getNextMode(mode) };
    }, this.onModeSwitch);
  }

  private switchToNextMode = (): void => {
    tick(this.switchToNextModeUndelayed);
  }

  private switchToPrevModeUndelayed = (): void => {
    this.setState(({ mode }) => {
      return { mode: getPrevMode(mode) };
    }, this.onModeSwitch);
  }

  private switchToPrevMode = (): void => {
    tick(this.switchToPrevModeUndelayed);
  }

  private handleSelect = (e: React.SyntheticEvent<HTMLElement>,
                          { value }: BasePickerOnChangeData): void => {
    tick(this.handleSelectUndelayed, e, { value });
  }

  private onFocus = (): void => {
    if (!this.props.preserveViewMode) {
      this.setState({ mode: this.props.startMode });
    }
  }

  private handleSelectUndelayed = (e: React.SyntheticEvent<HTMLElement>,
                                   { value }: BasePickerOnChangeData): void => {
    const { closable, disableMinute, disableSecond } = this.props;

    const closeCondA = closable && this.state.mode === 'second';
    const closeCondB = closable && disableMinute && this.state.mode === 'hour';
    const closeCondC = closable && disableSecond && this.state.mode === 'minute';
    if (closeCondA || closeCondB || closeCondC) {
      this.closePopup();
    }

    let endAtMode = disableMinute ? 'hour' : 'minute';
    if (endAtMode === 'minute') {
      endAtMode = disableSecond ? 'minute' : 'second';
    }
    this.setState((prevState) => {
      const {
        mode,
      } = prevState;

      if (mode === endAtMode) {
        const outValue = moment(value).format(this.getDateTimeFormat());
        invoke(this.props, 'onChange', e, { ...this.props, value: outValue });
      }

      return {
        year: value.year,
        month: value.month,
        date: value.date,
        hour: value.hour,
        minute: value.minute,
        second: value.second,
      };
    }, () => this.state.mode !== endAtMode && this.switchToNextMode());
  }

  /** Keeps internal state in sync with input field value. */
  private onInputValueChange = (e, { value }) => {
    const parsedValue = moment(value, this.getDateTimeFormat());
    if (parsedValue.isValid()) {
      this.setState({
        year: parsedValue.year(),
        month: parsedValue.month(),
        date: parsedValue.date(),
        hour: parsedValue.hour(),
        minute: parsedValue.minute(),
        second: parsedValue.second(),
      });
    }
    invoke(this.props, 'onChange', e, { ...this.props, value });
  }
}

export default DateTimeInput;

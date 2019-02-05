import * as _ from 'lodash';
import * as moment from 'moment';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import CustomPropTypes from '../lib/CustomPropTypes';
import {
  BasePickerOnChangeData,
} from '../pickers/BasePicker';
import DayPicker from '../pickers/dayPicker/DayPicker';
import MonthPicker from '../pickers/MonthPicker';
import HourPicker from '../pickers/timePicker/HourPicker';
import MinutePicker from '../pickers/timePicker/MinutePicker';
import YearPicker from '../pickers/YearPicker';
import InputView from '../views/InputView';
import BaseInput, {
  BaseInputProps,
  BaseInputState,
  DateRelatedProps,
  DisableValuesProps,
  MinMaxValueProps,
  MultimodeProps,
  TimeRelatedProps,
} from './BaseInput';

import { tick } from '../lib';
import {
  chooseValue,
  getInitializer,
  parseArrayOrValue,
  parseValue,
  TIME_FORMAT,
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
  | 'minute';

const nextMode: { [key: string]: CalendarMode } = {
  year: 'month',
  month: 'day',
  day: 'hour',
  hour: 'minute',
  minute: 'year',
};

function getNextMode(currentMode: CalendarMode): CalendarMode {
  return nextMode[currentMode];
}

const prevMode: { [key: string]: CalendarMode } = {
  minute: 'hour',
  hour: 'day',
  day: 'month',
  month: 'year',
  year: 'minute',
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
  MinMaxValueProps {
  startMode?: 'year' | 'month' | 'day';
  /** Date and time divider. */
  divider?: string;
  /** Preserve last mode (day, hour, minute) each time user opens dialog. */
  preserveViewMode?: boolean;
  /** Datetime formatting string. */
  dateTimeFormat?: string;
}

export interface DateTimeInputOnChangeData extends DateTimeInputProps {
  value: string;
}

interface DateTimeInputState extends BaseInputState {
  mode: CalendarMode;
  year: number;
  month: number;
  date: number;
  hour: number;
  minute: number;
}

interface DateParams {
  year: number;
  month: number;
  date: number;
  hour: number;
  minute: number;
}

class DateTimeInput extends BaseInput<DateTimeInputProps, DateTimeInputState> {
  /**
   * Component responsibility:
   *  - parse input value
   *  - handle underlying picker change
   */
  public static readonly defaultProps = {
    dateFormat: 'DD-MM-YYYY',
    timeFormat: '24',
    startMode: 'day',
    divider: ' ',
    icon: 'calendar',
    preserveViewMode: true,
    inline: false,
  };

  public static readonly propTypes = {
    /** Currently selected value. */
    value: PropTypes.string,
    /** Moment datetime formatting string */
    dateTimeFormat: PropTypes.string,
    /** Moment date formatting string. */
    dateFormat: PropTypes.string,
    /** Time format ["AMPM", "ampm", "24"] */
    timeFormat: PropTypes.string,
    /** Date to display initially when no date is selected. */
    initialDate: PropTypes.oneOfType([
      PropTypes.string,
      CustomPropTypes.momentObj,
      PropTypes.instanceOf(Date),
    ]),
    /** Date or list of dates that are displayed as disabled. */
    disable: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
      CustomPropTypes.momentObj,
      PropTypes.arrayOf(CustomPropTypes.momentObj),
      PropTypes.instanceOf(Date),
      PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    ]),
    /** Maximum date that can be selected. */
    maxDate: PropTypes.oneOfType([
      PropTypes.string,
      CustomPropTypes.momentObj,
      PropTypes.instanceOf(Date),
    ]),
    /** Minimum date that can be selected. */
    minDate: PropTypes.oneOfType([
      PropTypes.string,
      CustomPropTypes.momentObj,
      PropTypes.instanceOf(Date),
    ]),
    /** Preserve viewmode on focus? */
    preserveViewMode: PropTypes.bool,
    /** Display mode to start. */
    startMode: PropTypes.oneOf([
      'year', 'month', 'day',
    ]),
    /** Date and time divider. */
    divider: PropTypes.string,
    /** If true, popup closes after selecting a date-time. */
    closable: PropTypes.bool,
    /**
     * Called on clear.
     *
     * @param {SyntheticEvent} event - React's original SyntheticEvent.
     * @param {object} data - All props and proposed value.
     */
    onClear: PropTypes.func,
    /** Using the clearable setting will let users remove their selection from a calendar. */
    clearable: PropTypes.bool,
    /** Optional Icon to display inside the clearable Input. */
    clearIcon: PropTypes.any,
    /** Duration of the CSS transition animation in milliseconds. */
    duration: PropTypes.number,
    /** Named animation event to used. Must be defined in CSS. */
    animation: PropTypes.string,
  };

  constructor(props: DateTimeInputProps) {
    super(props);
    const parsedValue = parseValue(props.value, props.dateFormat);
    this.state = {
      mode: props.startMode,
      year: parsedValue ? parsedValue.year() : undefined,
      month: parsedValue ? parsedValue.month() : undefined,
      date: parsedValue ? parsedValue.date() : undefined,
      hour: parsedValue ? parsedValue.hour() : undefined,
      minute: parsedValue ? parsedValue.minute() : undefined,
      popupIsClosed: true,
    };
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
      icon,
      ...rest
    } = this.props;

    return (
      <InputView
        popupIsClosed={this.state.popupIsClosed}
        icon={_.isBoolean(icon) && !icon ? undefined : icon}
        closePopup={this.closePopup}
        openPopup={this.openPopup}
        onFocus={this.onFocus}
        onMount={this.onInputViewMount}
        {...rest}
        value={value}
        render={(pickerProps) => this.getPicker(pickerProps)}
      />
    );
  }

  private getDateParams(): DateParams {
    /*
      Return date params that are used for picker initialization.
      Return undefined if none of [ 'year', 'month', 'date', 'hour', 'minute' ]
      state fields defined.
    */
    const {
      year,
      month,
      date,
      hour,
      minute,
    } = this.state;
    if (!_.isNil(year)
      || !_.isNil(month)
      || !_.isNil(date)
      || !_.isNil(hour)
      || !_.isNil(minute)) {
      return { year, month, date, hour, minute };
    }
  }

  private getDateTimeFormat(): string {
    const {
      dateFormat,
      divider,
      timeFormat,
      dateTimeFormat,
    } = this.props;

    return dateTimeFormat || `${dateFormat}${divider}${TIME_FORMAT[timeFormat]}`;
  }

  private getPicker({ tabIndex, pickerWidth, pickerStyle }): React.ReactNode {
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
      initializeWith: getInitializer({ initialDate, dateFormat: dateTimeFormat, dateParams: this.getDateParams() }),
      value: parseValue(chooseValue(value, initialDate), dateTimeFormat),
      minDate: parseValue(minDate, dateFormat),
      maxDate: parseValue(maxDate, dateFormat),
      marked: parseArrayOrValue(marked, dateFormat),
      markColor,
    };
    const disableParsed = parseArrayOrValue(disable, dateFormat);
    const { mode } = this.state;
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
        />
      );
    }

    return (
      <MinutePicker
        timeFormat={this.props.timeFormat}
        hasHeader
        {...pickerProps}
        disable={disableParsed}
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
    if (this.props.closable && this.state.mode === 'minute') {
      this.closePopup();
    }
    this.setState((prevState) => {
      const {
        mode,
      } = prevState;
      if (mode === 'minute') {
        const outValue = moment(value).format(this.getDateTimeFormat());
        _.invoke(this.props, 'onChange', e, { ...this.props, value: outValue });
      }

      return {
        year: value.year,
        month: value.month,
        date: value.date,
        hour: value.hour,
        minute: value.minute,
      };
    }, () => this.state.mode !== 'minute' && this.switchToNextMode());
  }
}

export default DateTimeInput;

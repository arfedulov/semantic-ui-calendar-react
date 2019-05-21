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
import YearPicker from '../pickers/YearPicker';
import BaseInput, {
  BaseInputProps,
  BaseInputPropTypes,
  BaseInputPropsNames,
  BaseInputState,
  DateRelatedProps,
  DateRelatedPropTypes,
  DateRelatedPropsNames,
  DisableValuesProps,
  DisableValuesPropTypes,
  DisableValuesPropsNames,
  MinMaxValueProps,
  MinMaxValuePropTypes,
  MinMaxValuePropsNames,
  MultimodeProps,
  MultimodePropTypes,
  MultimodePropsNames,
  TimeRelatedProps,
  TimeRelatedPropTypes,
  TimeRelatedPropsNames,
  MarkedValuesProps,
  MarkedValuesPropTypes,
  MarkedValuesPropsNames,
} from './BaseInput';

import { tick, getRestProps } from '../lib';
import {
  parseArrayOrValue,
  parseValue,
  TIME_FORMAT,
  buildValue,
  dateValueToString,
  pickInitialDate,
} from './parse';
import {
  getDisabledMonths,
  getDisabledYears,
  getYearView,
  getMonthView,
  getDayView,
  getHourView,
  getMinuteView,
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
  MarkedValuesProps,
  MinMaxValueProps {
  startMode?: 'year' | 'month' | 'day';
  /** Date and time divider. */
  divider?: string;
  /** Preserve last mode (day, hour, minute) each time user opens dialog. */
  preserveViewMode?: boolean;
  /** Datetime formatting string. */
  dateTimeFormat?: string;
}

export type DateTimeInputOnChangeData = DateTimeInputProps;

interface DateTimeInputState extends BaseInputState {
  mode: CalendarMode;
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
    ...BaseInput.defaultProps,
    dateFormat: 'DD-MM-YYYY',
    timeFormat: '24',
    startMode: 'day',
    divider: ' ',
    icon: 'calendar',
    preserveViewMode: true,
  };

  public static readonly propTypes = Object.assign({},
    BaseInputPropTypes,
    DateRelatedPropTypes,
    TimeRelatedPropTypes,
    MultimodePropTypes,
    DisableValuesPropTypes,
    MarkedValuesPropTypes,
    MinMaxValuePropTypes,
    {
      startMode: PropTypes.oneOf([ 'year', 'month', 'day' ]),
      /** Date and time divider. */
      divider: PropTypes.string,
      /** Datetime formatting string. */
      dateTimeFormat: PropTypes.string,
    },
  );

  private getYearView: (props: any) => React.ReactElement;
  private getMonthView: (props: any) => React.ReactElement;
  private getDayView: (props: any) => React.ReactElement;
  private getHourView: (props: any) => React.ReactElement;
  private getMinuteView: (props: any) => React.ReactElement;

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
      popupIsClosed: true,
    };

    this.getYearView = getYearView.bind(this);
    this.getMonthView = getMonthView.bind(this);
    this.getDayView = getDayView.bind(this);
    this.getHourView = getHourView.bind(this);
    this.getMinuteView = getMinuteView.bind(this);
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
        });
      }
    }
  }

  protected getInputViewValue = () => {
    const {
      value,
      dateFormat,
      localization,
    } = this.props;

    return dateValueToString(value, dateFormat, localization);
  }

  protected onFocus = (): void => {
    if (!this.props.preserveViewMode) {
      this.setState({ mode: this.props.startMode });
    }
  }

  /** Keeps internal state in sync with input field value. */
  protected onInputValueChange = (e, { value }) => {
    const parsedValue = moment(value, this.getDateTimeFormat());
    if (parsedValue.isValid()) {
      this.setState({
        year: parsedValue.year(),
        month: parsedValue.month(),
        date: parsedValue.date(),
        hour: parsedValue.hour(),
        minute: parsedValue.minute(),
      });
    }
    invoke(this.props, 'onChange', e, { ...this.props, value });
  }

  protected getUnusedProps = () => {
    // Return props which do not exist in DateTimeInputProps type
    return getRestProps(this.props, [
      ...BaseInputPropsNames,
      ...DateRelatedPropsNames,
      ...TimeRelatedPropsNames,
      ...MultimodePropsNames,
      ...DisableValuesPropsNames,
      ...MarkedValuesPropsNames,
      ...MinMaxValuePropsNames,
      'startMode',
      'divider',
      'preserveViewMode',
      'dateTimeFormat',
    ]);
  }

  protected parseInternalValue(): Moment {
    /*
      Creates moment instance from values stored in component's state
      (year, month, date, hour, minute) in order to pass this moment instance to
      underlying picker.
      Return undefined if none of these state fields has value.
    */
    const {
      year,
      month,
      date,
      hour,
      minute,
    } = this.state;
    if (!isNil(year)
      || !isNil(month)
      || !isNil(date)
      || !isNil(hour)
      || !isNil(minute)) {
      return moment({ year, month, date, hour, minute });
    }
  }

  protected getPicker = () => {
    const {
      value,
      disable,
      minDate,
      maxDate,
      inline,
      marked,
      localization,
      tabIndex,
      pickerStyle,
      pickerWidth,
    } = this.props;
    const dateTimeFormat = this.getDateTimeFormat();
    const pickerProps = {
      tabIndex,
      isPickerInFocus: this.isPickerInFocus,
      isTriggerInFocus: this.isTriggerInFocus,
      inline,
      pickerWidth,
      pickerStyle,
      closePopup: this.closePopup,
      onChange: this.handleSelect,
      onHeaderClick: this.switchToPrevMode,
      initializeWith: pickInitialDate({ ...this.props, value: this.parseInternalValue() }),
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
          renderView={this.getYearView}
        />
      );
    }
    if (mode === 'month') {
      return (
        <MonthPicker
          {...pickerProps}
          disable={getDisabledMonths(disableParsed)}
          renderView={this.getMonthView}
        />
      );
    }
    if (mode === 'day') {
      return (
        <DayPicker
          {...pickerProps}
          marked={markedParsed}
          disable={disableParsed}
          renderView={this.getDayView}
        />
      );
    }
    if (mode === 'hour') {
      return (
        <HourPicker
          {...pickerProps}
          timeFormat={this.props.timeFormat}
          disable={disableParsed}
          renderView={this.getHourView}
        />
      );
    }

    return (
      <MinutePicker
        {...pickerProps}
        timeFormat={this.props.timeFormat}
        disable={disableParsed}
        renderView={this.getMinuteView}
      />
    );
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
        invoke(this.props, 'onChange', e, { ...this.props, value: outValue });
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

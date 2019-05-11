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
import YearPicker from '../pickers/YearPicker';
import InputView from '../views/InputView';
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
  EnableValuesProps,
  EnableValuesPropTypes,
  EnableValuesPropsNames,
  MinMaxValueProps,
  MinMaxValuePropTypes,
  MinMaxValuePropsNames,
  MultimodeProps,
  MultimodePropTypes,
  MultimodePropsNames,
  MarkedValuesProps,
  MarkedValuesPropTypes,
  MarkedValuesPropsNames,
} from './BaseInput';

import {
  YearView,
  YearViewProps,
  MonthView,
  MonthViewProps,
  DayView,
  DayViewProps,
} from '../views';

import {
  tick,
  getRestProps,
} from '../lib';
import {
  buildValue,
  parseArrayOrValue,
  parseValue,
  dateValueToString,
  pickInitialDate,
} from './parse';
import {
  getDisabledMonths, getDisabledYears,
} from './shared';

type CalendarMode = 'year' | 'month' | 'day';

function getNextMode(currentMode: CalendarMode) {
  if (currentMode === 'year') {
    return 'month';
  }
  if (currentMode === 'month') {
    return 'day';
  }

  return 'year';
}

function getPrevMode(currentMode: CalendarMode) {
  if (currentMode === 'day') {
    return 'month';
  }
  if (currentMode === 'month') {
    return 'year';
  }

  return 'day';
}

export interface DateInputProps extends
  BaseInputProps,
  DateRelatedProps,
  MultimodeProps,
  DisableValuesProps,
  EnableValuesProps,
  MarkedValuesProps,
  MinMaxValueProps {
  /** Display mode to start. */
  startMode?: CalendarMode;
}

export type DateInputOnChangeData = DateInputProps;

interface DateInputState extends BaseInputState {
  mode: CalendarMode;
  year: number;
  month: number;
  date: number;
}

class DateInput extends BaseInput<DateInputProps, DateInputState> {
  /**
   * Component responsibility:
   *  - parse input value
   *  - handle underlying picker change
   */
  public static readonly defaultProps = {
    ...BaseInput.defaultProps,
    dateFormat: 'DD-MM-YYYY',
    startMode: 'day',
    preserveViewMode: true,
    icon: 'calendar',
  };

  public static readonly propTypes = Object.assign({},
    BaseInputPropTypes,
    DateRelatedPropTypes,
    MultimodePropTypes,
    DisableValuesPropTypes,
    EnableValuesPropTypes,
    MarkedValuesPropTypes,
    MinMaxValuePropTypes,
    {
      /** Display mode to start. */
      startMode: PropTypes.oneOf([ 'year', 'month', 'day' ]),
    },
  );

  constructor(props: DateInputProps) {
    super(props);
    const parsedValue = parseValue(props.value, props.dateFormat, props.localization);
    this.state = {
      mode: props.startMode,
      popupIsClosed: true,
      year: parsedValue ? parsedValue.year() : undefined,
      month: parsedValue ? parsedValue.month() : undefined,
      date: parsedValue ? parsedValue.date() : undefined,
    };
  }

  public componentDidUpdate = (prevProps: DateInputProps) => {
    // update internal date if ``value`` prop changed and successuffly parsed
    if (prevProps.value !== this.props.value) {
      const parsed = parseValue(this.props.value, this.props.dateFormat, this.props.localization);
      if (parsed) {
        this.setState({
          year: parsed.year(),
          month: parsed.month(),
          date: parsed.date(),
        });
      }
    }
  }

  public render() {
    const {
      value,
      dateFormat,
      localization,
    } = this.props;

    return (
      <InputView
        { ...this.getUnusedProps() }
        closePopup={this.closePopup}
        openPopup={this.openPopup}
        popupIsClosed={this.state.popupIsClosed}
        onMount={this.onInputViewMount}
        onFocus={this.onFocus}
        onChange={this.onInputValueChange}
        renderPicker={this.getPicker}
        value={dateValueToString(value, dateFormat, localization)}
      />
    );
  }

  protected parseInternalValue(): Moment {
    /*
      Creates moment instance from values stored in component's state
      (year, month, date) in order to pass this moment instance to
      underlying picker.
      Return undefined if none of these state fields has value.
    */
    const {
      year,
      month,
      date,
    } = this.state;
    if (!isNil(year) || !isNil(month) || !isNil(date)) {
      return moment({ year, month, date });
    }
  }

  protected getUnusedProps = (): object => {
    // Return props which do not exist in DateInputProps type
    return getRestProps(this.props, [
      ...BaseInputPropsNames,
      ...DateRelatedPropsNames,
      ...MultimodePropsNames,
      ...DisableValuesPropsNames,
      ...EnableValuesPropsNames,
      ...MarkedValuesPropsNames,
      ...MinMaxValuePropsNames,
      'startMode',
    ]);
  }

  private getPicker = () => {
    const {
      value,
      dateFormat,
      disable,
      minDate,
      maxDate,
      enable,
      inline,
      marked,
      markColor,
      localization,
      tabIndex,
      pickerWidth,
      pickerStyle,
    } = this.props;
    const pickerProps = {
      isPickerInFocus: this.isPickerInFocus,
      isTriggerInFocus: this.isTriggerInFocus,
      inline,
      closePopup: this.closePopup,
      tabIndex,
      pickerWidth,
      pickerStyle,
      onChange: this.handleSelect,
      onHeaderClick: this.switchToPrevMode,
      initializeWith: pickInitialDate({ ...this.props, value: this.parseInternalValue() }),
      value: buildValue(value, null, localization, dateFormat, null),
      enable: parseArrayOrValue(enable, dateFormat, localization),
      minDate: parseValue(minDate, dateFormat, localization),
      maxDate: parseValue(maxDate, dateFormat, localization),
      localization,
    };
    const disableParsed = parseArrayOrValue(disable, dateFormat, localization);
    const markedParsed = parseArrayOrValue(marked, dateFormat, localization);
    const { mode } = this.state;
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
          hasHeader
          disable={getDisabledMonths(disableParsed)}
          renderView={this.getMonthView}
        />
      );
    }

    return (
      <DayPicker
        {...pickerProps}
        disable={disableParsed}
        marked={markedParsed}
        markColor={markColor}
        renderView={this.getDayView}
      />
    );
  }

  private getYearView = (yearViewProps) => {
    const {
      inline,
    } = this.props;

    return (
      <YearView
        { ...this.getUnusedProps() }
        { ...yearViewProps }
        inline={ inline }
        onMount={ this.onCalendarViewMount }
        localization={this.props.localization} />
    );
  }

  private getMonthView = (monthViewProps) => {
    const {
      inline,
    } = this.props;

    return (
      <MonthView
        { ...this.getUnusedProps() }
        { ...monthViewProps }
        inline={inline}
        onMount={ this.onCalendarViewMount }
        localization={this.props.localization} />
    );
  }

  private getDayView = (dayViewProps) => {
    const {
      inline,
    } = this.props;

    return (
      <DayView
        { ...this.getUnusedProps() }
        { ...dayViewProps }
        inline={inline}
        onMount={ this.onCalendarViewMount }
        localization={this.props.localization}
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

  private onFocus = (): void => {
    if (!this.props.preserveViewMode) {
      this.setState({ mode: this.props.startMode });
    }
  }

  private handleSelect = (e, { value }: BasePickerOnChangeData) => {
    if (this.state.mode === 'day' && this.props.closable) {
      this.closePopup();
    }
    this.setState((prevState) => {
      const {
        mode,
      } = prevState;
      if (mode === 'day') {
        const outValue = moment(value).format(this.props.dateFormat);
        invoke(this.props, 'onChange', e, { ...this.props, value: outValue });
      }

      return {
        year: value.year,
        month: value.month,
        date: value.date,
      };
    }, () => this.state.mode !== 'day' && this.switchToNextMode());
  }

  /** Keeps internal state in sync with input field value. */
  private onInputValueChange = (e, { value }) => {
    const parsedValue = moment(value, this.props.dateFormat);
    if (parsedValue.isValid()) {
      this.setState({
        year: parsedValue.year(),
        month: parsedValue.month(),
        date: parsedValue.date(),
      });
    }
    invoke(this.props, 'onChange', e, { ...this.props, value });
  }
}

export default DateInput;

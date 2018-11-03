import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

import InputView from '../views/InputView';
import YearPicker from '../pickers/YearPicker';
import MonthPicker from '../pickers/MonthPicker';
import DayPicker from '../pickers/dayPicker/DayPicker';
import HourPicker from '../pickers/timePicker/HourPicker';
import MinutePicker from '../pickers/timePicker/MinutePicker';
import BaseInput from './BaseInput';
import {
  parseValue,
  parseArrayOrValue,
  getInitializer,
  TIME_FORMAT,
  chooseValue,
} from './parse';
import { getUnhandledProps, tick } from '../lib';

function getNextMode(currentMode) {
  if (currentMode === 'year') return 'month';
  if (currentMode === 'month') return 'day';
  if (currentMode === 'day') return 'hour';
  if (currentMode === 'hour') return 'minute';
  return 'year';
}

function getPrevMode(currentMode) {
  if (currentMode === 'minute') return 'hour';
  if (currentMode === 'hour') return 'day';
  if (currentMode === 'day') return 'month';
  if (currentMode === 'month') return 'year';
  return 'minute';
}

class DateTimeInput extends BaseInput {
  constructor(props) {
    super(props);
    /*
      state fields:
        - mode: one of [ 'year', 'month', 'day', 'hour', 'minute' ]
        - year: number
        - month: number
        - date: number
        - hour: number
        - minute: number
    */
    this.state = {
      mode: props.startMode,
    };
    const parsedValue = parseValue(props.value);
    if (parsedValue) {
      this.state.year = parsedValue.year();
      this.state.month = parsedValue.month();
      this.state.date = parsedValue.date();
      this.state.hour = parsedValue.hour();
      this.state.minute = parsedValue.minute();
    }
  }

  getDateParams() {
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
    if (!_.isNil(year) || !_.isNil(month) || !_.isNil(date) || !_.isNil(hour) || !_.isNil(minute)) {
      return { year, month, date, hour, minute };
    }
  }

  getDateTimeFormat() {
    const {
      dateFormat,
      divider,
      timeFormat,
      dateTimeFormat
    } = this.props;
    return dateTimeFormat || `${dateFormat}${divider}${TIME_FORMAT[timeFormat]}`;
  }

  getPicker() {
    const {
      value,
      initialDate,
      dateFormat,
      disable,
      minDate,
      maxDate,
    } = this.props;
    const dateTimeFormat = this.getDateTimeFormat();
    const pickerProps = {
      displayWeeks: true,
      hasHeader: true,
      onChange: this.handleSelect,
      onHeaderClick: this.switchToPrevMode,
      initializeWith: getInitializer({ initialDate, dateFormat: dateTimeFormat, dateParams: this.getDateParams() }),
      value: parseValue(chooseValue(value, initialDate), dateTimeFormat),
      disable: parseArrayOrValue(disable),
      minDate: parseValue(minDate, dateFormat),
      maxDate: parseValue(maxDate, dateFormat),
      // key: value, // seems like it works without reinstantiating picker every time value changes
    };
    const { mode } = this.state;
    if (mode === 'year') {
      return <YearPicker { ...pickerProps } />;
    }
    if (mode === 'month') {
      return <MonthPicker { ...pickerProps } />;
    }
    if (mode === 'day') {
      return <DayPicker { ...pickerProps } />;
    }
    if (mode === 'hour') {
      return <HourPicker timeFormat={ this.props.timeFormat } { ...pickerProps } />;
    }
    return <MinutePicker timeFormat={ this.props.timeFormat } { ...pickerProps } />;
  }

  _switchToNextModeUndelayed = () => {
    this.setState(({ mode }) => {
      return { mode: getNextMode(mode) };
    });
  }

  switchToNextMode = () => {
    tick(this._switchToNextModeUndelayed);
  }

  _switchToPrevModeUndelayed = () => {
    this.setState(({ mode }) => {
      return { mode: getPrevMode(mode) };
    });
  }

  switchToPrevMode = () => {
    tick(this._switchToPrevModeUndelayed);
  }

  handleSelect = (e, { value }) => {
    tick(this._handleSelectUndelayed, e, { value });
  }

  _onFocus = () => {
    if (!this.props.preserveViewMode) {
      this.setState({ mode: this.props.startMode });
    }
  }

  _handleSelectUndelayed = (e, { value }) => {
    if (this.props.closable && this.state.mode === 'minute') {
      this.closePopup();
    }
    this.setState(( prevState ) => {
      const {
        mode,
      } = prevState;
      let nextMode = mode;
      if (mode !== 'minute') {
        nextMode = getNextMode(mode);
      } else {
        const outValue = moment(value).format(this.getDateTimeFormat());
        _.invoke(this.props, 'onChange', e, { ...this.props, value: outValue });
      }
      return { mode: nextMode, ...value };
    });
  }

  render() {
    const {
      value,
    } = this.props;
    const rest = getUnhandledProps(DateTimeInput, this.props);
    return (
      <InputView
        popupIsClosed={this.state.popupIsClosed}
        onPopupUnmount={this.onPopupClose}
        icon="calendar"
        onFocus={this._onFocus}
        { ...rest }
        value={value}>
        { this.getPicker() }
      </InputView>
    );
  }
}

DateTimeInput.propTypes = {
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
    PropTypes.instanceOf(moment),
    PropTypes.instanceOf(Date),
  ]),
  /** Date or list of dates that are displayed as disabled. */
  disable: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.instanceOf(moment),
    PropTypes.arrayOf(PropTypes.instanceOf(moment)),
    PropTypes.instanceOf(Date),
    PropTypes.arrayOf(PropTypes.instanceOf(Date)),
  ]),
  /** Maximum date that can be selected. */
  maxDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(moment),
    PropTypes.instanceOf(Date),
  ]),
  /** Minimum date that can be selected. */
  minDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(moment),
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
};

DateTimeInput.defaultProps = {
  dateFormat: 'DD-MM-YYYY',
  timeFormat: '24',
  startMode: 'day',
  divider: ' ',
  preserveViewMode: true
};

export default DateTimeInput;

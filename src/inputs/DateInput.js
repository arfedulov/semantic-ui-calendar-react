import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

import InputView from '../views/InputView';
import YearPicker from '../pickers/YearPicker';
import MonthPicker from '../pickers/MonthPicker';
import DayPicker from '../pickers/dayPicker/DayPicker';
import BaseInput from './BaseInput';
import {
  parseArrayOrValue,
  getInitializer,
  parseValue,
  chooseValue,
} from './parse';
import {
  getUnhandledProps,
  tick,
} from '../lib';

function getNextMode(currentMode) {
  if (currentMode === 'year') return 'month';
  if (currentMode === 'month') return 'day';
  return 'year';
}

function getPrevMode(currentMode) {
  if (currentMode === 'day') return 'month';
  if (currentMode === 'month') return 'year';
  return 'day';
}

class DateInput extends BaseInput {
  constructor(props) {
    super(props);
    /*
      state fields:
        - mode: one of [ 'year', 'month', 'day' ]
        - year: number
        - month: number
        - date: number
    */
    this.state = {
      mode: props.startMode,
    };
    const parsedValue = parseValue(props.value);
    if (parsedValue) {
      this.state.year = parsedValue.year();
      this.state.month = parsedValue.month();
      this.state.date = parsedValue.date();
    }
  }

  getDateParams() { 
    /* 
      Return date params that are used for picker initialization.
      Return undefined if none of [ 'year', 'month', 'date' ]
      state fields defined.
    */
    const {
      year,
      month,
      date,
    } = this.state;
    if (!_.isNil(year) || !_.isNil(month) || !_.isNil(date)) {
      return { year, month, date };
    }
  }

  getPicker() {
    const {
      value,
      initialDate,
      dateFormat,
      disable,
      minDate,
      maxDate,
      enable,
    } = this.props;
    const pickerProps = {
      hasHeader: true,
      onChange: this.handleSelect,
      onHeaderClick: this.switchToPrevMode,
      initializeWith: getInitializer({ initialDate, dateFormat, dateParams: this.getDateParams() }),
      value: parseValue(chooseValue(value, initialDate), dateFormat),
      disable: parseArrayOrValue(disable, dateFormat),
      enable: parseArrayOrValue(enable, dateFormat),
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
    return <DayPicker { ...pickerProps } />;
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

  _onFocus = () => {
    if (!this.props.preserveViewMode) {
      this.setState({ mode: this.props.startMode });
    }
  }

  handleSelect = (e, { value }) => {
    if (this.state.mode === 'day' && this.props.closable) {
      this.closePopup();
    }
    this.setState(( prevState ) => {
      const {
        mode,
      } = prevState;
      let nextMode = mode;
      if (mode !== 'day') {
        nextMode = getNextMode(mode);
      } else {
        const outValue = moment(value).format(this.props.dateFormat);
        _.invoke(this.props, 'onChange', e, { ...this.props, value: outValue });
      }
      return { mode: nextMode, ...value };
    });
  }

  render() {
    const {
      value,
    } = this.props;
    const rest = getUnhandledProps(DateInput, this.props);
    return (
      <InputView
        popupIsClosed={this.state.popupIsClosed}
        onPopupUnmount={this.onPopupClose}
        icon="calendar"
        onFocus={this._onFocus}
        { ...rest }
        value={chooseValue(value, undefined)}>
        { this.getPicker() }
      </InputView>
    );
  }
}

DateInput.propTypes = {
  /** Currently selected value. */
  value: PropTypes.string,
  /** Moment date formatting string. */
  dateFormat: PropTypes.string,
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
  /** Date or list of dates that are enabled (the rest are disabled). */
  enable: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.arrayOf(PropTypes.instanceOf(moment)),
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
  /** If true, popup closes after selecting a date-time. */
  closable: PropTypes.bool,
};

DateInput.defaultProps = {
  dateFormat: 'DD-MM-YYYY',
  startMode: 'day',
  preserveViewMode: true
};

export default DateInput;

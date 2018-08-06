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
} from './parse';
import { getUnhandledProps } from '../lib';

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
    } = this.props;
    const pickerProps = {
      hasHeader: true,
      onChange: this.handleSelect,
      onHeaderClick: this.switchToPrevMode,
      initializeWith: getInitializer({ initialDate, dateFormat, dateParams: this.getDateParams() }),
      value: parseValue(value, dateFormat),
      disable: parseArrayOrValue(disable),
      minDate: parseArrayOrValue(minDate),
      maxDate: parseArrayOrValue(maxDate),
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

  switchToNextMode = () => {
    this.setState(({ mode }) => {
      return { mode: getNextMode(mode) };
    });
  }

  switchToPrevMode = () => {
    this.setState(({ mode }) => {
      return { mode: getPrevMode(mode) };
    });
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
        { ...rest }
        value={value}>
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
  /** Display mode to start. */
  startMode: PropTypes.oneOf([
    'year', 'month', 'day',
  ]),
  /** If true, popup closes after selecting a date-time. */
  closable: PropTypes.bool,
};

DateInput.defaultProps = {
  dateFormat: 'YYYY-MM-DD',
  startMode: 'day',
};

export default DateInput;

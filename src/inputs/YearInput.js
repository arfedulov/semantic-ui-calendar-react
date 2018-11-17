import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

import InputView from '../views/InputView';
import YearPicker from '../pickers/YearPicker';
import BaseInput from './BaseInput';
import {
  parseValue,
  parseArrayOrValue,
  getInitializer,
} from './parse';
import { getUnhandledProps } from '../lib';

class YearInput extends BaseInput {

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleSelect = (e, { value }) => {
    const date = moment({ year: value.year });
    let output = '';
    if (date.isValid()) {
      output = date.format(this.props.dateFormat);
    }
    _.invoke(
      this.props,
      'onChange',
      e, { ...this.props, value: output });
    if (this.props.closable) {
      this.closePopup();
    }
  }

  render() {
    const {
      value,
      disable,
      maxDate,
      minDate,
      initialDate,
      dateFormat,
    } = this.props;
    const rest = getUnhandledProps(YearInput, this.props);
    const initializeWith = getInitializer({
      dateParams: { year: parseInt(value) },
      initialDate,
      dateFormat,
    });
    return (
      <InputView
        popupIsClosed={this.state.popupIsClosed}
        icon="calendar"
        { ...rest }
        value={value}
        render={
          (pickerProps) => (
            <YearPicker
              {...pickerProps}
              isPickerInFocus={this.isPickerInFocus}
              onViewMount={this.onViewMount}
              closePopup={this.closePopup}
              onChange={this.handleSelect}
              initializeWith={initializeWith}
              value={parseValue(value, dateFormat)}
              disable={parseArrayOrValue(disable, dateFormat)}
              maxDate={parseValue(maxDate, dateFormat)}
              minDate={parseValue(minDate, dateFormat)}
            />
          )
        }
      />
    );
  }
}

YearInput.propTypes = {
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
  /** If true, popup closes after selecting a date-time. */
  closable: PropTypes.bool,
};

YearInput.defaultProps = {
  dateFormat: 'YYYY',
};

export default YearInput;

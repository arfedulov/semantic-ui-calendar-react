import React from 'react';
import { Table } from 'semantic-ui-react';
import { getUnhandledProps, emptyFunction } from '../utils.js';
import PropTypes from 'prop-types';
import moment from 'moment';
import { BasePicker } from './BasePicker.js';

class DateTimePicker extends BasePicker {
  constructor(props) {
    super(props);

    const {
      initialValue,
      dateFormat
    } = props;
    const initialDate = initialValue? moment(initialValue, dateFormat) : moment();
    this.state = {
      activeDate: initialValue? initialDate : null,
      dateToShow: initialDate,
      year: this.props.startMode !== 'year'? initialDate.year().toString() : '',
      month: '',
      activeHour: '',
      activeMinute: ''
    };
  }

  render() {
    const rest = getUnhandledProps(DateTimePicker, this.props);
    return (
      <Table
        { ...rest }
        unstackable
        celled
        textAlign="center">
        { this.getDateTimePickerContent() }
      </Table>
    );
  }
}

DateTimePicker.propTypes = {
  /** (event, data) => {} */
  onDateChange: PropTypes.func,
  /** (event, data) => {} */
  onTimeChange: PropTypes.func,
  startMode: PropTypes.oneOf(['year', 'month', 'day']),
  initialValue: PropTypes.string,
  dateFormat: PropTypes.string
};

DateTimePicker.defaultProps = {
  onDateChange: emptyFunction,
  onTimeChange: emptyFunction,
  startMode: 'day',
  dateFormat: 'DD-MM-YYYY'
};

export default DateTimePicker;
export {
  DateTimePicker
};
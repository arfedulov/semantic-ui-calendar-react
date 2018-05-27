import React from 'react';
import { Table } from 'semantic-ui-react';
import { getUnhandledProps, emptyFunction } from '../utils.js';
import moment from 'moment';
import PropTypes from 'prop-types';
import { BasePicker } from './BasePicker.js';

class DatePicker extends BasePicker {
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
      mode: this.props.startMode
    };
  }

  render() {
    const rest = getUnhandledProps(DatePicker, this.props);

    return (
      <Table
        { ...rest }
        unstackable
        celled
        textAlign="center">
        { this.getDatePickerContent() }
      </Table>
    );
  }
}

DatePicker.propTypes = {
  /** (event, data) => {} */
  onDateChange: PropTypes.func,
  startMode: PropTypes.oneOf(['year', 'month', 'day']),
  initialValue: PropTypes.string,
  dateFormat: PropTypes.string
};

DatePicker.defaultProps = {
  onDateChange: emptyFunction,
  startMode: 'day',
  dateFormat: 'DD-MM-YYYY'
};

export default DatePicker;
export {
  DatePicker
};
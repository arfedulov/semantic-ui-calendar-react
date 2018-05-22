import React from 'react';
import { Table } from 'semantic-ui-react';
import { getUnhandledProps, emptyFunction } from '../utils.js';
import { PickerHeader, DatePickerComponent } from '../components';
import moment from 'moment';
import PropTypes from 'prop-types';

class DatePicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeDate: null,
      activeMonth: moment()
    };
  }

  onNextBtnClick = () => {
    this.setState(({ activeMonth }) => {
      let nextMonth = activeMonth.clone();
      nextMonth.add(1, 'M');
      return { activeMonth: nextMonth };
    });
  }

  onPrevBtnClick = () => {
    this.setState(({ activeMonth }) => {
      let prevMonth = activeMonth.clone();
      prevMonth.add(-1, 'M');
      return { activeMonth: prevMonth };
    });
  }

  getActiveDate = () => {
    return this.state.activeDate || moment();
  }

  onDateClick = (event, data) => {
    const { onDateChange } = this.props;

    this.setState({
      activeDate: data.value
    });
    onDateChange(event, data);
  }

  render() {
    const rest = getUnhandledProps(DatePicker, this.props);

    return (
      <Table
        { ...rest }
        unstackable
        celled
        textAlign="center">
        <PickerHeader
          onNextBtnClick={this.onNextBtnClick}
          onPrevBtnClick={this.onPrevBtnClick}
          activeDate={this.state.activeMonth}
          showWeeks
          width="7" />
        <DatePickerComponent
          onDateClick={this.onDateClick}
          activeDate={this.getActiveDate()}
          showedMonth={this.state.activeMonth} />
      </Table>
    );
  }
}

DatePicker.propTypes = {
  /** (event, data) => {} */
  onDateChange: PropTypes.func
};

DatePicker.defaultProps = {
  onDateChange: emptyFunction
};

export default DatePicker;
export {
  DatePicker
};
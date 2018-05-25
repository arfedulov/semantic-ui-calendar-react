import React from 'react';
import { Table } from 'semantic-ui-react';
import { getUnhandledProps, emptyFunction, monthIndex } from '../utils.js';
import { PickerHeader, DatePickerComponent, MonthPickerComponent } from '../components';
import { YearPicker } from '.';
import moment from 'moment';
import PropTypes from 'prop-types';

class DatePicker extends React.Component {
  constructor(props) {
    super(props);

    const initialDate = moment();
    this.state = {
      activeDate: null,
      dateToShow: initialDate,
      year: this.props.startMode !== 'year'? initialDate.year().toString() : '',
      month: ''
    };
  }

  showNextMonth = () => {
    this.setState(({ dateToShow }) => {
      let nextMonth = dateToShow.clone();
      nextMonth.add(1, 'M');
      return { dateToShow: nextMonth };
    });
  }

  showPrevMonth = () => {
    this.setState(({ dateToShow }) => {
      let prevMonth = dateToShow.clone();
      prevMonth.add(-1, 'M');
      return { dateToShow: prevMonth };
    });
  }

  showNextYear = () => {
    this.setState(({ dateToShow }) => {
      let nextYear = dateToShow.clone();
      nextYear.add(1, 'Y');
      return { dateToShow: nextYear };
    });
  }

  showPrevYear = () => {
    this.setState(({ dateToShow }) => {
      let prevYear = dateToShow.clone();
      prevYear.add(-1, 'Y');
      return { dateToShow: prevYear };
    });
  }

  onDateClick = (event, data) => {
    const { onDateChange } = this.props;

    this.setState({
      activeDate: data.value
    });
    onDateChange(event, data);
  }

  onYearChange = (event, data) => {
    const date = {
      year: data.value
    };
    this.setState({
      dateToShow: moment(date),
      year: data.value
    });
  }

  onMonthChange = (event, data) => {
    const date = {
      year: this.state.year,
      month: monthIndex(data.value)
    };
    this.setState({
      dateToShow: moment(date),
      month: data.value
    });
  }

  yearModeContent = () => {
    return (
      <YearPicker onYearChange={this.onYearChange} />
    );
  }

  monthModeContent = () => {
    return (
      <React.Fragment>
        <PickerHeader
          onNextBtnClick={this.showNextYear}
          onPrevBtnClick={this.showPrevYear}
          activeYear={this.state.dateToShow.format('YYYY')}
          width="3" />
        <MonthPickerComponent
          activeMonth={this.state.dateToShow.format('MMM')}
          onMonthClick={this.onMonthChange} />
      </React.Fragment>
    );
  }

  dayModeContent = () => {
    return (
      <React.Fragment>
        <PickerHeader
          onNextBtnClick={this.showNextMonth}
          onPrevBtnClick={this.showPrevMonth}
          activeDate={this.state.dateToShow}
          showWeeks
          width="7" />
        <DatePickerComponent
          onDateClick={this.onDateClick}
          activeDate={this.state.activeDate}
          showedMonth={this.state.dateToShow} />
      </React.Fragment>
    );
  }

  getDatePickerContent = () => {
    const { startMode } = this.props;
    const {
      year,
      month
    } = this.state;
    if (startMode === 'year' && !year) return this.yearModeContent();
    if (startMode === 'year' && !month) return this.monthModeContent();
    if (startMode === 'month' && !month) return this.monthModeContent();
    return this.dayModeContent();
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
  startMode: PropTypes.oneOf(['year', 'month', 'day'])
};

DatePicker.defaultProps = {
  onDateChange: emptyFunction,
  startMode: 'day'
};

export default DatePicker;
export {
  DatePicker
};
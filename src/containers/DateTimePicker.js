import React from 'react';
import { Table } from 'semantic-ui-react';
import { getUnhandledProps, emptyFunction, cloneReplaceValue } from '../utils.js';
import { PickerHeader, DatePickerComponent, TimePickerComponent } from '../components';
import PropTypes from 'prop-types';
import moment from 'moment';

class DateTimePicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeDate: null,
      activeMonth: moment(),
      activeHour: '',
      activeMinute: ''
    };
  }

  onDateClick = (event, data) => {
    const { onDateChange } = this.props;

    this.setState({
      activeDate: data.value
    });
    onDateChange(event, data);
  }

  onHourClick = (event, data) => {
    this.setState(prevState => {
      const newData = cloneReplaceValue(data, this.getTime({
        hour: data.value,
        minute: ''
      }));
      this.props.onTimeChange(event, newData);
      return {
        activeHour: data.value
      };
    });
  }

  onMinuteClick = (event, data) => {
    this.setState(prevState => {
      const newData = cloneReplaceValue(data, this.getTime({
        hour: prevState.activeHour,
        minute: data.value
      }));
      this.props.onTimeChange(event, newData);
      return {
        activeMinute: data.value
      };
    });
  }

  getTime = ({hour = '', minute = ''}) => {
    return `${hour}:${minute}`;
  }

  onNextBtnClick = ({ day }) => {
    if (day) {
      this.setState(({ activeDate }) => {
        let nextDay = activeDate.clone();
        nextDay.add(1, 'd');
        return { activeDate: nextDay };
      });
    } else {
      this.setState(({ activeMonth }) => {
        let nextMonth = activeMonth.clone();
        nextMonth.add(1, 'M');
        return { activeMonth: nextMonth };
      });
    }
  }

  onPrevBtnClick = ({ day }) => {
    if (day) {
      this.setState(({ activeDate }) => {
        let prevDay = activeDate.clone();
        prevDay.add(-1, 'd');
        return { activeDate: prevDay };
      });
    } else {
      this.setState(({ activeMonth }) => {
        let prevMonth = activeMonth.clone();
        prevMonth.add(-1, 'M');
        return { activeMonth: prevMonth };
      });
    }
  }

  getActiveDate = () => {
    return this.state.activeDate || moment();
  }

  getDateTimePickerContent = () => {
    const {
      activeDate,
      activeHour,
      activeMinute,
      activeMonth
    } = this.state;
    const headerWidth = activeHour? '3' : activeDate? '4' : '7';
    if (!activeDate) {
      return (
        <React.Fragment>
          <PickerHeader
            onNextBtnClick={this.onNextBtnClick}
            onPrevBtnClick={this.onPrevBtnClick}
            activeDate={activeMonth}
            showWeeks
            width="7" />
          <DatePickerComponent
            onDateClick={this.onDateClick}
            activeDate={this.getActiveDate()}
            showedMonth={activeMonth} />
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <PickerHeader
          onNextBtnClick={this.onNextBtnClick.bind(null, { day: true })}
          onPrevBtnClick={this.onPrevBtnClick.bind(null, { day: true })}
          activeDate={activeDate}
          includeDay
          width={headerWidth} />
        <TimePickerComponent
          activeHour={activeHour}
          activeMinute={activeMinute}
          onHourClick={this.onHourClick}
          onMinuteClick={this.onMinuteClick} />
      </React.Fragment>
    );
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
  onTimeChange: PropTypes.func
};

DateTimePicker.defaultProps = {
  onDateChange: emptyFunction,
  onTimeChange: emptyFunction
};

export default DateTimePicker;
export {
  DateTimePicker
};
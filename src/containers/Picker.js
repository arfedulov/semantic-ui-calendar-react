import React from 'react';
import { DatePickerComponent, DateTimePickerHeader } from '../components';
import { TimePickerComponent } from '../components';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { getUnhandledProps } from '../utils.js';

class Picker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeDate: null,
      showedMonth: moment(),
      activeHour: '',
      datesRange: { start: null, end: null }
    };
  }


  setDatesRange = (event, data) => {
    const { onDatesRangeChange } = this.props;
    this.setState(({ datesRange }) => {
      let newState;
      if (datesRange.start && datesRange.end) {
        newState = {
          datesRange: { start: null, end: null }
        };
        onDatesRangeChange(event, this.cloneReplaceValue(data, this.getDatesRange()));
      } else if (datesRange.start && datesRange.start.isAfter(data.value)) {
        newState = {
          datesRange: { start: null, end: null }
        };
        onDatesRangeChange(event, this.cloneReplaceValue(data, this.getDatesRange()));
      } else if (datesRange.start) {
        newState = {
          datesRange: { start: datesRange.start, end: data.value }
        };
        onDatesRangeChange(event, this.cloneReplaceValue(data, this.getDatesRange({
          start: datesRange.start,
          end: data.value
        })));
      } else {
        newState = {
          datesRange: { start: data.value, end: datesRange.end }
        };
        onDatesRangeChange(event, this.cloneReplaceValue(data, this.getDatesRange({
          start: data.value,
          end: datesRange.end
        })));
      }
      return newState;
    });
  }

  getDatesRange = (range) => {
    const { start, end } = range? range : { start: null, end: null };
    const startStr = start && start.format? start.format('DD.MM.YY') : '. . .';
    const endStr = end && end.format? end.format('DD.MM.YY') : '. . .';
    return `${startStr} - ${endStr}`;
  }

  onDateClick = (event, data) => {
    const { pickDatesRange, onDateChange } = this.props;

    if (pickDatesRange) {
      this.setDatesRange(event, data);
    } else {
      this.setState({
        activeDate: data.value
      });
    }
    onDateChange(event, data);
  }

  onHourClick = (event, data) => {
    this.setState(prevState => {
      const newData = this.cloneReplaceValue(data, this.getTime({
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
      const newData = this.cloneReplaceValue(data, this.getTime({
        hour: prevState.activeHour,
        minute: data.value
      }));
      this.props.onTimeChange(event, newData);
      return {
        activeMinute: data.value
      };
    });
  }

  cloneReplaceValue = (data, newValue) => {
    return Object.assign({}, data, { value: newValue });
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
      this.setState(({ showedMonth }) => {
        let nextMonth = showedMonth.clone();
        nextMonth.add(1, 'M');
        return { showedMonth: nextMonth };
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
      this.setState(({ showedMonth }) => {
        let prevMonth = showedMonth.clone();
        prevMonth.add(-1, 'M');
        return { showedMonth: prevMonth };
      });
    }
  }

  getActiveDate = () => {
    return this.state.activeDate || moment();
  }

  getDateTimePicker = () => {
    const {
      activeDate,
      activeHour,
      activeMinute,
      showedMonth
    } = this.state;
    const headerWidth = activeHour? '3' : activeDate? '4' : '7';
    if (!activeDate) {
      return (
        <React.Fragment>
          <DateTimePickerHeader
            onNextBtnClick={this.onNextBtnClick}
            onPrevBtnClick={this.onPrevBtnClick}
            showedDate={showedMonth}
            showDate={false}
            showWeeks={true}
            width="7" />
          <DatePickerComponent
            onDateClick={this.onDateClick}
            activeDate={this.getActiveDate()}
            showedMonth={showedMonth} />
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <DateTimePickerHeader
          onNextBtnClick={this.onNextBtnClick.bind(null, { day: true })}
          onPrevBtnClick={this.onPrevBtnClick.bind(null, { day: true })}
          showedDate={activeDate}
          showDate
          showWeeks={false}
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
    const {
      pickDate,
      pickTime,
      pickDateTime,
      pickDatesRange
    } = this.props;
    const rest = getUnhandledProps(Picker, this.props);

    if (pickDate) {
      return (
        <Table
          { ...rest }
          unstackable
          celled
          textAlign="center">
          <DateTimePickerHeader
            onNextBtnClick={this.onNextBtnClick}
            onPrevBtnClick={this.onPrevBtnClick}
            showedDate={this.state.showedMonth}
            showDate={false}
            showWeeks={true}
            width="7" />
          <DatePickerComponent
            onDateClick={this.onDateClick}
            activeDate={this.getActiveDate()}
            showedMonth={this.state.showedMonth} />
        </Table>
      );
    }
    if (pickTime) {
      return (
        <Table
          { ...rest }
          unstackable
          celled
          textAlign="center">
          <TimePickerComponent
            activeHour={this.state.activeHour}
            activeMinute={this.state.activeMinute}
            onHourClick={this.onHourClick}
            onMinuteClick={this.onMinuteClick} />
        </Table>
      );
    }
    if (pickDateTime) {
      return (
        <Table
          { ...rest }
          unstackable
          celled
          textAlign="center">
          { this.getDateTimePicker() }
        </Table>
      );
    }
    if (pickDatesRange) {
      return (
        <Table
          { ...rest }
          unstackable
          celled
          textAlign="center">
          <DateTimePickerHeader
            onNextBtnClick={this.onNextBtnClick}
            onPrevBtnClick={this.onPrevBtnClick}
            showedDate={this.state.showedMonth}
            showedRange={this.state.datesRange}
            showDate={false}
            showWeeks
            width="7" />
          <DatePickerComponent
            datesRange={this.state.datesRange}
            onDateClick={this.onDateClick}
            showedMonth={this.state.showedMonth} />
        </Table>
      );
    }
  }
}

Picker.propTypes = {
  pickDate: PropTypes.bool,
  pickTime: PropTypes.bool,
  pickDateTime: PropTypes.bool,
  pickDatesRange: PropTypes.bool,
  /** (newDate) => {} 
   * @param {moment} newDate
  */
  onDateChange: PropTypes.func,
  /** (newTime) => {}
   * @param {string} newTime hh:mm
   */
  onTimeChange: PropTypes.func,
  /** (newDatesRange) => {}
   * @param {{start: moment, end: moment}} newDatesRange
  */
  onDatesRangeChange: PropTypes.func
};

Picker.defaultProps = {
  onDateChange: () => {},
  onTimeChange: () => {},
  onDatesRangeChange: () => {}
};

export default Picker;
export {
  Picker
};
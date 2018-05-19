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
      activeMinute: '',
      datesRange: { start: null, end: null }
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    const {
      activeDate,
      activeHour,
      activeMinute,
      datesRange
    } = this.state;
    const {
      onDateChange,
      onTimeChange,
      onDatesRangeChange
    } = this.props;
    const dateChanged = activeDate && activeDate.isSame && !activeDate.isSame(prevState.activeDate);
    const timeChanged = activeHour
      && activeMinute && (activeHour !== prevState.activeHour || activeMinute !== prevState.activeMinute);
    const datesRangeChanged = datesRange.start && datesRange.end
      && (!datesRange.start.isSame(prevState.datesRange.start) || !datesRange.end.isSame(prevState.datesRange.end));

    if (dateChanged) {
      onDateChange(activeDate);
    }
    if (timeChanged) {
      onTimeChange(activeHour + ':' + activeMinute);
    }
    if (datesRangeChanged) {
      onDatesRangeChange(datesRange);
    }
  }

  setDatesRange = (clickedDate) => {
    this.setState(({ datesRange }) => {
      if (datesRange.start && datesRange.end) {
        return {
          datesRange: { start: null, end: null }
        };
      }
      if (datesRange.start) {
        if (datesRange.start.isAfter(clickedDate)) {
          return {
            datesRange: { start: null, end: null }
          };
        }
        return {
          datesRange: { start: datesRange.start, end: clickedDate }
        };
      }
      return {
        datesRange: { start: clickedDate, end: datesRange.end }
      };
    });
  }

  onDateClick = (event, { value }) => {
    const { pickDatesRange } = this.props;

    if (pickDatesRange) {
      this.setDatesRange(value);
    } else {
      this.setState({
        activeDate: value
      });
    }
  }

  onHourClick = (clickedHour) => {
    this.setState({
      activeHour: clickedHour
    });
  }

  onMinuteClick = (clickedMinute) => {
    this.setState({
      activeMinute: clickedMinute
    });
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
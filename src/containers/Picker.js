import React from 'react';
import { Table } from 'semantic-ui-react';
import {
  monthIndex,
  cloneReplaceValue,
  emptyFunction,
  getUnhandledProps,
  tick
} from '../utils.js';
import { PickerHeader, DatePickerComponent, MonthPickerComponent, TimePickerComponent } from '../components';
import { YearPicker } from '.';
import moment from 'moment';
import PropTypes from 'prop-types';

class Picker extends React.Component {

  constructor(props) {
    super(props);

    const {
      initialValue,
      dateFormat,
      startMode
    } = props;
    const initialDate = initialValue? moment(initialValue, dateFormat) : moment();
    this.state = {
      activeDate: initialValue? initialDate : null,
      dateToShow: initialDate,
      year: startMode !== 'year'? initialDate.year().toString() : '',
      month: '',
      activeHour: '',
      activeMinute: '',
      mode: startMode,
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
        onDatesRangeChange(event, cloneReplaceValue(data, this.getDatesRange()));
      } else if (datesRange.start && datesRange.start.isAfter(data.value)) {
        newState = {
          datesRange: { start: null, end: null }
        };
        onDatesRangeChange(event, cloneReplaceValue(data, this.getDatesRange()));
      } else if (datesRange.start) {
        newState = {
          datesRange: { start: datesRange.start, end: data.value }
        };
        onDatesRangeChange(event, cloneReplaceValue(data, this.getDatesRange({
          start: datesRange.start,
          end: data.value
        })));
      } else {
        newState = {
          datesRange: { start: data.value, end: datesRange.end }
        };
        onDatesRangeChange(event, cloneReplaceValue(data, this.getDatesRange({
          start: data.value,
          end: datesRange.end
        })));
      }
      return newState;
    });
  }

  getDatesRange = (range) => {
    const { dateFormat, divider } = this.props;
    const { start, end } = range? range : { start: null, end: null };
    const startStr = start && start.format? start.format(dateFormat) : '. . .';
    const endStr = end && end.format? end.format(dateFormat) : '. . .';
    return `${startStr}${divider}${endStr}`;
  }

  switchToPrevMode = (lastMode = 'day') => {
    const getNextMode = (mode) => {
      if (mode === 'minute') return 'hour';
      if (mode === 'hour') return 'day';
      if (mode === 'day') return 'month';
      if (mode === 'month') return 'year';
      return lastMode;
    };
    this.setState({ mode: getNextMode(this.state.mode) });
  }

  switchToNextMode = (lastMode = 'day') => {
    const getNextMode = (mode) => {
      if (mode === lastMode) return lastMode;
      if (mode === 'year') return 'month';
      if (mode === 'month') return 'day';
      if (mode === 'day') return 'hour';
      if (mode === 'hour') return 'minute';
      return lastMode;
    };
    this.setState({ mode: getNextMode(this.state.mode) });
  }

  showNextYear = () => {
    this.setState(({ dateToShow }) => {
      let nextYear = dateToShow.clone();
      nextYear.add(1, 'Y');
      return {
        dateToShow: nextYear,
        year: nextYear.format('YYYY')
      };
    });
  }

  showPrevYear = () => {
    this.setState(({ dateToShow }) => {
      let prevYear = dateToShow.clone();
      prevYear.add(-1, 'Y');
      return {
        dateToShow: prevYear,
        year: prevYear.format('YYYY')
      };
    });
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

  showNextDay = () => {
    if (this.props.pickDateTime) this.resetMinutes();
    this.setState(({ activeDate }) => {
      let nextDay = activeDate.clone();
      nextDay.add(1, 'd');
      this.props.onDateChange(null, {value: nextDay});
      return { activeDate: nextDay };
    });
  }

  showPrevDay = () => {
    if (this.props.pickDateTime) this.resetMinutes();
    this.setState(({ activeDate }) => {
      let prevDay = activeDate.clone();
      prevDay.add(-1, 'd');
      this.props.onDateChange(null, {value: prevDay});
      return { activeDate: prevDay };
    });
  }

  onDateClick = (event, data) => {
    tick(() => {
      const { onDateChange } = this.props;

      this.setState({
        activeDate: data.value
      });
      onDateChange(event, data);
      this.switchToNextMode(this.props.pickDateTime? 'minute' : 'day');
    });
  }

  onHourClick = (event, data) => {
    tick(() => {
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
      this.switchToNextMode('minute');
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
    this.switchToNextMode('minute');
  }

  onYearChange = (event, data) => {
    const date = {
      year: data.value
    };
    this.setState({
      dateToShow: moment(date),
      year: data.value
    });
    this.switchToNextMode();
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
    this.switchToNextMode();
  }

  handleHeaderDateClick = (event, data) => {
    this.switchToPrevMode();
  }

  handleHeaderTimeClick = (event, data) => {
    this.switchToPrevMode('minute');
    this.resetMinutes();
    this.resetHours();
  }

  resetMinutes = () => {
    this.setState({ activeMinute: ''});
  }

  resetHours = () => {
    this.setState({ activeHour: ''});
  }
  
  getTime = ({hour = '', minute = ''}) => {
    return `${hour}:${minute}`;
  }

  yearModeContent = () => {
    return (
      <YearPicker
        onHeaderDateClick={this.handleHeaderDateClick}
        standalone={false}
        onYearChange={this.onYearChange} />
    );
  }

  monthModeContent = () => {
    return (
      <React.Fragment>
        <PickerHeader
          onDateClick={this.handleHeaderDateClick}
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
          onDateClick={this.handleHeaderDateClick}
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
    const { mode } = this.state;
    if (mode === 'year') return this.yearModeContent();
    if (mode === 'year') return this.monthModeContent();
    if (mode === 'month') return this.monthModeContent();
    return this.dayModeContent();
  }

  getDateTimePickerContent = () => {
    const {
      activeDate,
      activeHour,
      activeMinute,
      mode
    } = this.state;
    const headerWidth = mode === 'minute'? '3' : mode === 'hour'? '4' : '7';
    if (mode !== 'hour' && mode !== 'minute') {
      return this.getDatePickerContent();
    }
    return (
      <React.Fragment>
        <PickerHeader
          onDateClick={this.handleHeaderTimeClick}
          onNextBtnClick={this.showNextDay}
          onPrevBtnClick={this.showPrevDay}
          activeDate={activeDate}
          includeDay
          width={headerWidth} />
        <TimePickerComponent
          mode={mode}
          activeHour={activeHour}
          activeMinute={activeMinute}
          onHourClick={this.onHourClick}
          onMinuteClick={this.onMinuteClick} />
      </React.Fragment>
    );
  }

  render() {
    const rest = getUnhandledProps(Picker, this.props);
    const {
      pickDate,
      pickDatesRange
    } = this.props;

    if (pickDatesRange) {
      return (
        <Table
          { ...rest }
          unstackable
          celled
          textAlign="center">
          <PickerHeader
            onDateClick={this.handleHeaderDateClick}
            onNextBtnClick={this.showNextMonth}
            onPrevBtnClick={this.showPrevMonth}
            activeDate={this.state.dateToShow}
            activeDatesRange={this.state.datesRange}
            showWeeks
            width="7" />
          <DatePickerComponent
            datesRange={this.state.datesRange}
            onDateClick={this.setDatesRange}
            showedMonth={this.state.dateToShow} />
        </Table>
      );
    }
    return (
      <Table
        { ...rest }
        unstackable
        celled
        textAlign="center">
        { pickDate? this.getDatePickerContent() : this.getDateTimePickerContent() }
      </Table>
    );
  }
}

Picker.propTypes = {
  /** (event, data) => {} */
  onDateChange: PropTypes.func,
  /** (event, data) => {} */
  onTimeChange: PropTypes.func,
  onDatesRangeChange: PropTypes.func,
  startMode: PropTypes.oneOf(['year', 'month', 'day']),
  initialValue: PropTypes.string,
  dateFormat: PropTypes.string,
  pickDate: PropTypes.bool,
  pickDateTime: PropTypes.bool,
  pickDatesRange: PropTypes.bool,
  divider: PropTypes.string
};

Picker.defaultProps = {
  onDateChange: emptyFunction,
  onTimeChange: emptyFunction,
  startMode: 'day',
  dateFormat: 'DD-MM-YYYY',
  divider: ' - '
};

export default Picker;
export {
  Picker
};
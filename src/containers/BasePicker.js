import React from 'react';
import { monthIndex, cloneReplaceValue } from '../utils.js';
import { PickerHeader, DatePickerComponent, MonthPickerComponent, TimePickerComponent } from '../components';
import { YearPicker } from '.';
import moment from 'moment';

/** Base class for DatePicker, DateTimePicker, DatesRangePicker.
 * Expects that inheritors have state with some of the following properties:
 * 
 *    activeDate:   {moment} This object is lifted up, it represents a Picker's selected value
 *    dateToShow:   {moment} This object determines what years are currently visible in YearPicker or
 *                           what month is currently viewed on calendar. In other words it determines
 *                           what is showed.
 *    year:         {string} Selected year. For example '2012'.
 *    month:        {string} Selected month. For example 'Jan'.
 *    activeHour:   {string} Selected hour. For example '05'.
 *    activeMinute: {string} Selected minute. For example '15'.
 *    datesRange:   {object} Selected dates range. For example {start: moment(2012-01-01), end: moment(2012-01-15)}.
 */
class BasePicker extends React.Component {

  getTime = ({hour = '', minute = ''}) => {
    return `${hour}:${minute}`;
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
    if (this.isDateTimePicker) this.resetMinutes();
    this.setState(({ activeDate }) => {
      let nextDay = activeDate.clone();
      nextDay.add(1, 'd');
      this.props.onDateChange(null, {value: nextDay});
      return { activeDate: nextDay };
    });
  }

  showPrevDay = () => {
    if (this.isDateTimePicker) this.resetMinutes();
    this.setState(({ activeDate }) => {
      let prevDay = activeDate.clone();
      prevDay.add(-1, 'd');
      this.props.onDateChange(null, {value: prevDay});
      return { activeDate: prevDay };
    });
  }

  onDateClick = (event, data) => {
    const { onDateChange } = this.props;

    this.setState({
      activeDate: data.value
    });
    onDateChange(event, data);
    this.switchToNextMode(this.isDateTimePicker? 'minute' : 'day');
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
    this.switchToNextMode('minute');
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
}

export default BasePicker;
export {
  BasePicker
};
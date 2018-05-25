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
    this.setState(({ activeDate }) => {
      let nextDay = activeDate.clone();
      nextDay.add(1, 'd');
      this.props.onDateChange(null, {value: nextDay});
      return { activeDate: nextDay };
    });
  }

  showPrevDay = () => {
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

  getDateTimePickerContent = () => {
    const {
      activeDate,
      activeHour,
      activeMinute
    } = this.state;
    const headerWidth = activeHour? '3' : activeDate? '4' : '7';
    if (!activeDate) {
      return this.getDatePickerContent();
    }
    return (
      <React.Fragment>
        <PickerHeader
          onNextBtnClick={this.showNextDay}
          onPrevBtnClick={this.showPrevDay}
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
}

export default BasePicker;
export {
  BasePicker
};
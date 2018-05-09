import React from 'react';
import { Calendar } from './Calendar.js';
import moment from 'moment';

class CalendarContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeDate: moment(),
      showedMonth: moment()
    };
  }

  onDateClick = (clickedDate) => {
    this.setState({
      activeDate: clickedDate
    });
  }

  onNextBtnClick = () => {
    this.setState(({ showedMonth }) => {
      let nextMonth = showedMonth.clone();
      nextMonth.add(1, 'M');
      return { showedMonth: nextMonth };
    });
  }

  onPrevBtnClick = () => {
    this.setState(({ showedMonth }) => {
      let prevMonth = showedMonth.clone();
      prevMonth.add(-1, 'M');
      return { showedMonth: prevMonth };
    });
  }

  render() {
    return (
      <Calendar
        onDateClick={this.onDateClick}
        onNextBtnClick={this.onNextBtnClick}
        onPrevBtnClick={this.onPrevBtnClick}
        activeDate={this.state.activeDate}
        showedMonth={this.state.showedMonth} />
    );
  }
}

export default CalendarContainer;
export {
  CalendarContainer
};
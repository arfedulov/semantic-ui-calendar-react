import React from 'react';
import { Table } from 'semantic-ui-react';
import { PickerHeader, DatePickerComponent } from '../components';
import { getUnhandledProps, emptyFunction, cloneReplaceValue } from '../utils.js';
import PropTypes from 'prop-types';
import moment from 'moment';

class DatesRangePicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeMonth: moment(),
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

  onDateClick = (event, data) => {
    this.setDatesRange(event, data);
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

  render() {
    const rest = getUnhandledProps(DatesRangePicker, this.props);

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
          activeDatesRange={this.state.datesRange}
          showWeeks
          width="7" />
        <DatePickerComponent
          datesRange={this.state.datesRange}
          onDateClick={this.onDateClick}
          showedMonth={this.state.activeMonth} />
      </Table>
    );
  }
}

DatesRangePicker.propTypes = {
  /** (event, data) => {} */
  onDatesRangeChange: PropTypes.func,
  /** Date formatting string.
   * Anything that that can be passed to ``moment().format``.
   */
  dateFormat: PropTypes.string,
  /** Characters that are used to divide dates in string. */
  divider: PropTypes.string
};

DatesRangePicker.defaultProps = {
  onDatesRangeChange: emptyFunction,
  dateFormat: 'DD.MM.YY',
  divider: ' - '
};

export default DatesRangePicker;
export {
  DatesRangePicker
};
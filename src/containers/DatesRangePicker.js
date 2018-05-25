import React from 'react';
import { Table } from 'semantic-ui-react';
import { PickerHeader, DatePickerComponent } from '../components';
import { getUnhandledProps, emptyFunction, cloneReplaceValue } from '../utils.js';
import PropTypes from 'prop-types';
import moment from 'moment';
import { BasePicker } from './BasePicker.js';

class DatesRangePicker extends BasePicker {
  constructor(props) {
    super(props);

    const initialDate = moment();
    this.state = {
      dateToShow: initialDate,
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

  render() {
    const rest = getUnhandledProps(DatesRangePicker, this.props);

    return (
      <Table
        { ...rest }
        unstackable
        celled
        textAlign="center">
        <PickerHeader
          onNextBtnClick={this.showNextMonth}
          onPrevBtnClick={this.showPrevMonth}
          activeDate={this.state.dateToShow}
          activeDatesRange={this.state.datesRange}
          showWeeks
          width="7" />
        <DatePickerComponent
          datesRange={this.state.datesRange}
          onDateClick={this.onDateClick}
          showedMonth={this.state.dateToShow} />
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
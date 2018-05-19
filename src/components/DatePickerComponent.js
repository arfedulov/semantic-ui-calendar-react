import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { DatePickerCell as Cell } from './DatePickerCell.js';
import moment from 'moment';
import { 
  isActiveDate,
  isDayInMonth,
  getArrayOfWeeks,
  getUnhandledProps
} from '../utils.js';

function DatePickerComponent(props) {
  const {
    onDateClick,
    activeDate,
    showedMonth,
    datesRange
  } = props;
  const rest = getUnhandledProps(DatePickerComponent, props);
  const data = getArrayOfWeeks(showedMonth);
  const _getRow = (week, key) => {
    const days = week.map((day) => {
      const active = isActiveDate(day, activeDate || datesRange);
      const disabled = !isDayInMonth(day, showedMonth);
      // const onCellClick = (event, data) => {
      //   onDateClick(event, { ...props, value: day});
      //   // onDateClick(day);
      //   // console.log(event);
      //   // console.log(data.value);
      //   // onDateClick(day);
      // };
      return (
        <Cell
          onClick={onDateClick}
          active={active}
          disabled={disabled}
          data={day}
          key={day.format('DD-MM-YYYY')} />
      );
    });
    return (
      <Table.Row key={key}>
        { days }
      </Table.Row>
    );
  };

  const _getTableContent = (weeks) => {
    return weeks.map((week) => _getRow(week, week[0].format('YYYY-MM-DD')));
  };

  return (
    <Table.Body { ...rest }>
      { _getTableContent(data) }
    </Table.Body>
  );
}

DatePickerComponent.propTypes = {
  /** (clickedDate) => { do something }
   * 
   * @param clickedDate `moment` instance
   */
  onDateClick: PropTypes.func.isRequired,
  /** calendar shows month of this `moment` */
  showedMonth: PropTypes.instanceOf(moment).isRequired,
  /** Currently selected date */
  activeDate: PropTypes.instanceOf(moment),
  /** Dates range */
  datesRange: PropTypes.shape({
    start: PropTypes.instanceOf(moment),
    end: PropTypes.instanceOf(moment)
  })
};

export default DatePickerComponent;
export {
  DatePickerComponent
};
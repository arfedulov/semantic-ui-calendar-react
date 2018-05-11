import React from 'react';
import { Table } from 'semantic-ui-react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import { DatePickerCell as Cell } from './DatePickerCell.js';
import moment from 'moment';
import { 
  compareDates,
  isDayInMonth,
  getArrayOfWeeks
} from '../utils.js';

function DatePickerComponent(props) {
  const {
    onDateClick,
    activeDate,
    showedMonth,
    className
  } = props;
  const data = getArrayOfWeeks(showedMonth);
  const _getRow = (week, key) => {
    const days = week.map((day) => {
      const active = compareDates(day, activeDate);
      const disabled = !isDayInMonth(day, showedMonth);
      return (
        <Cell
          onClick={onDateClick.bind(null, day)}
          active={active}
          disabled={disabled}
          key={day.format('DD-MM-YYYY')}>
          { day.format('D') }
        </Cell>
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

  const classes = ClassNames(className);
  return (
    <Table.Body>
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
  /** Currently selected date */
  activeDate: PropTypes.instanceOf(moment).isRequired,
  /** calendar shows month of this `moment` */
  showedMonth: PropTypes.instanceOf(moment).isRequired,
  className: PropTypes.string
};

export default DatePickerComponent;
export {
  DatePickerComponent
};
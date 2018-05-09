import React from 'react';
import { Table, Icon } from 'semantic-ui-react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment';
import { 
  compareDates,
  isDayInMonth,
  getWeekDays,
  getArrayOfWeeks
} from '../utils.js';

function Cell(props) {
  const {
    active,
    disabled,
    className,
    children,
    onClick
  } = props;
  const classes = ClassNames(
    className,
    'suir-calendar',
    'date'
  );
  return (
    <Table.Cell
      onClick={onClick}
      active={active}
      disabled={disabled}
      className={classes}>
      {children}
    </Table.Cell>
  );
}

function Calendar(props) {
  const {
    onDateClick,
    onNextBtnClick,
    onPrevBtnClick,
    activeDate,
    className
  } = props;
  const data = getArrayOfWeeks(activeDate);
  const _getBodyRow = (week) => {
    const days = week.map((day) => {
      const active = compareDates(day, activeDate);
      const disabled = !isDayInMonth(day, activeDate);
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
      <Table.Row>
        { days }
      </Table.Row>
    );
  };

  const _getBody = (weeks) => {
    return weeks.map((week) => _getBodyRow(week));
  };

  const _getWeekDayHeaders = () => {
    return getWeekDays().map((weekDay) => (
      <Table.HeaderCell
        key={weekDay}
        className="suir-calendar week-day"
        colSpan="1">
        {weekDay}
      </Table.HeaderCell>
    ));
  };

  const classes = ClassNames(className);
  const cellClasses = ClassNames(
    'suir-calendar',
    'cell'
  );
  const buttonClasses = ClassNames(
    'suir-calendar',
    'button'
  );
  return (
    <Table unstackable celled textAlign="center" className={classes}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell className={cellClasses} colSpan="1">
            <Icon
              className={buttonClasses}
              onClick={onPrevBtnClick}
              name="chevron left" />
          </Table.HeaderCell>
          <Table.HeaderCell className={cellClasses} colSpan="5">{activeDate.format('MMMM YYYY')}</Table.HeaderCell>
          <Table.HeaderCell className={cellClasses} colSpan="1">
            <Icon
              className={buttonClasses}
              onClick={onNextBtnClick}
              name="chevron right" />
          </Table.HeaderCell>
        </Table.Row>
        <Table.Row>
          { _getWeekDayHeaders() }
        </Table.Row>
      </Table.Header>
      <Table.Body>
        { _getBody(data) }
      </Table.Body>
    </Table>
  );
}

Cell.propTypes = {
  active: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func
};

Calendar.propTypes = {
  /** (clickedDate) => { do something }
   * 
   * @param clickedDate `moment` instance
   */
  onDateClick: PropTypes.func.isRequired,
  onNextBtnClick: PropTypes.func.isRequired,
  onPrevBtnClick: PropTypes.func.isRequired,
  /** Currently selected date */
  activeDate: PropTypes.instanceOf(moment).isRequired,
  className: PropTypes.string
};

export default Calendar;
export {
  Calendar
};
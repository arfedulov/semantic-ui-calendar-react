import React from 'react';
import PropTypes from 'prop-types';
import { getUnhandledProps } from '../utils.js';
import { Table } from 'semantic-ui-react';
import moment from 'moment';
import _ from 'lodash';

const getMonths = () => {
  return moment.monthsShort();
};

function MonthPickerCell(props) {
  const { 
    onClick,
    month
  } = props;
  const rest = getUnhandledProps(MonthPickerCell, props);

  const onMonthClick = (event) => {
    event.stopPropagation();
    onClick(event, { ...props, value: month});
  };
   
  return (
    <Table.Cell
      { ...rest }
      onClick={onMonthClick}
      className="suir-calendar date"
      textAlign="center">
      { month }
    </Table.Cell>
  );
}

function MonthPickerComponent(props) {
  const { 
    onMonthClick,
    activeMonth
  } = props;
  const rest = getUnhandledProps(MonthPickerComponent, props);

  const cellStyle = {
    width: '33.333333%',
    minWidth: '7em'
  };
  const months = getMonths().map((month) => (
    <MonthPickerCell
      style={cellStyle}
      onClick={onMonthClick}
      active={month === activeMonth.toString()}
      month={month}
      key={month} />
  ));
  const rows = _.chunk(months, 3).map((row, i) => <Table.Row key={i}>{ row }</Table.Row>);
  return (
    <Table.Body { ...rest }>
      { rows }
    </Table.Body>
  );
}

MonthPickerCell.propTypes = {
  /** (event, data) => {} */
  onClick: PropTypes.func.isRequired,
  month: PropTypes.string.isRequired
};

MonthPickerComponent.propTypes = {
  /** (event, data) => {} */
  onMonthClick: PropTypes.func.isRequired,
  activeMonth: PropTypes.string
};

export default MonthPickerComponent;
export {
  MonthPickerComponent
};
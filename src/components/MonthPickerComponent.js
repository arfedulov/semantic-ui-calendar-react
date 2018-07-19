import React from 'react';
import PropTypes from 'prop-types';
import { getUnhandledProps, getMonths } from '../lib';
import { Table } from 'semantic-ui-react';
import _ from 'lodash';

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
    activeMonth,
    isDateDisabled,
  } = props;

  const cellStyle = {
    width: '33.333333%',
    minWidth: '7em'
  };
  const months = getMonths().map((month, monthIndex) => {
    const monthDisabled = _.isFunction(isDateDisabled) && isDateDisabled({ month: monthIndex });
    return (
      <MonthPickerCell
        disabled={monthDisabled}
        style={cellStyle}
        onClick={onMonthClick}
        active={!monthDisabled && month === activeMonth.toString()}
        month={month}
        key={month} />
    );
  });
  const rows = _.chunk(months, 3).map((row, i) => <Table.Row key={i}>{ row }</Table.Row>);
  return (
    <Table.Body>
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
  activeMonth: PropTypes.string,
  isDateDisabled: PropTypes.func,
};

export default MonthPickerComponent;
export {
  MonthPickerComponent
};
import React from 'react';
import { Table } from 'semantic-ui-react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import { getUnhandledProps } from '../lib';
import moment from 'moment';

function DatePickerCell(props) {
  const {
    className,
    onClick,
    data
  } = props;
  const classes = ClassNames(
    className,
    'suir-calendar',
    'date'
  );
  const rest = getUnhandledProps(DatePickerCell, props);
  const onCellClick = (event) => {
    event.stopPropagation();
    onClick(event, { ...props, value: data});
  };
  return (
    <Table.Cell
      { ...rest }
      onClick={onCellClick}
      className={classes}>
      { data.format('D') }
    </Table.Cell>
  );
}

DatePickerCell.propTypes = {
  data: PropTypes.instanceOf(moment).isRequired,
  className: PropTypes.string,
  /** (event, data) => {} */
  onClick: PropTypes.func
};

export default DatePickerCell;
export {
  DatePickerCell
};
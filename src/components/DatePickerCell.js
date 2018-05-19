import React from 'react';
import { Table } from 'semantic-ui-react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import { getUnhandledProps } from '../utils.js';

/** Semantic-ui-react's ``Table.Cell`` wrapper */
function DatePickerCell(props) {
  const {
    className,
    children
  } = props;
  const classes = ClassNames(
    className,
    'suir-calendar',
    'date'
  );
  const rest = getUnhandledProps(DatePickerCell, props);
  return (
    <Table.Cell
      { ...rest }
      className={classes}>
      {children}
    </Table.Cell>
  );
}

DatePickerCell.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
};

export default DatePickerCell;
export {
  DatePickerCell
};
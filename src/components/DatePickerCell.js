import React from 'react';
import { Table } from 'semantic-ui-react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';

function DatePickerCell(props) {
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

DatePickerCell.propTypes = {
  active: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func
};

export default DatePickerCell;
export {
  DatePickerCell
};
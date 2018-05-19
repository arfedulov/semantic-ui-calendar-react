import React from 'react';
import PropTypes from 'prop-types';
import { getHours, getUnhandledProps } from '../utils.js';
import { Table } from 'semantic-ui-react';

function HourPickerCell(props) {
  const { 
    onClick,
    hour
  } = props;
  const rest = getUnhandledProps(HourPickerCell, props);

  const onHourClick = (event) => {
    event.stopPropagation();
    onClick(event, { ...props, value: hour});
  };
  return (
    <Table.Cell
      { ...rest }
      onClick={onHourClick}
      className="suir-calendar time"
      textAlign="center">
      { hour + ':00' }
    </Table.Cell>
  );
}

function HourPicker(props) {
  const { 
    onHourClick,
    activeHour
  } = props;
  const rest = getUnhandledProps(HourPicker, props);

  const hours = getHours().map((hour) => (
    <HourPickerCell 
      onClick={onHourClick}
      active={hour === activeHour}
      hour={hour}
      key={hour} />
  ));
  const rows = function() {
    const rows = [];
    let rowIndex = 0;
    for (let i = 0; i < hours.length; i++) {
      if (i % 4 === 0 && i !== 0) { rowIndex += 1; }
      if (!rows[rowIndex]) { rows[rowIndex] = []; }
      rows[rowIndex].push(hours[i]);
    }
    return rows;
  }().map((row, i) => <Table.Row key={i}>{ row }</Table.Row>);
  return (
    <Table.Body { ...rest }>
      { rows }
    </Table.Body>
  );
}

HourPickerCell.propTypes = {
  /** (event, data) => {} */
  onClick: PropTypes.func.isRequired,
  hour: PropTypes.string.isRequired
};

HourPicker.propTypes = {
  /** (event, data) => {} */
  onHourClick: PropTypes.func.isRequired,
  activeHour: PropTypes.string
};

export default HourPicker;
export {
  HourPicker
};
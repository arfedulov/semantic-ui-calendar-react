import React from 'react';
import PropTypes from 'prop-types';
import { getHours } from '../utils.js';
import { Table } from 'semantic-ui-react';

function HourPicker(props) {
  const { 
    onTimeClick,
    activeHour
  } = props;
  const hours = getHours().map((hour) => (
    <Table.Cell
      onClick={onTimeClick.bind(null, hour)}
      className="suir-calendar time"
      active={hour === activeHour}
      textAlign="center"
      key={hour}>{hour + ':00'}</Table.Cell>
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
    <Table.Body>
      { rows }
    </Table.Body>
  );
}

HourPicker.propTypes = {
  /** (clickedTime) => do somthing
   * 
   * @param clickedTime {string} 'hh'
   */
  onTimeClick: PropTypes.func.isRequired,
  activeHour: PropTypes.string
};

export default HourPicker;
export {
  HourPicker
};
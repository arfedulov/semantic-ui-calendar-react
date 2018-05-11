import React from 'react';
import PropTypes from 'prop-types';
import { getMinutes } from '../utils.js';
import { Table } from 'semantic-ui-react';

function MinutePicker(props) {
  const {
    onTimeClick,
    hour,
    activeMinute
  } = props;
  const minutes = getMinutes().map((minute) => (
    <Table.Cell
      onClick={onTimeClick.bind(null, minute)}
      className="suir-calendar time"
      active={minute === activeMinute}
      textAlign="center"
      key={minute}>{hour + ':' + minute}</Table.Cell>
  ));
  const rows = function() {
    const rows = [];
    let rowIndex = 0;
    for (let i = 0; i < minutes.length; i++) {
      if (i % 3 === 0 && i !== 0) { rowIndex += 1; }
      if (!rows[rowIndex]) { rows[rowIndex] = []; }
      rows[rowIndex].push(minutes[i]);
    }
    return rows;
  }().map((row, i) => <Table.Row key={i}>{ row }</Table.Row>);
  return (
    <Table.Body>
      { rows }
    </Table.Body>
  );
}

MinutePicker.propTypes = {
  /** (clickedTime) => do somthing
   * 
   * @param clickedTime {string} 'mm'
   */
  onTimeClick: PropTypes.func.isRequired,
  /** 'hh' */
  hour: PropTypes.string.isRequired,
  activeMinute: PropTypes.string
};

export default MinutePicker;
export {
  MinutePicker
};
import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { getUnhandledProps } from '../utils.js';

const MINUTES = [
  '00',
  '05',
  '10',
  '15',
  '20',
  '25',
  '30',
  '35',
  '40',
  '45',
  '50',
  '55'
];

function MinutePickerCell(props) {
  const { 
    onClick,
    hour,
    minute
  } = props;
  const rest = getUnhandledProps(MinutePickerCell, props);

  const onMinuteClick = (event) => {
    event.stopPropagation();
    onClick(event, { ...props, value: minute});
  };
  return (
    <Table.Cell
      { ...rest }
      onClick={onMinuteClick}
      className="suir-calendar time"
      textAlign="center">
      { hour + ':' + minute }
    </Table.Cell>
  );
}

function MinutePicker(props) {
  const {
    onMinuteClick,
    hour,
    activeMinute
  } = props;
  const rest = getUnhandledProps(MinutePicker, props);

  const cellStyle = {
    width: '33.33333%',
    minWidth: '8em'
  };
  const minutes = MINUTES.map((minute) => (
    <MinutePickerCell
      style={cellStyle}
      onClick={onMinuteClick}
      active={minute === activeMinute}
      hour={hour}
      minute={minute}
      key={minute} />
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
    <Table.Body { ...rest }>
      { rows }
    </Table.Body>
  );
}

MinutePickerCell.propTypes = {
  /** (event, data) => {} */
  onClick: PropTypes.func.isRequired,
  hour: PropTypes.string.isRequired,
  minute: PropTypes.string.isRequired
};

MinutePicker.propTypes = {
  /** (event, data) => {} */
  onMinuteClick: PropTypes.func.isRequired,
  /** 'hh' */
  hour: PropTypes.string.isRequired,
  activeMinute: PropTypes.string
};

export default MinutePicker;
export {
  MinutePicker
};
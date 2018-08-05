import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { getUnhandledProps } from '../lib';

const cellStyle = {
  width: '33.33333%',
  minWidth: '8em'
};

const hoverCellStyles = {
  width: '33.33333%',
  minWidth: '8em',
  outline: '1px solid #85b7d9',
  cursor: 'pointer',
};

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

class MinutePickerCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hoverCell: false,
    };
  }

  toggleHoverCell = () => {
    this.setState((prevState) => {
      return { hoverCell: !prevState.hoverCell };
    });
  }

  onMinuteClick = (event) => {
    const { 
      onClick,
      minute
    } = this.props;
    event.stopPropagation();
    onClick(event, { ...this.props, value: minute});
  }

  render() {
    const {
      hour,
      minute
    } = this.props;
    const rest = getUnhandledProps(MinutePickerCell, this.props);
  
    return (
      <Table.Cell
        { ...rest }
        onClick={this.onMinuteClick}
        style={this.state.hoverCell? hoverCellStyles : cellStyle}
        onMouseOver={this.toggleHoverCell}
        onMouseLeave={this.toggleHoverCell}
        textAlign="center">
        { hour + ':' + minute }
      </Table.Cell>
    );
  }
}

function MinutePicker(props) {
  const {
    onMinuteClick,
    hour,
    activeMinute
  } = props;

  const minutes = MINUTES.map((minute) => (
    <MinutePickerCell
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
    <Table.Body>
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
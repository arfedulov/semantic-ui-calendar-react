import React from 'react';
import PropTypes from 'prop-types';
import { getUnhandledProps } from '../lib';
import { Table } from 'semantic-ui-react';

const hoverCellStyles = {
  outline: '1px solid #85b7d9',
  cursor: 'pointer',
};

const HOURS = [
  '00',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23'
];

class HourPickerCell extends React.Component {
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

  onHourClick = (event) => {
    const { 
      onClick,
      hour
    } = this.props;
    event.stopPropagation();
    onClick(event, { ...this.props, value: hour});
  }

  render() {
    const {
      hour
    } = this.props;
    const rest = getUnhandledProps(HourPickerCell, this.props);
  
    return (
      <Table.Cell
        { ...rest }
        onClick={this.onHourClick}
        style={this.state.hoverCell? hoverCellStyles : undefined}
        onMouseOver={this.toggleHoverCell}
        onMouseLeave={this.toggleHoverCell}
        textAlign="center">
        { hour + ':00' }
      </Table.Cell>
    );
  }
}

function HourPicker(props) {
  const { 
    onHourClick,
    activeHour
  } = props;

  const hours = HOURS.map((hour) => (
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
    <Table.Body>
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
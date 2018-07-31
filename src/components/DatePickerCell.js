import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { getUnhandledProps } from '../lib';
import moment from 'moment';

const hoverCellStyles = {
  outline: '1px solid #85b7d9',
  cursor: 'pointer',
};

class DatePickerCell extends React.Component {
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

  onCellClick = (event) => {
    const {
      onClick,
      data
    } = this.props;
    event.stopPropagation();
    onClick(event, { ...this.props, value: data});
  }

  render() {
    const rest = getUnhandledProps(DatePickerCell, this.props);
    return (
      <Table.Cell
        { ...rest }
        style={this.state.hoverCell? hoverCellStyles : {}}
        onMouseOver={this.toggleHoverCell}
        onMouseLeave={this.toggleHoverCell}
        onClick={this.onCellClick}>
        { this.props.data.format('D') }
      </Table.Cell>
    );
  }
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
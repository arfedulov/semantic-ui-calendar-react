import React from 'react';
import PropTypes from 'prop-types';
import { getUnhandledProps, getMonths } from '../lib';
import { Table } from 'semantic-ui-react';
import _ from 'lodash';

const cellStyle = {
  width: '33.333333%',
  minWidth: '7em'
};

const hoverCellStyles = {
  width: '33.333333%',
  minWidth: '7em',
  outline: '1px solid #85b7d9',
  cursor: 'pointer',
};

class MonthPickerCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hoverCell: false,
    };
  }
  onMonthClick = (event) => {
    const { 
      onClick,
      month
    } = this.props;
    event.stopPropagation();
    onClick(event, { ...this.props, value: month});
  }

  toggleHoverCell = () => {
    this.setState((prevState) => {
      return { hoverCell: !prevState.hoverCell };
    });
  }

  render() {
    const { 
      hoverCell,
    } = this.state;
    const rest = getUnhandledProps(MonthPickerCell, this.props);
     
    return (
      <Table.Cell
        { ...rest }
        onClick={this.onMonthClick}
        style={hoverCell? hoverCellStyles : cellStyle}
        onMouseOver={this.toggleHoverCell}
        onMouseLeave={this.toggleHoverCell}
        textAlign="center">
        { this.props.month }
      </Table.Cell>
    );
  }
}

function MonthPickerComponent(props) {
  const { 
    onMonthClick,
    activeMonth,
    isDateDisabled,
  } = props;

  const months = getMonths().map((month, monthIndex) => {
    const monthDisabled = _.isFunction(isDateDisabled) && isDateDisabled({ month: monthIndex });
    return (
      <MonthPickerCell
        disabled={monthDisabled}
        onClick={onMonthClick}
        active={!monthDisabled && month === activeMonth.toString()}
        month={month}
        key={month} />
    );
  });
  const rows = _.chunk(months, 3).map((row, i) => <Table.Row key={i}>{ row }</Table.Row>);
  return (
    <Table.Body>
      { rows }
    </Table.Body>
  );
}

MonthPickerCell.propTypes = {
  /** (event, data) => {} */
  onClick: PropTypes.func.isRequired,
  month: PropTypes.string.isRequired,
};

MonthPickerComponent.propTypes = {
  /** (event, data) => {} */
  onMonthClick: PropTypes.func.isRequired,
  activeMonth: PropTypes.string,
  isDateDisabled: PropTypes.func,
};

export default MonthPickerComponent;
export {
  MonthPickerComponent
};
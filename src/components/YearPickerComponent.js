import React from 'react';
import PropTypes from 'prop-types';
import { getUnhandledProps } from '../lib';
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

/** Return array of 12 years as strings 'YYYY'.
 * @param {number} yearsStart */
const getYears = (yearsStart) => {
  const years = new Array(12);
  return _.fill(years, yearsStart).map((year, i) => (year + i).toString());
};

class YearPickerCell extends React.Component {
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

  onYearClick = (event) => {
    const { 
      onClick,
      year,
    } = this.props;
    event.stopPropagation();
    onClick(event, { ...this.props, value: year});
  }

  render() {
    const rest = getUnhandledProps(YearPickerCell, this.props);
     
    return (
      <Table.Cell
        { ...rest }
        onClick={this.onYearClick}
        style={this.state.hoverCell? hoverCellStyles : cellStyle}
        onMouseOver={this.toggleHoverCell}
        onMouseLeave={this.toggleHoverCell}
        textAlign="center">
        { this.props.year }
      </Table.Cell>
    );
  }
}

function YearPickerComponent(props) {
  const { 
    onYearClick,
    activeYear,
    yearsStart,
    isDateDisabled,
  } = props;

  const years = getYears(yearsStart).map((year) => {
    const yearDisabled = _.isFunction(isDateDisabled) && isDateDisabled({ year: parseInt(year) });
    return (
      <YearPickerCell
        disabled={yearDisabled}
        onClick={onYearClick}
        active={!yearDisabled && year === activeYear.toString()}
        year={year}
        key={year} />
    );
  });
  const rows = _.chunk(years, 3).map((row, i) => <Table.Row key={i}>{ row }</Table.Row>);
  return (
    <Table.Body>
      { rows }
    </Table.Body>
  );
}

YearPickerCell.propTypes = {
  /** (event, data) => {} */
  onClick: PropTypes.func.isRequired,
  year: PropTypes.string.isRequired
};

YearPickerComponent.propTypes = {
  /** (event, data) => {} */
  onYearClick: PropTypes.func.isRequired,
  activeYear: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  yearsStart: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isDateDisabled: PropTypes.func,
};

export default YearPickerComponent;
export {
  YearPickerComponent,
  getYears
};
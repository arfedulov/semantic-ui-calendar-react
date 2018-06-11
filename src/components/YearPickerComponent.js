import React from 'react';
import PropTypes from 'prop-types';
import { getUnhandledProps } from '../lib';
import { Table } from 'semantic-ui-react';
import _ from 'lodash';

/** Return array of 12 years as strings 'YYYY'.
 * @param {number} yearsStart */
const getYears = (yearsStart) => {
  const years = new Array(12);
  return _.fill(years, yearsStart).map((year, i) => (year + i).toString());
};

function YearPickerCell(props) {
  const { 
    onClick,
    year
  } = props;
  const rest = getUnhandledProps(YearPickerCell, props);

  const onYearClick = (event) => {
    event.stopPropagation();
    onClick(event, { ...props, value: year});
  };
   
  return (
    <Table.Cell
      { ...rest }
      onClick={onYearClick}
      className="suir-calendar date"
      textAlign="center">
      { year }
    </Table.Cell>
  );
}

function YearPickerComponent(props) {
  const { 
    onYearClick,
    activeYear,
    yearsStart
  } = props;

  const cellStyle = {
    width: '33.333333%',
    minWidth: '7em'
  };
  const years = getYears(yearsStart).map((year) => (
    <YearPickerCell
      style={cellStyle}
      onClick={onYearClick}
      active={year === activeYear.toString()}
      year={year}
      key={year} />
  ));
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
  yearsStart: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default YearPickerComponent;
export {
  YearPickerComponent,
  getYears
};
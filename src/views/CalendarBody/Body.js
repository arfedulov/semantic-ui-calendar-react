import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Cell from './Cell';

const cellStyleWidth3 = {
  width: '33.333333%',
  minWidth: '7em'
};

const cellStyleWidth4 = {
  width: '25%'
};

const cellStyleWidth7 = {
  width: '14.285714%'
};

function buildRows(data/*array*/, width/*number*/) {
  const height = data.length / width;
  const rows = [];
  for (let i = 0; i < height; i++) {
    rows.push(data.slice((i * width), (i * width) + width));
  }
  return rows;
}

function isActive(rowIndex, rowWidth, colIndex, active) {
  if (_.isNil(active)) return false;
  if (_.isArray(active)) {
    for (let i = 0; i < active.length; i++) {
      if (rowIndex * rowWidth + colIndex === active[i]) return true;
    }
  }
  return rowIndex * rowWidth + colIndex === active;
}

function isHovered(rowIndex, rowWidth, colIndex, hovered) {
  if (_.isNil(hovered)) return false;
  return rowIndex * rowWidth + colIndex === hovered;
}

function isDisabled(rowIndex, rowWidth, colIndex, disabledIndexes) {
  if (_.isNil(disabledIndexes) || disabledIndexes.length === 0) return false;
  for (let i = 0; i < disabledIndexes.length; i++) {
    if (rowIndex * rowWidth + colIndex === disabledIndexes[i]) return true;
  }
  return false;
}

function getCellStyle(width) {
  if (width === '3') {
    return cellStyleWidth3;
  }
  if (width === '4') {
    return cellStyleWidth4;
  }
  if (width === '7') {
    return cellStyleWidth7;
  }
  return;
}

function Body(props) {
  const {
    data,
    width,
    onCellClick,
    active,
    disabled,
    hovered,
    onCellHover,
  } = props;
  const content = buildRows(data, parseInt(width)).map((row, rowIndex) => (
    <Table.Row key={`${rowIndex}${row[0]}`}>
      { row.map((item, itemIndex) => (
        <Cell
          style={getCellStyle(width)}
          active={isActive(rowIndex, parseInt(width), itemIndex, active)}
          hovered={isHovered(rowIndex, parseInt(width), itemIndex, hovered)}
          disabled={isDisabled(rowIndex, parseInt(width), itemIndex, disabled)}
          key={`${rowIndex * width + itemIndex}`}
          itemPosition={rowIndex * width + itemIndex}
          content={item}
          onHover={onCellHover}
          onClick={onCellClick} />
      )) }
    </Table.Row>
  ));
  return (
    <Table.Body>
      { content }
    </Table.Body>
  );
}

Body.propTypes = {
  /** A number of columns in a row. */
  width: PropTypes.oneOf(
    ['3', '4', '7']
  ).isRequired,
  /** Data that is used to fill a calendar. */
  data: PropTypes.oneOfType(
    [
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.arrayOf(PropTypes.number),
    ]
  ).isRequired,
  /** Called after a click on calendar's cell. */
  onCellClick: PropTypes.func,
  onCellHover: PropTypes.func,
  /** Index of an element in `data` array that should be displayed as hovered. */
  hovered: PropTypes.number,
  /** Index of an element (or array of indexes) in `data` array that should be displayed as active. */
  active: PropTypes.oneOfType(
    [
      PropTypes.number,
      PropTypes.arrayOf(PropTypes.number),
    ]
  ),
  /** Array of element indexes in `data` array that should be displayed as disabled. */
  disabled: PropTypes.arrayOf(PropTypes.number),
};

export default Body;

import isNil from 'lodash/isNil';
import isArray from 'lodash/isArray';

import * as React from 'react';
import { Table } from 'semantic-ui-react';

import { OnValueClickData } from '../BaseCalendarView';
import Cell from './Cell';
import {
  cellStyleWidth3,
  cellStyleWidth4,
  cellStyleWidth7,
  CellWidthStyle,
} from './Cell';

export type BodyWidth = 3 | 4 | 7;

interface BodyProps {
  /** A number of columns in a row. */
  width: BodyWidth;
  /** Data that is used to fill a calendar. */
  data: string[];
  /** Called after a click on calendar's cell. */
  onCellClick: (e: React.SyntheticEvent<HTMLElement>, data: OnValueClickData) => void;
  /** Called on cell hover. */
  onCellHover: (e: React.SyntheticEvent<HTMLElement>, data: any) => void;
  /** Index of an element in `data` array that should be displayed as hovered. */
  hovered?: number;
  /** Index of an element (or array of indexes) in `data` array that should be displayed as active. */
  active?: number | number[];
  /** Array of element indexes in `data` array that should be displayed as disabled. */
  disabled?: number[];
  /** Array of element indexes in `data` array that should be displayed as marked. */
  marked?: number[];
  /** The color of the mark that will be displayed on the calendar. */
  markColor?: string;
}

function Body(props: BodyProps) {
  const {
    data,
    width,
    onCellClick,
    active,
    disabled,
    hovered,
    onCellHover,
    marked,
    markColor,
  } = props;
  const content = buildRows(data, width).map((row, rowIndex) => (
    <Table.Row key={`${rowIndex}${row[0]}`}>
      { row.map((item, itemIndex) => (
        <Cell
          style={getCellStyle(width)}
          active={isActive(rowIndex, width, itemIndex, active)}
          hovered={isHovered(rowIndex, width, itemIndex, hovered)}
          disabled={isDisabled(rowIndex, width, itemIndex, disabled)}
          marked={isMarked(rowIndex, width, itemIndex, marked)}
          markColor={markColor}
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

function buildRows(data: string[], width: number): string[][] {
  const height = data.length / width;
  const rows = [];
  for (let i = 0; i < height; i++) {
    rows.push(data.slice((i * width), (i * width) + width));
  }

  return rows;
}

function isActive(rowIndex: number,
                  rowWidth: number,
                  colIndex: number,
                  active: number | number[]): boolean {
  if (isNil(active)) {
    return false;
  }
  if (isArray(active)) {
    for (const activeIndex of (active as number[])) {
      if (rowIndex * rowWidth + colIndex === activeIndex) {
        return true;
      }
    }
  }

  return rowIndex * rowWidth + colIndex === active;
}

function isHovered(rowIndex: number,
                   rowWidth: number,
                   colIndex: number,
                   hovered: number): boolean {
  if (isNil(hovered)) {
    return false;
  }

  return rowIndex * rowWidth + colIndex === hovered;
}

function isDisabled(rowIndex: number,
                    rowWidth: number,
                    colIndex: number,
                    disabledIndexes: number[]): boolean {
  if (isNil(disabledIndexes) || disabledIndexes.length === 0) {
    return false;
  }
  for (const disabledIndex of disabledIndexes) {
    if (rowIndex * rowWidth + colIndex === disabledIndex) {
      return true;
    }
  }

  return false;
}

function getCellStyle(width: BodyWidth): CellWidthStyle {
  switch (width) {
    case 3:
      return cellStyleWidth3;
    case 4:
      return cellStyleWidth4;
    case 7:
      return cellStyleWidth7;
    default:
      break;
  }
}

function isMarked(rowIndex: number,
                  rowWidth: number,
                  colIndex: number,
                  markedIndexes: number[]): boolean {
  if (isNil(markedIndexes) || markedIndexes.length === 0) {
    return false;
  }
  for (const markedIndex of markedIndexes) {
    if (rowIndex * rowWidth + colIndex === markedIndex) {
      return true;
    }
  }

  return false;
}

export default Body;

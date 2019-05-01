import invoke from 'lodash/invoke';

import * as React from 'react';
import { Table, Label } from 'semantic-ui-react';

import { OnValueClickData } from '../BaseCalendarView';

const hoverCellStyles = {
  outline: '1px solid #85b7d9',
  cursor: 'pointer',
};

export interface CellWidthStyle {
  width: string;
}

export const cellStyleWidth3: CellWidthStyle = {
  width: '33.333333%',
};

export const cellStyleWidth4: CellWidthStyle = {
  width: '25%',
};

export const cellStyleWidth7: CellWidthStyle = {
  width: '14.285714%',
};

interface CellProps {
  /** Position of a cell on the page. (Used by parent component) */
  itemPosition: number;
  /** Cell's content. */
  content: string;
  /** Styles for cell width. */
  style: CellWidthStyle;
  /** Called after click on a cell. */
  onClick: (e: React.SyntheticEvent<HTMLElement>, data: OnValueClickData) => void;
  /** Called on cell hover. */
  onHover: (e: React.SyntheticEvent<HTMLElement>, data: OnValueClickData) => void;
  /** Is cell is hovered. */
  hovered?: boolean;
  /** Is cell active. */
  active?: boolean;
  /** Is cell disabled. */
  disabled?: boolean;
  /** Is cell marked. */
  marked?: boolean;
  /** Color of the mark. */
  markColor?: any;
}

class Cell extends React.Component<CellProps, any> {
  public render() {
    const {
      itemPosition,
      content,
      style,
      onClick,
      onHover,
      hovered,
      marked,
      markColor,
      ...rest
    } = this.props;

    const cellStyle = {
      ...style,
      ...(hovered ? hoverCellStyles : {}),
    };

    return (
      <Table.Cell
        { ...rest }
        style={cellStyle}
        onMouseOver={this.onCellHover}
        onClick={this.onCellClick}>
        { (marked && !rest.disabled) ? <Label circular color={markColor} key={content}>{content}</Label>
          : <span className = 'suicr-content-item'>{content}</span> }
      </Table.Cell>
    );
  }

  private onCellClick = (event) => {
    const {
      itemPosition,
      content,
    } = this.props;
    invoke(this.props, 'onClick', event, { ...this.props, itemPosition, value: content });
  }

  private onCellHover = (event) => {
    const {
      itemPosition,
    } = this.props;
    invoke(this.props, 'onHover', event, { ...this.props, itemPosition });
  }
}

export default Cell;

import * as _ from 'lodash';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { Table } from 'semantic-ui-react';

const hoverCellStyles = {
  outline: '1px solid #85b7d9',
  cursor: 'pointer',
};

export interface CellWidthStyle {
  width: string;
  minWidth?: string;
}

export const cellStyleWidth3: CellWidthStyle = {
  width: '33.333333%',
  minWidth: '7em',
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
  onClick: (e: React.SyntheticEvent, data: any) => void;
  /** Called on cell hover. */
  onHover: (e: React.SyntheticEvent, data: any) => void;
  /** Is cell is hovered. */
  hovered?: boolean;
  /** Is cell active. */
  active?: boolean;
  /** Is cell disabled. */
  disabled?: boolean;
}

class Cell extends React.Component<CellProps, any> {
  public static propTypes: object;

  public render() {
    const {
      content,
      style,
      onClick,
      onHover,
      hovered,
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
        { content }
      </Table.Cell>
    );
  }

  private onCellClick = (event) => {
    const {
      itemPosition,
      content,
    } = this.props;
    _.invoke(this.props, 'onClick', event, { ...this.props, itemPosition, value: content });
  }

  private onCellHover = (event) => {
    const {
      itemPosition,
    } = this.props;
    _.invoke(this.props, 'onHover', event, { ...this.props, itemPosition });
  }
}

Cell.propTypes = {
  /** Position of a cell on the page. */
  itemPosition: PropTypes.number.isRequired,
  /** Cell's content. */
  content: PropTypes.string.isRequired,
  /** Styles for cell width. */
  style: PropTypes.object.isRequired,
  /** Called after click on a cell. */
  onClick: PropTypes.func,
  /** Called on cell hover. */
  onHover: PropTypes.func,
  /** Is cell is hovered. */
  hovered: PropTypes.bool,
  /** Is cell active. */
  active: PropTypes.bool,
  /** Is cell disabled. */
  disabled: PropTypes.bool,
};

export default Cell;

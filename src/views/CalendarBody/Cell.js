import * as React from 'react';
import { Table } from 'semantic-ui-react';
import * as PropTypes from 'prop-types';
import * as _ from 'lodash';

import { getUnhandledProps } from '../../lib';

const hoverCellStyles = {
  outline: '1px solid #85b7d9',
  cursor: 'pointer',
};

class Cell extends React.Component {

  toggleHoverCell = () => {
    this.setState((prevState) => {
      return { hoverCell: !prevState.hoverCell };
    });
  }

  onCellClick = (event) => {
    _.invoke(this.props, 'onClick', event, { ...this.props, value: this.props.content });
  }

  onCellHover = (event) => {
    _.invoke(this.props, 'onHover', event, { ...this.props });
  }

  render() {
    const rest = getUnhandledProps(Cell, this.props);
    const style = { 
      ...this.props.style,
      ...(this.props.hovered? hoverCellStyles : undefined),
    };
    return (
      <Table.Cell
        { ...rest }
        style={style}
        onMouseOver={this.onCellHover}
        onClick={this.onCellClick}>
        { this.props.content }
      </Table.Cell>
    );
  }
}

Cell.propTypes = {
  /** Position of a cell on the page. */
  itemPosition: PropTypes.number.isRequired,
  /** Cell's content. */
  content: PropTypes.oneOfType(
    [
      PropTypes.number,
      PropTypes.string,
    ]
  ).isRequired,
  /** Called after click on a cell. */
  onClick: PropTypes.func,
  onHover: PropTypes.func,
  hovered: PropTypes.bool,
  style: PropTypes.object,
};

export default Cell;
export {
  Cell
};
import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { getUnhandledProps } from '../../lib';

const hoverCellStyles = {
  outline: '1px solid #85b7d9',
  cursor: 'pointer',
};

class Cell extends React.Component {
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
    _.invoke(this.props, 'onClick', event, { ...this.props, value: this.props.content });
  }

  render() {
    const rest = getUnhandledProps(Cell, this.props);
    const style = { 
      ...this.props.style,
      ...(this.state.hoverCell? hoverCellStyles : undefined),
    };
    return (
      <Table.Cell
        { ...rest }
        style={style}
        onMouseOver={this.toggleHoverCell}
        onMouseLeave={this.toggleHoverCell}
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
  style: PropTypes.object,
};

export default Cell;
export {
  Cell
};
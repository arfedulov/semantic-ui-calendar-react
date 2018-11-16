import React from 'react';

class BasePicker extends React.Component {

  componentDidMount() {
    this.setState({
      hoveredCellPosition: (this.getActiveCellPosition
        && this.getActiveCellPosition())
        || this.getInitialDatePosition()
    });
  }

  onHoveredCellPositionChange = (e, { itemPosition }) => {
    this.setState({
      hoveredCellPosition: itemPosition,
    });
  }
}

export default BasePicker;

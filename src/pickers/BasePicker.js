import React from 'react';
import keyboardKey from 'keyboard-key';
import _ from 'lodash';

class BasePicker extends React.Component {

  componentDidMount() {
    this.setState({
      hoveredCellPosition: (this.getActiveCellPosition
        && this.getActiveCellPosition())
        || this.getInitialDatePosition()
    });
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  onHoveredCellPositionChange = (e, { itemPosition }) => {
    this.setState({
      hoveredCellPosition: itemPosition,
    });
  }

  canCalendarCatchKeyboardEvents = () => {
    if (this.props.inline) {
      return this.props.isPickerInFocus();
    }
    return this.props.isTriggerInFocus();
  }

  handleKeyPress = (event) => {
    if (!this.canCalendarCatchKeyboardEvents()) {
      return;
    }
    const key = keyboardKey.getKey(event);
    switch(key) {
    case 'Enter':
      this.handleEnterKeyPress(event);
      break;
    default:
      this.handleArrowKeyPress(event);
    }
  }

  handleEnterKeyPress = (event) => {
    const key = keyboardKey.getKey(event);
    if (key === 'Enter' && this.canCalendarCatchKeyboardEvents()) {
      event.preventDefault();
      const selectedValue = this.buildCalendarValues()[this.state.hoveredCellPosition];
      this.handleChange(null, {
        value: selectedValue,
        itemPosition: this.state.hoveredCellPosition,
      });
    }
  }

  handleBlur = () => {
    this.props.closePopup && this.props.closePopup();
  }

  handleArrowKeyPress = (event) => {
    if (!this.canCalendarCatchKeyboardEvents()) {
      return;
    }
    const key = keyboardKey.getKey(event);
    const selectableCells = this.getSelectableCellPositions();
    const nextSelectableCellPositionLeft = selectableCells.slice(0, selectableCells.indexOf(this.state.hoveredCellPosition)).pop();
    const nextSelectableCellPositionRight = selectableCells.slice(selectableCells.indexOf(this.state.hoveredCellPosition) + 1)[0];
    switch(key) {
    case 'ArrowLeft':
      event.preventDefault();
      if (nextSelectableCellPositionLeft) {
        this.onHoveredCellPositionChange(null, { itemPosition: nextSelectableCellPositionLeft });
      } else {
        this.isPrevPageAvailable() && this.switchToPrevPage(null, null, () => {
          const selectableCells = this.getSelectableCellPositions();
          this.onHoveredCellPositionChange(null, { itemPosition: selectableCells[selectableCells.length - 1] });
        });
      }
      break;
    case 'ArrowRight':
      event.preventDefault();
      if (nextSelectableCellPositionRight) {
        this.onHoveredCellPositionChange(null, { itemPosition: nextSelectableCellPositionRight });
      } else {
        this.isNextPageAvailable() && this.switchToNextPage(null, null, () => {
          const selectableCells = this.getSelectableCellPositions();
          this.onHoveredCellPositionChange(null, { itemPosition: selectableCells[0] });
        });
      }
      break;
    case 'ArrowUp':
      event.preventDefault();
      if (_.includes(selectableCells, this.state.hoveredCellPosition - this.PAGE_WIDTH)) {
        this.onHoveredCellPositionChange(null, { itemPosition: this.state.hoveredCellPosition - this.PAGE_WIDTH });
      }
      break;
    case 'ArrowDown':
      event.preventDefault();
      if (_.includes(selectableCells, this.state.hoveredCellPosition + this.PAGE_WIDTH)) {
        this.onHoveredCellPositionChange(null, { itemPosition: this.state.hoveredCellPosition + this.PAGE_WIDTH });
      }
      break;
    default:
      break;
    }
  }
}

export default BasePicker;

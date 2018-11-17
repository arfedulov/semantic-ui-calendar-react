import React from 'react';

class BaseInput extends React.Component {
  closePopup = () => {
    this.setState({ popupIsClosed: true }, this.onPopupClose);
  }

  onPopupClose = () => {
    // When `closable` prop is true on *Input element
    // `this.closePopup` is invoked after selection complete.
    // To allow popup to be opened again we need to set
    // `popupIsClosed` to false
    // Also `this.closePopup` is used when we force popup to close on blur
    // when using Tab navigation
    this.setState({
      popupIsClosed: false,
    });
  }

  isPickerInFocus = () => {
    return document.activeElement === this.calendarNode;
  }

  onModeSwitch = () => {
    // when using keyboard for selecting values on calendar
    // and when mode switches, picker looses focus.
    // In order to preserve focus on active picker
    // we call focus() on `calendarNode`.
    // `calendarNode` goes from *View component via
    // `this.onViewMount` callback
    if (!this.isPickerInFocus()) {
      this.calendarNode && this.calendarNode.focus();
    }
  }

  onViewMount = (calendarNode) => {
    this.calendarNode = calendarNode;
  }
}

export default BaseInput;

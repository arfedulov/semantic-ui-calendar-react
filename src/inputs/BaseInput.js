import * as React from 'react';

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

  isTriggerInFocus = () => {
    return document.activeElement === this.inputNode;
  }

  onModeSwitch = () => {
    // when using keyboard for selecting values on inline calendar
    // and when mode switches, picker looses focus.
    // In order to preserve focus on active picker
    // we call focus() on `calendarNode`.
    // `calendarNode` goes from *View component via
    // `this.onCalendarViewMount` callback
    if (this.props.inline && !this.isPickerInFocus()) {
      this.calendarNode && this.calendarNode.focus();
    }
  }

  onCalendarViewMount = (calendarNode) => {
    this.calendarNode = calendarNode;
  }

  onInputViewMount = (inputNode) => {
    this.inputNode = inputNode;
  }
}

export default BaseInput;

import React from 'react';

class BaseInput extends React.Component {
  closePopup() {
    this.setState({ popupIsClosed: true });
  }

  onPopupClose = () => {
    // When `closable` prop is true on *Input element
    // `this.closePopup` is invoked after selection complete.
    // To allow popup to be opened again we need to set
    // `popupIsClosed` to false
    this.setState({
      popupIsClosed: false,
    });
  }
}

export default BaseInput;

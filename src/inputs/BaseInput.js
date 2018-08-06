import React from 'react';

class BaseInput extends React.Component {
  closePopup() {
    this.setState({ popupIsClosed: true });
  }

  onPopupClose = () => {
    this.setState({
      popupIsClosed: false,
    });
  }
}

export default BaseInput;

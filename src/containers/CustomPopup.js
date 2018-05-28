import React from 'react';
import { Popup } from 'semantic-ui-react';
import keyboardKey from 'keyboard-key';

class CustomPopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popupIsOpen: false
    };
  }

  handleOpen = () => {
    this.setState({popupIsOpen: true});
    setTimeout(() => {
      this.popupCoords = document.getElementById('suirCalendarPopup').getBoundingClientRect();
    }, 0);
  }

  handleClose = (e) => {
    const clickCoords = { x: e.clientX, y: e.clientY};
    if (this.shouldClosePopup(this.popupCoords, clickCoords) || keyboardKey.getCode(e) === keyboardKey.Escape) {
      this.setState({ popupIsOpen: false});
    }
  }

  shouldClosePopup = (popupCoords, clickCoords) => {
    const { x, y, width, height } = popupCoords;
    return clickCoords.x < x ||
           clickCoords.y < y ||
           clickCoords.x > x + width ||
           clickCoords.y > y + height;
  }

  render() {
    return (
      <Popup
        { ...this.props }
        id="suirCalendarPopup"
        onOpen={this.handleOpen}
        onClose={this.handleClose}
        open={this.state.popupIsOpen} />
    );
  }
}

export default CustomPopup;
export {
  CustomPopup
};
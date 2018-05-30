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
    if (this.shouldClosePopup(e)) this.setState({ popupIsOpen: false});
  }

  shouldClosePopup = (e) => {
    const clickCoords = { x: e.clientX, y: e.clientY};
    const { left, top, width, height } = this.popupCoords;
    const esc = keyboardKey.getCode(e) === keyboardKey.Escape;
    const clickOutsidePopup = clickCoords.x < left ||
                             clickCoords.y < top ||
                             clickCoords.x > left + width ||
                             clickCoords.y > top + height;
    const scroll = e.type === 'scroll';
    return clickOutsidePopup || esc || scroll;
  }

  render() {
    return (
      <Popup
        { ...this.props }
        id="suirCalendarPopup"
        hideOnScroll
        on="click"
        className="suir-calendar popup"
        hoverable
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
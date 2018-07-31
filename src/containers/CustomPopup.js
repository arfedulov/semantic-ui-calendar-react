import React from 'react';
import { Popup } from 'semantic-ui-react';

const popupStyle = {
  padding: '0',
};

function CustomPopup(props) {
  return (
    <Popup
      { ...props }
      flowing
      style={popupStyle}
      hideOnScroll
      on="click" />
  );
}

export default CustomPopup;
export {
  CustomPopup
};
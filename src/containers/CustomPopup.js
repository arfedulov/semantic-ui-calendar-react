import React from 'react';
import { Popup } from 'semantic-ui-react';

function CustomPopup(props) {
  return (
    <Popup
      { ...props }
      flowing
      // id="suirCalendarPopup"
      hideOnScroll
      on="click"
      className="suir-calendar popup"/>
  );
}

export default CustomPopup;
export {
  CustomPopup
};
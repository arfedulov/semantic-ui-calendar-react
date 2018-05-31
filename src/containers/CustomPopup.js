import React from 'react';
import { Popup } from 'semantic-ui-react';

function CustomPopup(props) {
  return (
    <Popup
      { ...props }
      id="suirCalendarPopup"
      hideOnScroll
      on="click"
      className="suir-calendar popup"
      hoverable />
  );
}

export default CustomPopup;
export {
  CustomPopup
};
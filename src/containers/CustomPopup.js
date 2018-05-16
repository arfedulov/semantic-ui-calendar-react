import { Popup } from 'semantic-ui-react';

class CustomPopup extends Popup {
  constructor(props) {
    super(props);
  }

  getPortalProps = () => {
    const portalProps = Popup.prototype.getPortalProps.call(this, arguments);
    if (portalProps.closeOnDocumentClick) {
      portalProps.closeOnDocumentClick = false;
    }
    return portalProps;
  }
}

export default CustomPopup;
export {
  CustomPopup
};
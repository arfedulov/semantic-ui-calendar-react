import React from 'react';
import PropTypes from 'prop-types';
import { Popup, Form } from 'semantic-ui-react';

import { getUnhandledProps } from '../lib';

const popupStyle = {
  padding: '0',
  filter: 'none', // prevents bluring popup when used inside Modal with dimmer="bluring" #28 #26
};

class InputView extends React.Component {

  render() {
    const {
      popupPosition,
      inline,
      value,
      closeOnMouseLeave,
      onChange,
      inlineLabel,
      popupIsClosed,
      mountNode,
      tabIndex,
    } = this.props;
    const rest = getUnhandledProps(InputView, this.props);
  
    const inputElement = (
      <Form.Input
        { ...rest }
        value={value}
        tabIndex={parseInt(tabIndex) + 1} // +1 makes possible to focus calendar inside a popup via Tab
        inline={inlineLabel}
        onChange={onChange} />
    );
  
    if (inline) return this.props.render({
      tabIndex,
    });
    return (
      <Popup
        position={popupPosition}
        open={popupIsClosed? false : undefined}
        trigger={inputElement}
        hoverable={closeOnMouseLeave}
        flowing
        mountNode={mountNode}
        style={popupStyle}
        hideOnScroll
        on="focus"
      >
        {
          this.props.render({
            tabIndex: parseInt(tabIndex) + 1, // +1 makes possible to focus calendar inside a popup via Tab
          })
        }
      </Popup>
    );
  }
}

InputView.propTypes = {
  render: PropTypes.func.isRequired,
  /** Whether to display inline picker or picker inside a popup. */
  inline: PropTypes.bool,
  /** Where to display popup. */
  popupPosition: PropTypes.string,
  /** Currently selected value. */
  value: PropTypes.string,
  /** Whether to close a popup when cursor leaves it. */
  closeOnMouseLeave: PropTypes.bool,
  /** Called after input field value has changed. */
  onChange: PropTypes.func,
  /** Picker. */
  children: PropTypes.node,
  /** A field can have its label next to instead of above it. */
  inlineLabel: PropTypes.bool,
  /** Whether popup is closed. */
  popupIsClosed: PropTypes.bool,
  /** The node where the picker should mount. */
  mountNode: PropTypes.any,
  tabIndex: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

InputView.defaultProps = {
  inline: false,
  closeOnMouseLeave: true,
  tabIndex: '0',
};

export default InputView;

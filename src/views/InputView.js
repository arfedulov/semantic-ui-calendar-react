import React from 'react';
import PropTypes from 'prop-types';
import { Popup, Form } from 'semantic-ui-react';

import { getUnhandledProps } from '../lib';

const popupStyle = {
  padding: '0',
};

function InputView(props) {
  const {
    popupPosition,
    inline,
    value,
    closeOnMouseLeave,
    onChange,
    inlineLabel,
    popupIsClosed,
    onPopupUnmount,
    mountNode,
  } = props;
  const rest = getUnhandledProps(InputView, props);

  const inputElement = (
    <Form.Input
      { ...rest }
      value={value}
      inline={inlineLabel}
      onChange={onChange} />
  );

  if (inline) return props.children;
  return (
    <Popup
      position={popupPosition}
      open={popupIsClosed? false : undefined}
      trigger={inputElement}
      hoverable={closeOnMouseLeave}
      flowing
      mountNode={mountNode}
      onUnmount={onPopupUnmount}
      style={popupStyle}
      hideOnScroll
      on="click"
    >
      { props.children }
    </Popup>
  );
}

InputView.propTypes = {
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
  /** Called when popup is forsed to close. */
  onPopupUnmount: PropTypes.func,
  /** The node where the picker should mount. */
  mountNode: PropTypes.any,
};

InputView.defaultProps = {
  inline: false,
  closeOnMouseLeave: true
};

export default InputView;

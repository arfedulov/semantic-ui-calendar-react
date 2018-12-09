import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as PropTypes from 'prop-types';
import { Popup, Form } from 'semantic-ui-react';

import { getUnhandledProps } from '../lib';

const popupStyle = {
  padding: '0',
  filter: 'none', // prevents bluring popup when used inside Modal with dimmer="bluring" #28 #26
};

class FormInputWithRef extends React.Component {
  render() {
    return (
      <Form.Input { ...this.props }/>
    );
  }
}

class InputView extends React.Component {
  componentDidMount() {
    this.props.onMount && this.props.onMount(this.inputNode);
    this.initialInputNode = this.inputNode;
  }

  componentDidUpdate() {
    // TODO: find actual root of the problem.
    // Sometimes input node reference passed
    // to this.props.onMount stales.
    // this.inputNode referes to
    // different DOM object than it was after first
    // component render.
    // InputView component doesn't unmount it just
    // gets different underlying input node.
    // In order to keep input node reference fresh
    // we make this check.
    if (this.inputNode !== this.initialInputNode) {
      this.initialInputNode = this.inputNode;
      this.props.onMount(this.inputNode);
    }
  }

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
      <FormInputWithRef
        { ...rest }
        ref={e => {
          const node = ReactDOM.findDOMNode(e);
          this.inputNode = node && node.querySelector('input');
        }}
        value={value}
        tabIndex={tabIndex}
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
            tabIndex: -1,
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
  onMount: PropTypes.func,
};

InputView.defaultProps = {
  inline: false,
  closeOnMouseLeave: true,
  tabIndex: '0',
};

export default InputView;

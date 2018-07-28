import React from 'react';
import { Form } from 'semantic-ui-react';
import { dispatchDateChange } from '../lib/events.js';
import { getUnhandledProps } from '../lib';
import PropTypes from 'prop-types';

class CustomInput extends React.Component {
  static propTypes = {
    inlineLabel: PropTypes.bool
  }

  static defaultProps = {
    inlineLabel: false
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) dispatchDateChange();
  }

  render() {
    const rest = getUnhandledProps(CustomInput, this.props);
    return (
      <Form.Input
        inline={this.props.inlineLabel}
        { ...rest } />
    );
  }
}

export default CustomInput;
export {
  CustomInput
};
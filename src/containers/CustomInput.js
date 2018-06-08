import React from 'react';
import { Input } from 'semantic-ui-react';
import { dispatchDateChange } from '../lib/events.js';

class CustomInput extends React.Component {
  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) dispatchDateChange();
  }

  render() {
    return <Input { ...this.props } />;
  }
}

export default CustomInput;
export {
  CustomInput
};
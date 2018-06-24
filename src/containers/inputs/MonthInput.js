import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Input, Table } from 'semantic-ui-react';

import { CustomPopup as Popup } from '..';
import { getUnhandledProps } from '../../lib';
import {
  MONTH_INPUT
} from '../../lib/COMPONENT_TYPES.js';
import { MonthPickerComponent } from '../../components';
import { CustomPropTypes } from '../../lib/customPropTypes';

class MonthInput extends React.Component {
  constructor(props) {
    super(props);
  }

  static META = {
    type: MONTH_INPUT,
    name: 'MonthInput'
  }

  componentDidMount() {
    this.inputNode = ReactDOM.findDOMNode(this).querySelector('input');
  }

  onMonthClick = (event, data) => {
    this.setState({ activeMonth: data.value });
    this.onMonthUpdate(event, data);
    // close popup if closable
    if (this.props.closable) this.inputNode.click();
  }

  onMonthUpdate = (event, data) => {
    _.invoke(this.props, 'onChange', event, { ...this.props, value: data.value });
  };

  getPicker() {
    return (
      <Table
        unstackable
        celled
        textAlign="center">
        <MonthPickerComponent
          onMonthClick={this.onMonthClick}
          activeMonth={this.props.value} />
      </Table>
    );
  }

  render() {
    const {
      onChange,
      icon,
      popupPosition,
      inline,
      value
    } = this.props;
    
    const rest = getUnhandledProps(MonthInput, this.props);
  
    const inputElement = (
      <Input
        { ...rest }
        value={value}
        icon={icon}
        onChange={onChange} />
    );
    if (inline) {
      return this.getPicker();
    }
    return (
      <Popup
        position={popupPosition}
        trigger={inputElement}>
        { this.getPicker() }
      </Popup>
    );
  }
}

MonthInput.propTypes = {
  /** Called on change.
   * @param {SyntheticEvent} event React's original SyntheticEvent.
   * @param {object} data All props and proposed value.
  */
  onChange: PropTypes.func,
  /** Same as semantic-ui-react Input's ``icon`` prop. */
  icon: PropTypes.any,
  popupPosition: CustomPropTypes.popupPosition,
  inline: PropTypes.bool,
  value: PropTypes.string,
  /* If true, popup closes after selecting a date/time */
  closable: PropTypes.bool
};

MonthInput.defaultProps = {
  icon: 'calendar',
  inline: false,
  value: '',
  closable: false
};

export default MonthInput;
export {
  MonthInput
};
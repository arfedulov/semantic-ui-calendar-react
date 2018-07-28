import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';
import { Table } from 'semantic-ui-react';

import {
  CustomPopup as Popup,
  CustomInput as Input,
  YearPickerMixin
} from '..';
import { getUnhandledProps } from '../../lib';
import { YEAR_INPUT } from '../../lib/COMPONENT_TYPES';
import { PickerHeader, YearPickerComponent } from '../../components';
import { CustomPropTypes } from '../../lib/customPropTypes';

class YearInput extends YearPickerMixin {
  static META = {
    type: YEAR_INPUT,
    name: 'YearInput'
  }

  constructor(props) {
    super(props);

    this.state = {
      yearsStart: moment().year() - 6
    };
  }

  componentDidMount() {
    this.inputNode = ReactDOM.findDOMNode(this).querySelector('input');
  }

  onYearClick = (event, data) => {
    this.setState({ activeYear: data.value });
    this.onYearChange(event, data);
    // close popup if closable
    if (this.props.closable) this.inputNode.click();
  }

  getPicker() {
    const yearsRange = this.getYearsRange();
    return (
      <Table
        unstackable
        celled
        textAlign="center">
        <PickerHeader
          width="3"
          activeYears={yearsRange}
          onPrevBtnClick={this.onPrevBtnClick}
          onNextBtnClick={this.onNextBtnClick} />
        <YearPickerComponent
          onYearClick={this.onYearClick}
          activeYear={this.props.value}
          yearsStart={yearsRange.start} />
      </Table>
    );
  }

  onYearChange = (event, data) => {
    _.invoke(this.props, 'onChange', event, { ...this.props, value: data.value });
  }

  render() {
    const {
      onChange,
      icon,
      popupPosition,
      inline,
      value
    } = this.props;
    const rest = getUnhandledProps(YearInput, this.props);
  
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

YearInput.propTypes = {
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

YearInput.defaultProps = {
  icon: 'calendar',
  inline: false,
  value: '',
  closable: false
};

export default YearInput;
export {
  YearInput
};
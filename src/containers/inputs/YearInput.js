import React from 'react';
import { Input, Table } from 'semantic-ui-react';
import { CustomPopup as Popup } from '../';
import PropTypes from 'prop-types';
import { getUnhandledProps } from '../../lib';
import { YEAR_INPUT } from '../../lib/COMPONENT_TYPES';
import moment from 'moment';
import _ from 'lodash';
import { PickerHeader, YearPickerComponent } from '../../components';
import { YearPickerMixin } from '../yearPickerMixin.js';

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

  onYearClick = (event, data) => {
    this.setState({ activeYear: data.value });
    this.onYearChange(event, data);
  }

  getPicker() {
    const yearsRange = this.getYearsRange();
    const rest = getUnhandledProps(YearInput, this.props);
    return (
      <Table
        { ...rest }
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
  popupPosition: PropTypes.oneOf([
    'top left',
    'top right',
    'bottom left',
    'bottom right',
    'right center',
    'left center',
    'top center',
    'bottom center'
  ]),
  inline: PropTypes.bool
};

YearInput.defaultProps = {
  icon: 'calendar',
  inline: false
};

export default YearInput;
export {
  YearInput
};
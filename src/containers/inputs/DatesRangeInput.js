import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { getUnhandledProps } from '../../lib';
import { DATES_RANGE_INPUT } from '../../lib/COMPONENT_TYPES';
import { DatesRangePickerContent } from '../../components/pickerContent/DatesRangePickerContent.js';
import {
  CustomPopup as Popup,
  CustomInput as Input,
  withStateInput
} from '../';

class DatesRangeInput extends React.Component {

  static META = {
    type: DATES_RANGE_INPUT,
    name: 'DatesRangeInput'
  }

  getPicker() {
    const rest = getUnhandledProps(DatesRangeInput, this.props);
    return (
      <Table
        { ...rest }
        unstackable
        celled
        textAlign="center">
        <DatesRangePickerContent
          handleHeaderDateClick={this.props.handleHeaderDateClick}
          showNextMonth={this.props.showNextMonth}
          showPrevMonth={this.props.showPrevMonth}
          dateToShow={this.props.dateToShow}
          datesRange={this.props.datesRange}
          setDatesRange={this.props.setDatesRange} />
      </Table>
    );
  }

  render() {
    const {
      onChange,
      icon,
      dateFormat,
      divider,
      popupPosition,
      inline
    } = this.props;
    
    const rest = getUnhandledProps(DatesRangeInput, this.props);
    const inputElement = (
      <Input
        { ...rest }
        onChange={onChange}
        icon={icon} />
    );
    if (inline) {
      return (
        this.getPicker()
      );
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

DatesRangeInput.propTypes = {
  /** Called on change.
   * @param {SyntheticEvent} event React's original SyntheticEvent.
   * @param {object} data All props and proposed value.
  */
  onChange: PropTypes.func,
  /** Same as semantic-ui-react Input's ``icon`` prop. */
  icon: PropTypes.any,
  /** Date formatting string.
   * Anything that that can be passed to ``moment().format``.
   */
  dateFormat: PropTypes.string,
  /** Character that used to divide dates in string. */
  divider: PropTypes.string,
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

DatesRangeInput.defaultProps = {
  icon: 'calendar',
  inline: false
};

const WrappedDatesRangeInput = withStateInput(DatesRangeInput);

export default WrappedDatesRangeInput;
export {
  WrappedDatesRangeInput as DatesRangeInput
};
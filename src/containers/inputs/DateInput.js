import React from 'react';
import { Table } from 'semantic-ui-react';
import {
  CustomPopup as Popup,
  CustomInput as Input,
  withStateInput,
  YearPickerMixin
} from '../';
import PropTypes from 'prop-types';
import { getUnhandledProps } from '../../lib';
import {
  DATE_INPUT
} from '../../lib/COMPONENT_TYPES.js';
import { DatePickerContent } from '../../components/pickerContent/DatePickerContent.js';

class DateInput extends YearPickerMixin {

  static META = {
    type: DATE_INPUT,
    name: 'DateInput'
  }

  constructor(props) {
    super(props);

    this.state = {
      yearsStart: props.dateToShow.year() - 6
    };
  }

  getPicker() {
    const rest = getUnhandledProps(DateInput, this.props);
    return (
      <Table
        { ...rest }
        unstackable
        celled
        textAlign="center">
        <DatePickerContent
          mode={this.props.mode}
          handleHeaderDateClick={this.props.handleHeaderDateClick}
          onYearChange={this.props.onYearChange}
          showNextYear={this.props.showNextYear}
          showPrevYear={this.props.showPrevYear}
          dateToShow={this.props.dateToShow}
          onMonthChange={this.props.onMonthChange}
          showNextMonth={this.props.showNextMonth}
          showPrevMonth={this.props.showPrevMonth}
          onDateClick={this.props.onDateClick}
          activeDate={this.props.activeDate}
          yearsRange={this.getYearsRange()}
          onPrevBtnClick={this.onPrevBtnClick}
          onNextBtnClick={this.onNextBtnClick} />
      </Table>
    );
  }

  render() {
    const {
      icon,
      dateFormat,
      startMode,
      popupPosition,
      inline,
      value
    } = this.props;
    const rest = getUnhandledProps(DateInput, this.props);
    const inputElement = (
      <Input
        { ...rest }
        value={value}
        onChange={this.props.onDateChange}
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

DateInput.propTypes = {
  /** Called on change.
   * @param {SyntheticEvent} event React's original SyntheticEvent.
   * @param {object} data All props and proposed value.
  */
  onChange: PropTypes.func,
  /** Same as semantic-ui-react Input's ``icon`` prop. */
  icon: PropTypes.any,
  /** Date formatting string.
   * Anything that that can be passed to ``moment().format``
   */
  dateFormat: PropTypes.string,
  startMode: PropTypes.oneOf(['year', 'month', 'day']),
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
  inline: PropTypes.bool,
  value: PropTypes.string
};

DateInput.defaultProps = {
  icon: 'calendar',
  dateFormat: 'DD-MM-YYYY',
  startMode: 'day',
  inline: false,
  value: ''
};

const WrappedDateInput = withStateInput(DateInput);

export default WrappedDateInput;
export {
  WrappedDateInput as DateInput
};
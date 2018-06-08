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
  DATE_TIME_INPUT
} from '../../lib/COMPONENT_TYPES.js';
import { DateTimePickerContent } from '../../components/pickerContent/DateTimePickerContent.js';


class DateTimeInput extends YearPickerMixin {

  static META = {
    type: DATE_TIME_INPUT,
    name: 'DateTimeInput'
  }

  constructor(props) {
    super(props);

    this.state = {
      yearsStart: props.dateToShow.year() - 6
    };
  }

  getPicker() {
    const rest = getUnhandledProps(DateTimeInput, this.props);
    return (
      <Table
        { ...rest }
        unstackable
        celled
        textAlign="center">
        <DateTimePickerContent
          activeDate={this.props.dateToShow}
          activeHour={this.props.activeHour}
          activeMinute={this.props.activeMinute}
          mode={this.props.mode}
          handleHeaderDateClick={this.props.handleHeaderDateClick}
          handleHeaderTimeClick={this.props.handleHeaderTimeClick}
          onYearChange={this.props.onYearChange}
          showNextMonth={this.props.showNextMonth}
          showPrevMonth={this.props.showPrevMonth}
          showNextYear={this.props.showNextYear}
          showPrevYear={this.props.showPrevYear}
          showNextDay={this.props.showNextDay}
          showPrevDay={this.props.showPrevDay}
          dateToShow={this.props.dateToShow}
          onMonthChange={this.props.onMonthChange}
          onDateClick={this.props.onDateClick}
          onHourClick={this.props.onHourClick}
          onMinuteClick={this.props.onMinuteClick}
          yearsRange={this.getYearsRange()}
          onPrevBtnClick={this.onPrevBtnClick}
          onNextBtnClick={this.onNextBtnClick} />
      </Table>
    );
  }

  render() {
    const {
      icon,
      onChange,
      startMode,
      popupPosition,
      inline,
      value
    } = this.props;
    const rest = getUnhandledProps(DateTimeInput, this.props);

    const inputElement = (
      <Input
        { ...rest }
        value={value}
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

DateTimeInput.propTypes = {
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

DateTimeInput.defaultProps = {
  icon: 'calendar',
  dateFormat: 'DD-MM-YYYY',
  startMode: 'day',
  inline: false
};

const WrappedDateTimeInput = withStateInput(DateTimeInput);

export default WrappedDateTimeInput;
export {
  WrappedDateTimeInput as DateTimeInput
};
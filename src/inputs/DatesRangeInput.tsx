import isBoolean from 'lodash/isBoolean';
import invoke from 'lodash/invoke';
import PropTypes from 'prop-types';
import React from 'react';

import CustomPropTypes from '../lib/CustomPropTypes';
import InputView from '../views/InputView';
import {
  getInitializer,
  parseDatesRange,
  parseValue,
  parseArrayOrValue,
  buildValue,
  dateValueToString,
} from './parse';

import DatesRangePicker, {
  DatesRangePickerOnChangeData,
} from '../pickers/dayPicker/DatesRangePicker';
import BaseInput, {
  BaseInputProps,
  BaseInputState,
  DateRelatedProps,
  MinMaxValueProps,
  MarkedValuesProps,
} from './BaseInput';
import moment = require('moment');

const DATES_SEPARATOR = ' - ';

export type DatesRangeInputProps =
  & BaseInputProps
  & DateRelatedProps
  & MarkedValuesProps
  & MinMaxValueProps;

export interface DatesRangeInputOnChangeData extends DatesRangeInputProps {
  value: string;
}

class DatesRangeInput extends BaseInput<DatesRangeInputProps, BaseInputState> {
  /**
   * Component responsibility:
   *  - parse input value (start: Moment, end: Moment)
   *  - handle DayPicker change (format {start: Moment, end: Moment} into
   *    string 'start - end')
   */
  public static readonly defaultProps = {
    ...BaseInput.defaultProps,
    dateFormat: 'DD-MM-YYYY',
    icon: 'calendar',
  };

  public static readonly propTypes = {
    /** Currently selected value. */
    value: PropTypes.string,
    /** Moment date formatting string. */
    dateFormat: PropTypes.string,
    /** Date to display initially when no date is selected. */
    initialDate: PropTypes.oneOfType([
      PropTypes.string,
      CustomPropTypes.momentObj,
      PropTypes.instanceOf(Date),
    ]),
    /** Maximum date that can be selected. */
    maxDate: PropTypes.oneOfType([
      PropTypes.string,
      CustomPropTypes.momentObj,
      PropTypes.instanceOf(Date),
    ]),
    /** Minimum date that can be selected. */
    minDate: PropTypes.oneOfType([
      PropTypes.string,
      CustomPropTypes.momentObj,
      PropTypes.instanceOf(Date),
    ]),
    /** If true, popup closes after selecting a date-time. */
    closable: PropTypes.bool,
    /**
     * Called on clear.
     *
     * @param {SyntheticEvent} event - React's original SyntheticEvent.
     * @param {object} data - All props and proposed value.
     */
    onClear: PropTypes.func,
    /** Using the clearable setting will let users remove their selection from a calendar. */
    clearable: PropTypes.bool,
    /** Optional Icon to display inside the clearable Input. */
    clearIcon: PropTypes.any,
    /** Duration of the CSS transition animation in milliseconds. */
    duration: PropTypes.number,
    /** Named animation event to used. Must be defined in CSS. */
    animation: PropTypes.string,
    marked: PropTypes.oneOfType([
      CustomPropTypes.momentObj,
      CustomPropTypes.dateObject,
      PropTypes.arrayOf(CustomPropTypes.momentObj),
      PropTypes.arrayOf(CustomPropTypes.dateObject),
    ]),
    markColor: PropTypes.string,
    /** Moment date localization. */
    localization: PropTypes.string,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    iconPosition: PropTypes.oneOf(['left', 'right']),
  };

  constructor(props) {
    super(props);
    this.state = {
      popupIsClosed: true,
    };
  }

  public render() {
    const {
      value,
      dateFormat,
      initialDate,
      maxDate,
      minDate,
      closable,
      marked,
      markColor,
      localization,
      ...rest
    } = this.props;

    return (
      <InputView
        popupIsClosed={this.state.popupIsClosed}
        {...rest}
        value={value}
        onMount={this.onInputViewMount}
        closePopup={this.closePopup}
        openPopup={this.openPopup}
        renderPicker={this.getPicker}
      />
    );
  }

  private getPicker = () => {
    const {
      value,
      dateFormat,
      markColor,
      marked,
      initialDate,
      localization,
      minDate,
      maxDate,
      tabIndex,
      pickerWidth,
      pickerStyle,
    } = this.props;
    const {
      start,
      end,
    } = parseDatesRange(value, dateFormat);
    const markedParsed = parseArrayOrValue(marked, dateFormat, localization);

    return (
      <DatesRangePicker
        isPickerInFocus={this.isPickerInFocus}
        isTriggerInFocus={this.isTriggerInFocus}
        inline={this.props.inline}
        onCalendarViewMount={this.onCalendarViewMount}
        closePopup={this.closePopup}
        onChange={this.handleSelect}
        dateFormat={dateFormat}
        initializeWith={buildValue(start, initialDate, localization, dateFormat)}
        start={start}
        end={end}
        marked={markedParsed}
        markColor={markColor}
        minDate={parseValue(minDate, dateFormat, localization)}
        maxDate={parseValue(maxDate, dateFormat, localization)}
        localization={localization}
        onHeaderClick={() => undefined}
        tabIndex={tabIndex}
        pickerWidth={pickerWidth}
        pickerStyle={pickerStyle}
      />
    );
  }

  private handleSelect = (e: React.SyntheticEvent<HTMLElement>,
                          { value }: DatesRangePickerOnChangeData) => {
    const { dateFormat } = this.props;
    const {
      start,
      end,
    } = value;
    let outputString = '';
    if (start && end) {
      outputString = `${start.format(dateFormat)}${DATES_SEPARATOR}${end.format(dateFormat)}`;
    } else if (start) {
      outputString = `${start.format(dateFormat)}${DATES_SEPARATOR}`;
    }
    invoke(this.props, 'onChange', e, { ...this.props, value: outputString });
    if (this.props.closable && start && end) {
      this.closePopup();
    }
  }
}

export default DatesRangeInput;

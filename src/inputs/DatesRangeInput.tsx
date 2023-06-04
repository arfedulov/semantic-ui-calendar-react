import invoke from 'lodash/invoke';
import * as React from 'react';

import InputView from '../views/InputView';
import {
  parseDatesRange,
  parseValue,
  parseArrayOrValue,
  buildValue,
} from './parse';

import DatesRangePicker, {
  DatesRangePickerOnChangeData,
} from '../pickers/dayPicker/DatesRangePicker';
import BaseInput, {
  BaseInputProps,
  BaseInputPropTypes,
  BaseInputState,
  DateRelatedProps,
  DateRelatedPropTypes,
  MinMaxValueProps,
  MinMaxValuePropTypes,
  MarkedValuesProps,
  MarkedValuesPropTypes,
  RangeRelatedProps,
  RangeRelatedPropTypes,
} from './BaseInput';

const DATES_SEPARATOR = ' - ';

export type DatesRangeInputProps =
  & BaseInputProps
  & DateRelatedProps
  & MarkedValuesProps
  & MinMaxValueProps
  & RangeRelatedProps;

export type DatesRangeInputOnChangeData = DatesRangeInputProps;

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
    ...BaseInputPropTypes,
    ...DateRelatedPropTypes,
    ...MarkedValuesPropTypes,
    ...MinMaxValuePropTypes,
    ...RangeRelatedPropTypes,
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
      allowSameEndDate,
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
      allowSameEndDate,
    } = this.props;
    const {
      start,
      end,
    } = parseDatesRange(value, dateFormat);

    const markedParsed = parseArrayOrValue(marked, dateFormat, localization);
    const minDateParsed = parseValue(minDate, dateFormat, localization);
    const maxDateParsed = parseValue(maxDate, dateFormat, localization);

    let initializeWith;

    if (!initialDate && (minDateParsed || maxDateParsed)) {
      initializeWith = minDateParsed || maxDateParsed;
    } else {
      initializeWith = buildValue(start, initialDate, localization, dateFormat);
    }

    return (
      <DatesRangePicker
        isPickerInFocus={this.isPickerInFocus}
        isTriggerInFocus={this.isTriggerInFocus}
        inline={this.props.inline}
        onCalendarViewMount={this.onCalendarViewMount}
        closePopup={this.closePopup}
        onChange={this.handleSelect}
        dateFormat={dateFormat}
        initializeWith={initializeWith}
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
        allowSameEndDate={allowSameEndDate}
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

import invoke from 'lodash/invoke';
import * as React from 'react';
import { Moment } from 'moment';

import InputView from '../views/InputView';
import {
  parseDatesRange,
  parseValue,
  parseArrayOrValue,
  buildValue,
  pickInitialDate,
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

import {
  DatesRangeView,
  DatesRangeViewProps,
} from '../views';

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

  public static readonly propTypes = Object.assign({},
    BaseInputPropTypes,
    DateRelatedPropTypes,
    MarkedValuesPropTypes,
    MinMaxValuePropTypes,
    RangeRelatedPropTypes,
  );

  constructor(props) {
    super(props);
    this.state = {
      popupIsClosed: true,
    };
  }

  public render() {
    const { value } = this.props;

    return (
      <InputView
        { ...this.getUnusedProps() }
        popupIsClosed={this.state.popupIsClosed}
        value={value}
        onMount={this.onInputViewMount}
        closePopup={this.closePopup}
        openPopup={this.openPopup}
        renderPicker={this.getPicker}
      />
    );
  }

  protected getUnusedProps = () => {
    // TODO: automate unused props extraction
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

    return rest;
  }

  protected parseInternalValue(): Moment {
    const {
      value,
      dateFormat,
    } = this.props;

    const { start } = parseDatesRange(value, dateFormat);

    return start;
  }

  private getPicker = () => {
    const {
      value,
      dateFormat,
      markColor,
      marked,
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

    return (
      <DatesRangePicker
        isPickerInFocus={this.isPickerInFocus}
        isTriggerInFocus={this.isTriggerInFocus}
        inline={this.props.inline}
        onCalendarViewMount={this.onCalendarViewMount}
        closePopup={this.closePopup}
        onChange={this.handleSelect}
        dateFormat={dateFormat}
        initializeWith={pickInitialDate({ ...this.props, value: this.parseInternalValue()})}
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
        renderView={this.getDatesRangeView}
      />
    );
  }

  private getDatesRangeView = (datesRangeViewProps: DatesRangeViewProps) => {
    const {
      markColor,
      localization,
    } = this.props;

    return (
      <DatesRangeView
        { ...this.getUnusedProps() }
        { ...datesRangeViewProps }
        markColor={markColor}
        localization={localization}
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

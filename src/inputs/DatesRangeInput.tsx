import invoke from 'lodash/invoke';
import * as React from 'react';
import { Moment } from 'moment';

import {
  parseDatesRange,
  parseValue,
  parseArrayOrValue,
  pickInitialDate,
} from './parse';

import { getRestProps } from '../lib';
import { getDatesRangeView } from './shared';

import DatesRangePicker, {
  DatesRangePickerOnChangeData,
} from '../pickers/dayPicker/DatesRangePicker';
import BaseInput, {
  BaseInputProps,
  BaseInputPropTypes,
  BaseInputPropsNames,
  BaseInputState,
  DateRelatedProps,
  DateRelatedPropTypes,
  DateRelatedPropsNames,
  MinMaxValueProps,
  MinMaxValuePropTypes,
  MinMaxValuePropsNames,
  MarkedValuesProps,
  MarkedValuesPropTypes,
  MarkedValuesPropsNames,
  RangeRelatedProps,
  RangeRelatedPropTypes,
  RangeRelatedPropsNames,
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

  public static readonly propTypes = Object.assign({},
    BaseInputPropTypes,
    DateRelatedPropTypes,
    MarkedValuesPropTypes,
    MinMaxValuePropTypes,
    RangeRelatedPropTypes,
  );

  protected readonly hasHeader = true;

  private getDatesRangeView: (props: any) => React.ReactElement;

  constructor(props) {
    super(props);
    this.state = {
      popupIsClosed: true,
    };

    this.getDatesRangeView = getDatesRangeView.bind(this);
  }

  protected onInputValueChange = () => {
    return;
  }

  protected getInputViewValue = () => {
    const { value } = this.props;

    return value;
  }

  protected onFocus = () => {
    return;
  }

  protected getUnusedProps = () => {
    // Return props which do not exist in DatesRangeInputProps type
    return getRestProps(this.props, [
      ...BaseInputPropsNames,
      ...DateRelatedPropsNames,
      ...MarkedValuesPropsNames,
      ...MinMaxValuePropsNames,
      ...RangeRelatedPropsNames,
    ]);
  }

  protected parseInternalValue(): Moment {
    const {
      value,
      dateFormat,
    } = this.props;

    const { start } = parseDatesRange(value, dateFormat);

    return start;
  }

  protected getPicker = () => {
    const {
      value,
      dateFormat,
      marked,
      localization,
      minDate,
      maxDate,
      allowSameEndDate,
      inline,
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
        inline={inline}
        closePopup={this.closePopup}
        onChange={this.handleSelect}
        dateFormat={dateFormat}
        initializeWith={pickInitialDate({ ...this.props, value: this.parseInternalValue()})}
        start={start}
        end={end}
        marked={markedParsed}
        minDate={parseValue(minDate, dateFormat, localization)}
        maxDate={parseValue(maxDate, dateFormat, localization)}
        localization={localization}
        allowSameEndDate={allowSameEndDate}
        renderView={this.getDatesRangeView}
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

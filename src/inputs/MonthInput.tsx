import invoke from 'lodash/invoke';
import moment, { Moment } from 'moment';
import * as React from 'react';

import MonthPicker, {
  MonthPickerOnChangeData,
} from '../pickers/monthPicker/MonthPicker';
import BaseInput, {
  BaseInputProps,
  BaseInputPropTypes,
  BaseInputPropsNames,
  BaseInputState,
  DateRelatedProps,
  DateRelatedPropTypes,
  DateRelatedPropsNames,
  DisableValuesProps,
  DisableValuesPropTypes,
  DisableValuesPropsNames,
  MinMaxValueProps,
  MinMaxValuePropTypes,
  MinMaxValuePropsNames,
} from './BaseInput';
import {
  parseArrayOrValue,
  parseValue,
  buildValue,
  dateValueToString,
  pickInitialDate,
} from './parse';
import { getRestProps } from '../lib';
import { getMonthView } from './shared';

export type MonthInputProps =
  & BaseInputProps
  & DateRelatedProps
  & DisableValuesProps
  & MinMaxValueProps;

export type MonthInputOnChangeData = MonthInputProps;

class MonthInput extends BaseInput<MonthInputProps, BaseInputState> {
  public static readonly defaultProps = {
    ...BaseInput.defaultProps,
    dateFormat: 'MMM',
    icon: 'calendar',
  };

  public static readonly propTypes = Object.assign({},
    BaseInputPropTypes,
    DateRelatedPropTypes,
    DisableValuesPropTypes,
    MinMaxValuePropTypes,
  );

  protected readonly hasHeader = false;

  private getMonthView: (props: any) => React.ReactElement;

  constructor(props) {
    super(props);
    this.state = {
      popupIsClosed: true,
    };

    this.getMonthView = getMonthView.bind(this);
  }

  protected getInputViewValue = () => {
    const {
      value,
      dateFormat,
      localization,
    } = this.props;

    return dateValueToString(value, dateFormat, localization);
  }

  protected onFocus = () => {
    return;
  }

  protected onInputValueChange = () => {
    return;
  }

  protected getUnusedProps = () => {
    // Return props which do not exist in MonthInputProps type
    return getRestProps(this.props, [
      ...BaseInputPropsNames,
      ...DateRelatedPropsNames,
      ...DisableValuesPropsNames,
      ...MinMaxValuePropsNames,
    ]);
  }

  protected parseInternalValue(): Moment {
    const {
      value,
      localization,
      dateFormat,
    } = this.props;
    
    return buildValue(value, null, localization, dateFormat, null);
  }

  protected getPicker = () => {
    const {
      value,
      dateFormat,
      disable,
      maxDate,
      minDate,
      localization,
    } = this.props;

    return (
      <MonthPicker
        inline={this.props.inline}
        isPickerInFocus={this.isPickerInFocus}
        isTriggerInFocus={this.isTriggerInFocus}
        closePopup={this.closePopup}
        onChange={this.handleSelect}
        initializeWith={pickInitialDate({ ...this.props, value: this.parseInternalValue() })}
        value={buildValue(value, null, localization, dateFormat, null)}
        disable={parseArrayOrValue(disable, dateFormat, localization)}
        maxDate={parseValue(maxDate, dateFormat, localization)}
        minDate={parseValue(minDate, dateFormat, localization)}
        localization={localization}
        renderView={this.getMonthView}
      />
    );
  }

  private handleSelect = (e: React.SyntheticEvent<HTMLElement>,
                          { value }: MonthPickerOnChangeData) => {
    const { localization } = this.props;
    const date = localization ? moment({ month: value.month }).locale(localization) : moment({ month: value.month });
    let output = '';
    if (date.isValid()) {
      output = date.format(this.props.dateFormat);
    }
    invoke(
      this.props,
      'onChange',
      e, { ...this.props, value: output });
    if (this.props.closable) {
      this.closePopup();
    }
  }
}

export default MonthInput;

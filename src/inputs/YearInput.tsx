import moment, { Moment } from 'moment';
import * as React from 'react';

import YearPicker, {
  YearPickerOnChangeData,
} from '../pickers/YearPicker';
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
  pickInitialDate,
} from './parse';
import { getRestProps } from '../lib';
import { getYearView } from './shared';

export type YearInputProps =
  & BaseInputProps
  & DateRelatedProps
  & MinMaxValueProps
  & DisableValuesProps;

export type YearInputOnChangeData = YearInputProps;

class YearInput extends BaseInput<YearInputProps, BaseInputState> {
  public static readonly defaultProps = {
    ...BaseInput.defaultProps,
    dateFormat: 'YYYY',
    icon: 'calendar',
  };

  public static readonly propTypes = Object.assign({},
    BaseInputPropTypes,
    DateRelatedPropTypes,
    MinMaxValuePropTypes,
    DisableValuesPropTypes,
  );

  private getYearView: (props: any) => React.ReactElement;

  constructor(props) {
    super(props);
    this.state = {
      popupIsClosed: true,
    };

    this.getYearView = getYearView.bind(this);
  }

  protected getInputViewValue = () => {
    const { value } = this.props;

    return value;
  }

  protected onInputValueChange = () => {
    return;
  }

  protected onFocus = () => {
    return;
  }

  protected getUnusedProps = () => {
    // Return props which do not exist in YearInputProps type
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
      disable,
      maxDate,
      minDate,
      dateFormat,
      localization,
    } = this.props;

    return (
      <YearPicker
        isPickerInFocus={this.isPickerInFocus}
        isTriggerInFocus={this.isTriggerInFocus}
        inline={this.props.inline}
        closePopup={this.closePopup}
        onChange={this.handleSelect}
        initializeWith={pickInitialDate({ ...this.props, value: this.parseInternalValue() })}
        value={buildValue(value, null, localization, dateFormat, null)}
        disable={parseArrayOrValue(disable, dateFormat, localization)}
        maxDate={parseValue(maxDate, dateFormat, localization)}
        minDate={parseValue(minDate, dateFormat, localization)}
        renderView={ this.getYearView }
      />
    );
  }

  private handleSelect = (e: React.SyntheticEvent<HTMLElement>,
                          { value }: YearPickerOnChangeData) => {
    const { localization } = this.props;
    const date = localization ? moment({ year: value.year }).locale(localization) : moment({ year: value.year });
    let output = '';
    if (date.isValid()) {
      output = date.format(this.props.dateFormat);
    }
    const data = {
      ...this.props,
      value: output,
    };
    this.props.onChange(e, data);
    if (this.props.closable) {
      this.closePopup();
    }
  }
}

export default YearInput;

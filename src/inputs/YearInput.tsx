import moment, { Moment } from 'moment';
import * as React from 'react';

import YearPicker, {
  YearPickerOnChangeData, YEARS_ON_PAGE,
} from '../pickers/YearPicker';
import InputView from '../views/InputView';
import BaseInput, {
  BaseInputProps,
  BaseInputPropTypes,
  BaseInputState,
  DateRelatedProps,
  DateRelatedPropTypes,
  DisableValuesProps,
  DisableValuesPropTypes,
  MinMaxValueProps,
  MinMaxValuePropTypes,
} from './BaseInput';
import {
  parseArrayOrValue,
  parseValue,
  buildValue,
} from './parse';

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

  public static readonly propTypes = {
    ...BaseInputPropTypes,
    ...DateRelatedPropTypes,
    ...MinMaxValuePropTypes,
    ...DisableValuesPropTypes,
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
      disable,
      maxDate,
      minDate,
      initialDate,
      dateFormat,
      closable,
      localization,
      ...rest
    } = this.props;

    return (
      <InputView
        popupIsClosed={this.state.popupIsClosed}
        closePopup={this.closePopup}
        openPopup={this.openPopup}
        {...rest}
        value={value}
        onMount={this.onInputViewMount}
        renderPicker={this.getPicker}
      />
    );
  }

  protected getInitialDateInBounds = (): Moment => {
    const {
      initialDate,
      minDate,
      maxDate,
    } = this.props;

    let date = moment(initialDate);
    if (minDate && moment(minDate).year() % YEARS_ON_PAGE > date.year() % YEARS_ON_PAGE) {
      date = moment(minDate);
    } else if (maxDate && moment(maxDate).year() % YEARS_ON_PAGE < date.year() % YEARS_ON_PAGE) {
      date = moment(maxDate);
    }

    return date;
  }

  private getPicker = () => {
    const {
      value,
      disable,
      maxDate,
      minDate,
      initialDate,
      dateFormat,
      localization,
    } = this.props;

    return (
      <YearPicker
        isPickerInFocus={this.isPickerInFocus}
        isTriggerInFocus={this.isTriggerInFocus}
        inline={this.props.inline}
        onCalendarViewMount={this.onCalendarViewMount}
        closePopup={this.closePopup}
        onChange={this.handleSelect}
        initializeWith={buildValue(value, this.getInitialDateInBounds(), localization, dateFormat)}
        value={buildValue(value, null, localization, dateFormat, null)}
        disable={parseArrayOrValue(disable, dateFormat, localization)}
        maxDate={parseValue(maxDate, dateFormat, localization)}
        minDate={parseValue(minDate, dateFormat, localization)}
        onHeaderClick={() => undefined}
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

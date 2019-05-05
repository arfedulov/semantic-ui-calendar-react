import invoke from 'lodash/invoke';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import BaseInput, {
  BaseInputProps,
  BaseInputPropTypes,
  BaseInputState,
  DateRelatedProps,
  DateRelatedPropTypes,
  MinMaxValueProps,
  MinMaxValuePropTypes,
} from './BaseInput';

import CustomPropTypes from '../lib/CustomPropTypes';
import MonthRangePicker, {MonthRangePickerOnChangeData} from '../pickers/monthPicker/MonthRangePicker';
import InputView from '../views/InputView';
import {MonthInputProps} from './MonthInput';
import {
  parseDatesRange,
  parseValue,
  buildValue,
} from './parse';

const DATES_SEPARATOR = ' - ';

export type MonthRangeInputProps =
  & BaseInputProps
  & DateRelatedProps
  & MinMaxValueProps;

export interface MonthRangeInputOnChangeData extends MonthInputProps {
  value: string;
  date: MonthRangePickerOnChangeData;
}

class MonthRangeInput extends BaseInput<MonthRangeInputProps, BaseInputState> {
  public static readonly defaultProps = {
    ...BaseInput.defaultProps,
    dateFormat: 'MM-YYYY',
    icon: 'calendar',
  };

  public static readonly propTypes = Object.assign({},
    BaseInputPropTypes,
    DateRelatedPropTypes,
    MinMaxValuePropTypes,
  );

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
      initialDate,
      maxDate,
      minDate,
      localization,
    } = this.props;
    const {
      start,
      end,
    } = parseDatesRange(value, dateFormat);

    return (
      <MonthRangePicker
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
        minDate={parseValue(minDate, dateFormat, localization)}
        maxDate={parseValue(maxDate, dateFormat, localization)}
        localization={localization}
        onHeaderClick={() => undefined}
      />
    );
  }

  private handleSelect = (e: React.SyntheticEvent<HTMLElement>,
                          {value}: MonthRangePickerOnChangeData) => {
    const {dateFormat} = this.props;
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

    invoke(this.props, 'onChange', e, {...this.props, value: outputString, date: value});
    if (this.props.closable && start && end) {
      this.closePopup();
    }
  }
}

export default MonthRangeInput;

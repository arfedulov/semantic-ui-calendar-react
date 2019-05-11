import invoke from 'lodash/invoke';
import * as React from 'react';
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
} from './BaseInput';
import { Moment } from 'moment';

import MonthRangePicker from '../pickers/monthPicker/MonthRangePicker';
import InputView from '../views/InputView';
import {
  parseDatesRange,
  parseValue,
  buildValue,
  pickInitialDate,
} from './parse';
import { BasePickerOnChangeData } from 'src/pickers/BasePicker';
import { getRestProps } from '../lib';

import {
  MonthRangeView,
  MonthRangeViewProps,
} from '../views';

const DATES_SEPARATOR = ' - ';

export type MonthRangeInputProps =
  & BaseInputProps
  & DateRelatedProps
  & MinMaxValueProps;

export type MonthRangeInputOnChangeData = MonthRangeInputProps;

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
      onChange,
    } = this.props;

    return (
      <InputView
        { ...this.getUnusedProps() }
        onChange={ onChange }
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
    // Return props which do not exist in MonthRangeInputProps type
    return getRestProps(this.props, [
      ...BaseInputPropsNames,
      ...DateRelatedPropsNames,
      ...MinMaxValuePropsNames,
    ]);
  }

  protected parseInternalValue(): Moment {
    const {
      value,
      initialDate,
      localization,
      dateFormat,
    } = this.props;
    const { start } = parseDatesRange(value, dateFormat);

    return buildValue(start, initialDate, localization, dateFormat);
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
        closePopup={this.closePopup}
        onChange={this.handleSelect}
        dateFormat={dateFormat}
        initializeWith={pickInitialDate({ ...this.props, value: this.parseInternalValue() })}
        start={start}
        end={end}
        minDate={parseValue(minDate, dateFormat, localization)}
        maxDate={parseValue(maxDate, dateFormat, localization)}
        localization={localization}
        onHeaderClick={() => undefined}
        renderView={ this.getMonthRangeView }
      />
    );
  }

  private getMonthRangeView = (monthRangeViewProps) => {
    const {
      inline,
    } = this.props;

    return (
      <MonthRangeView
        { ...this.getUnusedProps() }
        { ...monthRangeViewProps }
        inline={ inline }
        onMount={ this.onCalendarViewMount }
        localization={ this.props.localization }/>
    );
  }

  private handleSelect = (e: React.SyntheticEvent<HTMLElement>,
                          {value}: BasePickerOnChangeData) => {
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

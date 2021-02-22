import invoke from 'lodash/invoke';
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

import MonthRangePicker from '../pickers/monthPicker/MonthRangePicker';
import InputView from '../views/InputView';
import {
  parseDatesRange,
  parseValue,
  buildValue,
  parseArrayOrValue,
} from './parse';
import { BasePickerOnChangeData } from '../pickers/BasePicker';
import moment, { Moment } from 'moment';
import YearPicker from '../pickers/YearPicker';
import {
  tick,
} from '../lib';
import { getDisabledYears } from './shared';
import { isNil } from 'lodash';

const DATES_SEPARATOR = ' - ';

type CalendarMode = 'year' | 'month';

function getNextMode(currentMode: CalendarMode) {
  if (currentMode === 'year') {
    return 'month';
  }

  return 'year';
}

function getPrevMode(currentMode: CalendarMode) {
  if (currentMode === 'month') {
    return 'year';
  }

  return 'month';
}

interface MonthRangeInputState extends BaseInputState {
  mode: CalendarMode;
  inputStart: Moment;
  inputEnd: Moment;
  displayYear: number;
}

export type MonthRangeInputProps =
  & BaseInputProps
  & DateRelatedProps
  & MinMaxValueProps;

export type MonthRangeInputOnChangeData = MonthRangeInputProps;

class MonthRangeInput extends BaseInput<MonthRangeInputProps, MonthRangeInputState> {
  public static readonly defaultProps = {
    ...BaseInput.defaultProps,
    dateFormat: 'MM-YYYY',
    icon: 'calendar',
  };

  public static readonly propTypes = {
    ...BaseInputPropTypes,
    ...DateRelatedPropTypes,
    ...MinMaxValuePropTypes,
  };

  constructor(props) {
    super(props);
    this.state = {
      mode: 'month',
      inputStart: undefined,
      inputEnd: undefined,
      displayYear: undefined,
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
        onChange={this.inputChangeHandler}
        renderPicker={this.getPicker}
      />
    );
  }

  private getPicker = () => {
    const {
      value,
      dateFormat,
      maxDate,
      minDate,
      tabIndex,
      pickerWidth,
      pickerStyle,
      localization,
    } = this.props;

    const {
      disable,
      enable,
      inline,
    } = this.props;

    const {
      start,
      end,
    } = parseDatesRange(value, dateFormat);

    let { initialDate } = this.props;

    const disableParsed = parseArrayOrValue(disable, dateFormat, localization);
    const minDateParsed = parseValue(minDate, dateFormat, localization);

    const pickerProps = {
      isPickerInFocus: this.isPickerInFocus,
      isTriggerInFocus: this.isTriggerInFocus,
      inline,
      onCalendarViewMount: this.onCalendarViewMount,
      closePopup: this.closePopup,
      tabIndex,
      pickerWidth,
      pickerStyle,
      onHeaderClick: this.switchToPrevMode,
      value: buildValue(value, null, localization, dateFormat, null),
      enable: parseArrayOrValue(enable, dateFormat, localization),
      minDate: parseValue(minDate, dateFormat, localization),
      maxDate: parseValue(maxDate, dateFormat, localization),
      localization,
    };

    let initializeWith: Moment;
    if (this.state.mode === 'year') {
      if (this.state.displayYear) {
        initializeWith = moment(new Date(this.state.displayYear, 0, 1));
      } else if (minDateParsed) {
        initializeWith = minDateParsed;
      } else {
        initializeWith = buildValue(this.state.inputStart, initialDate, localization, dateFormat);
      }

      return (
        <YearPicker
          {...pickerProps}
          onChange={this.setYear}
          initializeWith={initializeWith}
          disable={getDisabledYears(disableParsed)}
        />
      );
    } else {
      if (this.state.displayYear > 0) {
        initialDate = moment(new Date(this.state.displayYear, 0, 1));
      } else if (minDateParsed) {
        initialDate = minDateParsed;
      }

      initializeWith = buildValue(initialDate, this.state.inputStart, localization, dateFormat);

      return (
        <MonthRangePicker
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
          minDate={parseValue(minDate, dateFormat, localization)}
          maxDate={parseValue(maxDate, dateFormat, localization)}
          localization={localization}
          onHeaderClick={this.switchToPrevMode}
        />
      );
    }
  }

  private handleSelect = (e: React.SyntheticEvent<HTMLElement>, { value }: BasePickerOnChangeData) => {
    const { dateFormat } = this.props;
    const {
      start,
      end,
    } = value;

    this.setState({
      inputStart: start,
      inputEnd: end,
    }, () => this.state.mode !== 'month' && this.switchToNextMode());

    let outputString = '';
    if (start && end) {
      outputString = `${start.format(dateFormat)}${DATES_SEPARATOR}${end.format(dateFormat)}`;
    } else if (start) {
      outputString = `${start.format(dateFormat)}${DATES_SEPARATOR}`;
    }

    invoke(this.props, 'onChange', e, { ...this.props, value: outputString, date: value });
    if (this.props.closable && start && end) {
      this.closePopup();
    }
  }

  private setYear = (e: React.SyntheticEvent<HTMLElement>, { value }: BasePickerOnChangeData): void => {
    this.setState({
      displayYear: value.year,
    }, () => this.switchToNextMode());
  }
  private switchToNextModeUndelayed = (): void => {
    this.setState(({ mode }) => {
      return { mode: getNextMode(mode) };
    }, this.onModeSwitch);
  }

  private switchToNextMode = (): void => {
    tick(this.switchToNextModeUndelayed);
  }

  private switchToPrevModeUndelayed = (): void => {
    this.setState(({ mode }) => {
      return { mode: getPrevMode(mode) };
    }, this.onModeSwitch);
  }

  private switchToPrevMode = (): void => {
    tick(this.switchToPrevModeUndelayed);
  }

  private isValidDate(date: Moment): boolean {
    return !isNil(date) && date.isValid();
  }

  // Update the start/end dates when input is changed manually (not from Picker)
  private inputChangeHandler = (e: React.SyntheticEvent<HTMLElement>, data: any) => {
    const { start, end } = parseDatesRange(data.value, this.props.dateFormat);

    this.setState({
      inputStart: start,
      inputEnd: end,
    });

    this.props.onChange(e, data);
  }
}

export default MonthRangeInput;

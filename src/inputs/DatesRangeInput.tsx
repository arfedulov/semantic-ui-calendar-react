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

import {
  tick,
} from '../lib';
import { getDisabledYears, getDisabledMonths } from './shared';
import YearPicker from '../pickers/YearPicker';
import MonthPicker from '../pickers/monthPicker/MonthPicker';
import { isNil } from 'lodash';
import moment, { Moment } from 'moment';
import { BasePickerOnChangeData } from 'src/pickers/BasePicker';

const DATES_SEPARATOR = ' - ';

type CalendarMode = 'year' | 'month' | 'day';

function getNextMode(currentMode: CalendarMode) {
  if (currentMode === 'year') {
    return 'month';
  }
  if (currentMode === 'month') {
    return 'day';
  }

  return 'year';
}

function getPrevMode(currentMode: CalendarMode) {
  if (currentMode === 'day') {
    return 'month';
  }
  if (currentMode === 'month') {
    return 'year';
  }

  return 'day';
}

interface DatesRangeInputState extends BaseInputState {
  mode: CalendarMode;
  inputStart: Moment;
  inputEnd: Moment;
  displayYear: number;
  displayMonth: number;
}

export type DatesRangeInputProps =
  & BaseInputProps
  & DateRelatedProps
  & MarkedValuesProps
  & MinMaxValueProps
  & RangeRelatedProps;

export type DatesRangeInputOnChangeData = DatesRangeInputProps;

class DatesRangeInput extends BaseInput<DatesRangeInputProps, DatesRangeInputState> {
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

    let {
      start,
      end,
    } = parseDatesRange(this.props.value, this.props.dateFormat);

    this.state = {
      mode: 'day',
      inputStart: start,
      inputEnd: end,
      displayYear: this.isValidDate(start) ? start.year() : undefined,
      displayMonth: this.isValidDate(start) ? start.month() : undefined,
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
        onChange={this.inputChangeHandler}
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
      localization,
      minDate,
      maxDate,
      tabIndex,
      pickerWidth,
      pickerStyle,
      allowSameEndDate,
    } = this.props;

    let { initialDate } = this.props;

    const {
      disable,
      enable,
      inline,
    } = this.props;

    let start: Moment = null;
    let end: Moment = null;

    if (this.isValidDate(this.state.inputStart)) {
      start = this.state.inputStart;
    }

    if (this.isValidDate(this.state.inputEnd)) {
      end = this.state.inputEnd;
    }

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

    const disableParsed = parseArrayOrValue(disable, dateFormat, localization);

    const markedParsed = parseArrayOrValue(marked, dateFormat, localization);
    const minDateParsed = parseValue(minDate, dateFormat, localization);
    const maxDateParsed = parseValue(maxDate, dateFormat, localization);

    let initializeWith;
    switch (this.state.mode) {
      case 'year':
        if (this.state.displayYear) {
          initializeWith = moment(new Date(this.state.displayYear, 0, 1))
        } else {
          initializeWith = buildValue(this.state.inputStart, initialDate, localization, dateFormat);
        }

        return (<YearPicker
          {...pickerProps}
          onChange={this.setYear}
          initializeWith={initializeWith}
          disable={getDisabledYears(disableParsed)}
        />
        )
      case 'month':
        if (this.state.displayYear) {
          initializeWith = moment(new Date(this.state.displayYear, 0, 1))
        } else {
          initializeWith = buildValue(this.state.inputStart, initialDate, localization, dateFormat);
        }

        return (
          <MonthPicker
            {...pickerProps}
            hasHeader
            onChange={this.setMonth}
            initializeWith={initializeWith}
            disable={getDisabledMonths(disableParsed)}
          />
        )
      case 'day':
      default:
        if (!initialDate && minDateParsed || maxDateParsed) {
          initializeWith = minDateParsed || maxDateParsed;
        } else {

          if (this.state.displayYear > 0 && this.state.displayMonth >= 0) {
            initialDate = moment(new Date(this.state.displayYear, this.state.displayMonth, 1));
          }

          initializeWith = buildValue(initialDate, this.state.inputStart, localization, dateFormat);
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
            onHeaderClick={this.switchToPrevMode}
            tabIndex={tabIndex}
            pickerWidth={pickerWidth}
            pickerStyle={pickerStyle}
            allowSameEndDate={allowSameEndDate}
          />
        );
    }
  }


  private handleSelect = (e: React.SyntheticEvent<HTMLElement>,
    { value }: DatesRangePickerOnChangeData) => {
    const { dateFormat } = this.props;
    const {
      start,
      end,
    } = value;

    this.setState({
      inputStart: start,
      inputEnd: end
    }, () => this.state.mode !== 'day' && this.switchToNextMode());

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

  private setYear = (e: React.SyntheticEvent<HTMLElement>, { value }: BasePickerOnChangeData): void => {
    this.setState({
      displayYear: value.year
    }, () => this.switchToNextMode());
  }

  private setMonth = (e: React.SyntheticEvent<HTMLElement>, { value }: BasePickerOnChangeData): void => {
    const {
      year,
      month
    } = value;

    this.setState({
      displayYear: year,
      displayMonth: month
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
      inputEnd: end
    });

    this.props.onChange(e, data);
  }
}

export default DatesRangeInput;

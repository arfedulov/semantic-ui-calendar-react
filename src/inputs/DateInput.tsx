import isBoolean from 'lodash/isBoolean';
import isNil from 'lodash/isNil';
import invoke from 'lodash/invoke';
import moment, { Moment } from 'moment';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import CustomPropTypes from '../lib/CustomPropTypes';
import {
  BasePickerOnChangeData,
} from '../pickers/BasePicker';
import DayPicker from '../pickers/dayPicker/DayPicker';
import MonthPicker from '../pickers/monthPicker/MonthPicker';
import YearPicker from '../pickers/YearPicker';
import InputView from '../views/InputView';
import BaseInput, {
  BaseInputProps,
  BaseInputState,
  DateRelatedProps,
  DisableValuesProps,
  EnableValuesProps,
  MinMaxValueProps,
  MultimodeProps,
  MarkedValuesProps,
} from './BaseInput';

import {
  tick,
} from '../lib';
import {
  buildValue,
  parseArrayOrValue,
  parseValue,
  dateValueToString,
} from './parse';
import {
  getDisabledMonths, getDisabledYears,
} from './shared';

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

export interface DateInputProps extends
  BaseInputProps,
  DateRelatedProps,
  MultimodeProps,
  DisableValuesProps,
  EnableValuesProps,
  MarkedValuesProps,
  MinMaxValueProps {
  /** Display mode to start. */
  startMode?: CalendarMode;
}

export interface DateInputOnChangeData extends DateInputProps {
  value: string;
}

interface DateInputState extends BaseInputState {
  mode: CalendarMode;
  year: number;
  month: number;
  date: number;
}

interface Dateparams {
  year: number;
  month: number;
  date: number;
}

class DateInput extends BaseInput<DateInputProps, DateInputState> {
  /**
   * Component responsibility:
   *  - parse input value
   *  - handle underlying picker change
   */
  public static readonly defaultProps = {
    ...BaseInput.defaultProps,
    dateFormat: 'DD-MM-YYYY',
    startMode: 'day',
    preserveViewMode: true,
    icon: 'calendar',
  };

  public static readonly propTypes = {
    /** Currently selected value. */
    value: PropTypes.string.isRequired,
    /** Moment date formatting string. */
    dateFormat: PropTypes.string,
    /** Date to display initially when no date is selected. */
    initialDate: PropTypes.oneOfType([
      PropTypes.string,
      CustomPropTypes.momentObj,
      PropTypes.instanceOf(Date),
    ]),
    /** Date or list of dates that are displayed as disabled. */
    disable: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
      CustomPropTypes.momentObj,
      PropTypes.arrayOf(CustomPropTypes.momentObj),
      PropTypes.instanceOf(Date),
      PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    ]),
    /** Date or list of dates that are enabled (the rest are disabled). */
    enable: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
      CustomPropTypes.momentObj,
      PropTypes.arrayOf(CustomPropTypes.momentObj),
      PropTypes.instanceOf(Date),
      PropTypes.arrayOf(PropTypes.instanceOf(Date)),
    ]),
    /** Maximum date that can be selected. */
    maxDate: PropTypes.oneOfType([
      PropTypes.string,
      CustomPropTypes.momentObj,
      PropTypes.instanceOf(Date),
    ]),
    /** Minimum date that can be selected. */
    minDate: PropTypes.oneOfType([
      PropTypes.string,
      CustomPropTypes.momentObj,
      PropTypes.instanceOf(Date),
    ]),
    /** Preserve viewmode on focus? */
    preserveViewMode: PropTypes.bool,
    /** Display mode to start. */
    startMode: PropTypes.oneOf([
      'year', 'month', 'day',
    ]),
    /** If true, popup closes after selecting a date-time. */
    closable: PropTypes.bool,
    /**
     * Called on clear.
     *
     * @param {SyntheticEvent} event - React's original SyntheticEvent.
     * @param {object} data - All props and proposed value.
     */
    onClear: PropTypes.func,
    /** Using the clearable setting will let users remove their selection from a calendar. */
    clearable: PropTypes.bool,
    /** Optional Icon to display inside the clearable Input. */
    clearIcon: PropTypes.any,
    /** Duration of the CSS transition animation in milliseconds. */
    duration: PropTypes.number,
    /** Named animation event to used. Must be defined in CSS. */
    animation: PropTypes.string,
    marked: PropTypes.oneOfType([
      CustomPropTypes.momentObj,
      CustomPropTypes.dateObject,
      PropTypes.arrayOf(CustomPropTypes.momentObj),
      PropTypes.arrayOf(CustomPropTypes.dateObject),
    ]),
    markColor: PropTypes.string,
    /** Moment date localization. */
    localization: PropTypes.string,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    iconPosition: PropTypes.oneOf(['left', 'right']),
    hideMobileKeyboard: PropTypes.bool,
  };

  constructor(props: DateInputProps) {
    super(props);
    const parsedValue = parseValue(props.value, props.dateFormat, props.localization);
    this.state = {
      mode: props.startMode,
      popupIsClosed: true,
      year: parsedValue ? parsedValue.year() : undefined,
      month: parsedValue ? parsedValue.month() : undefined,
      date: parsedValue ? parsedValue.date() : undefined,
    };
  }

  public componentDidUpdate = (prevProps: DateInputProps) => {
    // update internal date if ``value`` prop changed and successuffly parsed
    if (prevProps.value !== this.props.value) {
      const parsed = parseValue(this.props.value, this.props.dateFormat, this.props.localization);
      if (parsed) {
        this.setState({
          year: parsed.year(),
          month: parsed.month(),
          date: parsed.date(),
        });
      }
    }
  }

  public render() {
    const {
      value,
      dateFormat,
      initialDate,
      disable,
      enable,
      maxDate,
      minDate,
      preserveViewMode,
      startMode,
      closable,
      markColor,
      marked,
      localization,
      onChange,
      ...rest
    } = this.props;

    return (
      <InputView
        closePopup={this.closePopup}
        openPopup={this.openPopup}
        popupIsClosed={this.state.popupIsClosed}
        onMount={this.onInputViewMount}
        onFocus={this.onFocus}
        onChange={this.onInputValueChange}
        {...rest}
        renderPicker={() => this.getPicker()}
        value={dateValueToString(value, dateFormat, localization)}
      />
    );
  }

  private parseInternalValue(): Moment {
    /*
      Creates moment instance from values stored in component's state
      (year, month, date) in order to pass this moment instance to
      underlying picker.
      Return undefined if none of these state fields has value.
    */
    const {
      year,
      month,
      date,
    } = this.state;
    if (!isNil(year) || !isNil(month) || !isNil(date)) {
      return moment({ year, month, date });
    }
  }

  private getPicker = () => {
    const {
      value,
      initialDate,
      dateFormat,
      disable,
      minDate,
      maxDate,
      enable,
      inline,
      marked,
      markColor,
      localization,
      tabIndex,
      pickerWidth,
      pickerStyle,
    } = this.props;
    const pickerProps = {
      isPickerInFocus: this.isPickerInFocus,
      isTriggerInFocus: this.isTriggerInFocus,
      inline,
      onCalendarViewMount: this.onCalendarViewMount,
      closePopup: this.closePopup,
      tabIndex,
      pickerWidth,
      pickerStyle,
      onChange: this.handleSelect,
      onHeaderClick: this.switchToPrevMode,
      initializeWith: buildValue(this.parseInternalValue(), initialDate, localization, dateFormat),
      value: buildValue(value, null, localization, dateFormat, null),
      enable: parseArrayOrValue(enable, dateFormat, localization),
      minDate: parseValue(minDate, dateFormat, localization),
      maxDate: parseValue(maxDate, dateFormat, localization),
      localization,
    };
    const disableParsed = parseArrayOrValue(disable, dateFormat, localization);
    const markedParsed = parseArrayOrValue(marked, dateFormat, localization);
    const { mode } = this.state;
    if (mode === 'year') {
      return (
        <YearPicker
          {...pickerProps}
          disable={getDisabledYears(disableParsed)}
        />
      );
    }
    if (mode === 'month') {
      return (
        <MonthPicker
          {...pickerProps}
          hasHeader
          disable={getDisabledMonths(disableParsed)}
        />
      );
    }

    return <DayPicker {...pickerProps} disable={disableParsed} marked={markedParsed} markColor={markColor} />;
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

  private onFocus = (): void => {
    if (!this.props.preserveViewMode) {
      this.setState({ mode: this.props.startMode });
    }
  }

  private handleSelect = (e, { value }: BasePickerOnChangeData) => {
    if (this.state.mode === 'day' && this.props.closable) {
      this.closePopup();
    }
    this.setState((prevState) => {
      const {
        mode,
      } = prevState;
      if (mode === 'day') {
        const outValue = moment(value).format(this.props.dateFormat);
        invoke(this.props, 'onChange', e, { ...this.props, value: outValue });
      }

      return {
        year: value.year,
        month: value.month,
        date: value.date,
      };
    }, () => this.state.mode !== 'day' && this.switchToNextMode());
  }

  /** Keeps internal state in sync with input field value. */
  private onInputValueChange = (e, { value }) => {
    const parsedValue = moment(value, this.props.dateFormat);
    if (parsedValue.isValid()) {
      this.setState({
        year: parsedValue.year(),
        month: parsedValue.month(),
        date: parsedValue.date(),
      });
    }
    invoke(this.props, 'onChange', e, { ...this.props, value });
  }
}

export default DateInput;

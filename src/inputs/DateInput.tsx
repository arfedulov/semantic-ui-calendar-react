import * as _ from 'lodash';
import * as moment from 'moment';
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
} from './BaseInput';

import {
  tick,
} from '../lib';
import {
  chooseValue,
  dateValueToString,
  getInitializer,
  parseArrayOrValue,
  parseValue,
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
    dateFormat: 'DD-MM-YYYY',
    startMode: 'day',
    preserveViewMode: true,
    inline: false,
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
  };

  constructor(props: DateInputProps) {
    super(props);
    const parsedValue = parseValue(props.value, props.dateFormat);
    this.state = {
      mode: props.startMode,
      popupIsClosed: true,
      year: parsedValue ? parsedValue.year() : undefined,
      month: parsedValue ? parsedValue.month() : undefined,
      date: parsedValue ? parsedValue.date() : undefined,
    };
  }

  public render() {
    const {
      value,
      icon,
      dateFormat,
      initialDate,
      disable,
      enable,
      maxDate,
      minDate,
      preserveViewMode,
      startMode,
      closable,
      ...rest
    } = this.props;

    return (
      <InputView
        closePopup={this.closePopup}
        openPopup={this.openPopup}
        popupIsClosed={this.state.popupIsClosed}
        onMount={this.onInputViewMount}
        icon={_.isBoolean(icon) && !icon ? undefined : icon}
        onFocus={this.onFocus}
        {...rest}
        render={(props) => this.getPicker(props)}
        value={dateValueToString(chooseValue(value, undefined), dateFormat)}
      />
    );
  }

  private getDateParams(): Dateparams {
    /*
      Return date params that are used for picker initialization.
      Return undefined if none of [ 'year', 'month', 'date' ]
      state fields defined.
    */
    const {
      year,
      month,
      date,
    } = this.state;
    if (!_.isNil(year) || !_.isNil(month) || !_.isNil(date)) {
      return { year, month, date };
    }
  }

  private getPicker = ({ tabIndex, pickerWidth, pickerStyle }) => {
    const {
      value,
      initialDate,
      dateFormat,
      disable,
      minDate,
      maxDate,
      enable,
      inline,
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
      initializeWith: getInitializer({ initialDate, dateFormat, dateParams: this.getDateParams() }),
      value: parseValue(chooseValue(value, initialDate), dateFormat),
      enable: parseArrayOrValue(enable, dateFormat),
      minDate: parseValue(minDate, dateFormat),
      maxDate: parseValue(maxDate, dateFormat),
    };
    const disableParsed = parseArrayOrValue(disable, dateFormat);
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

    return <DayPicker {...pickerProps} disable={disableParsed} />;
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
        _.invoke(this.props, 'onChange', e, { ...this.props, value: outValue });
      }

      return {
        year: value.year,
        month: value.month,
        date: value.date,
      };
    }, () => this.state.mode !== 'day' && this.switchToNextMode());
  }
}

export default DateInput;

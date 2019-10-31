import isNil from 'lodash/isNil';
import invoke from 'lodash/invoke';

import moment from 'moment';
import * as React from 'react';

import { tick } from '../lib';
import {
  BasePickerOnChangeData,
} from '../pickers/BasePicker';
import HourPicker from '../pickers/timePicker/HourPicker';
import MinutePicker from '../pickers/timePicker/MinutePicker';
import SecondPicker from '../pickers/timePicker/SecondPicker';
import InputView from '../views/InputView';
import BaseInput, {
  BaseInputProps,
  BaseInputPropTypes,
  BaseInputState,
  MultimodeProps,
  MultimodePropTypes,
  TimeRelatedProps,
  TimeRelatedPropTypes,
} from './BaseInput';
import {
  parseValue,
  TIME_FORMAT,
  TIME_FORMAT_WITH_SECONDS,
  buildValue,
} from './parse';

function getNextMode(currentMode, disableSecond) {
  if (currentMode === 'hour') {
    return 'minute';
  }

  if (currentMode === 'minute' && !disableSecond) {
    return 'second'
  }

  return 'hour';
}

type CalendarMode = 'hour' | 'minute' | 'second';

export type TimeInputProps =
  & BaseInputProps
  & MultimodeProps
  & TimeRelatedProps;

export type TimeInputOnChangeData = TimeInputProps;

interface TimeInputState extends BaseInputState {
  mode: CalendarMode;
}

class TimeInput extends BaseInput<TimeInputProps, TimeInputState> {
  /**
   * Component responsibility:
   *  - parse time input string
   *  - switch between modes ['hour', 'minute', 'second']
   *  - handle HourPicker/MinutePicker change (format { hour: number, minute: number, second: number } into output time string)
   */
  public static readonly defaultProps = {
    ...BaseInput.defaultProps,
    icon: 'time',
    timeFormat: '24',
    disableMinute: false,
    disableSecond: true,
  };

  public static readonly propTypes = {
    ...BaseInputPropTypes,
    ...MultimodePropTypes,
    ...TimeRelatedPropTypes,
  };

  constructor(props) {
    super(props);
    this.state = {
      mode: 'hour',
      popupIsClosed: true,
    };
  }

  public render() {
    const {
      value,
      timeFormat,
      closable,
      disableMinute,
      disableSecond,
      ...rest
    } = this.props;

    return (
      <InputView
        popupIsClosed={this.state.popupIsClosed}
        onMount={this.onInputViewMount}
        closePopup={this.closePopup}
        openPopup={this.openPopup}
        {...rest}
        value={value}
        renderPicker={() => this.getPicker()}
      />
    );
  }

  private handleSelect = (
      e: React.SyntheticEvent<HTMLElement>,
      { value }: BasePickerOnChangeData,
    ) => {

    tick(this.handleSelectUndelayed, e, { value });
  }

  private getTimeFormatConst = () => {
    const { disableSecond } = this.props;
    return disableSecond ? TIME_FORMAT : TIME_FORMAT_WITH_SECONDS;
  }

  private handleSelectUndelayed = (
      e: React.SyntheticEvent<HTMLElement>,
      { value }: BasePickerOnChangeData,
    ) => {

    const {
      hour,
      minute,
      second,
    } = value;
    const {
      timeFormat,
      disableMinute,
      disableSecond,
    } = this.props;

    let outputTimeString = '';
    if (this.state.mode === 'hour' && !isNil(hour)) {
      outputTimeString = moment({ hour }).format(this.getTimeFormatConst()[timeFormat]);
    } else if (!isNil(hour) && !isNil(minute) && !isNil(second)) {
      outputTimeString = moment({ hour, minute, second }).format(this.getTimeFormatConst()[timeFormat]);
    } else if (!isNil(hour) && !isNil(minute)) {
      outputTimeString = moment({ hour, minute }).format(this.getTimeFormatConst()[timeFormat]);
    }
    invoke(this.props, 'onChange', e, { ...this.props, value: outputTimeString });
    if (this.props.closable && ((this.state.mode === 'minute' && this.props.disableSecond) || this.state.mode === 'second')) {
      this.closePopup();
    }
    if (!disableSecond || !disableMinute) {
      this.switchToNextMode();
    }
  }

  private switchToNextMode = () => {
    const { disableSecond } = this.props;
    this.setState(({ mode }) => {
      return { mode: getNextMode(mode, disableSecond) };
    }, this.onModeSwitch);
  }

  private getPicker() {
    const {
      value,
      timeFormat,
      inline,
      localization,
      tabIndex,
      pickerStyle,
      pickerWidth,
      disableSecond,
    } = this.props;
    const currentValue = parseValue(value, this.getTimeFormatConst()[timeFormat], localization);
    const pickerProps = {
      inline,
      onCalendarViewMount: this.onCalendarViewMount,
      isPickerInFocus: this.isPickerInFocus,
      isTriggerInFocus: this.isTriggerInFocus,
      hasHeader: false,
      pickerWidth,
      pickerStyle,
      onHeaderClick: () => undefined,
      closePopup: this.closePopup,
      initializeWith: buildValue(currentValue, null, localization, this.getTimeFormatConst()[timeFormat]),
      value: buildValue(currentValue, null, this.getTimeFormatConst()[timeFormat], localization, null),
      onChange: this.handleSelect,
      timeFormat,
      tabIndex,
      localization,
      disableSecond,
    };
    if (this.state.mode === 'hour') {
      return <HourPicker {...pickerProps} />;
    }
    if (this.state.mode === 'minute') {
      return <MinutePicker {...pickerProps} />;
    }
    return <SecondPicker {...pickerProps} />;
  }
}

export default TimeInput;

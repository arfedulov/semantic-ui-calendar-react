import isNil from 'lodash/isNil';
import invoke from 'lodash/invoke';

import moment, { Moment } from 'moment';
import * as React from 'react';

import { tick, getRestProps } from '../lib';
import { Omit } from '../lib/types';
import {
  BasePickerOnChangeData,
} from '../pickers/BasePicker';
import {
  default as HourPicker,
  HourPickerProps,
} from '../pickers/timePicker/HourPicker';
import {
  default as MinutePicker,
  MinutePickerProps,
} from '../pickers/timePicker/MinutePicker';
import BaseInput, {
  BaseInputProps,
  BaseInputPropTypes,
  BaseInputPropsNames,
  BaseInputState,
  MultimodeProps,
  MultimodePropTypes,
  MultimodePropsNames,
  TimeRelatedProps,
  TimeRelatedPropTypes,
  TimeRelatedPropsNames,
} from './BaseInput';
import {
  parseValue,
  TIME_FORMAT,
  buildValue,
  pickInitialDate,
} from './parse';
import {
  getHourView,
  getMinuteView,
} from './shared';

function getNextMode(currentMode) {
  if (currentMode === 'hour') {
    return 'minute';
  }

  return 'hour';
}

type CalendarMode = 'hour' | 'minute';

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
   *  - switch between modes ['hour', 'minute']
   *  - handle HourPicker/MinutePicker change (format { hour: number, minute: number } into output time string)
   */
  public static readonly defaultProps = {
    ...BaseInput.defaultProps,
    icon: 'time',
    timeFormat: '24',
    disableMinute: false,
  };

  public static readonly propTypes = Object.assign({},
    BaseInputPropTypes,
    MultimodePropTypes,
    TimeRelatedPropTypes,
  );

  protected readonly hasHeader = false;

  private getHourView: (props: any) => React.ReactElement;
  private getMinuteView: (props: any) => React.ReactElement;

  constructor(props) {
    super(props);
    this.state = {
      mode: 'hour',
      popupIsClosed: true,
    };

    this.getHourView = getHourView.bind(this);
    this.getMinuteView = getMinuteView.bind(this);
  }

  protected onFocus = () => {
    return;
  }

  protected onInputValueChange = () => {
    return;
  }

  protected getInputViewValue = () => {
    const { value } = this.props;

    return value;
  }

  protected getUnusedProps = () => {
    // Return props which do not exist in TimeInputProps type
    return getRestProps(this.props, [
      ...BaseInputPropsNames,
      ...TimeRelatedPropsNames,
      ...MultimodePropsNames,
    ]);
  }

  protected parseInternalValue(): Moment {
    const {
      value,
      localization,
      timeFormat,
    } = this.props;

    return parseValue(value, TIME_FORMAT[timeFormat], localization);
  }

  protected getPicker = () => {
    const {
      value,
      timeFormat,
      inline,
      localization,
    } = this.props;

    const currentValue = parseValue(value, TIME_FORMAT[timeFormat], localization);

    type PickerPropsPartial = Omit<HourPickerProps & MinutePickerProps, 'renderView'>;

    const pickerProps: PickerPropsPartial = {
      inline,
      isPickerInFocus: this.isPickerInFocus,
      isTriggerInFocus: this.isTriggerInFocus,
      closePopup: this.closePopup,
      initializeWith: pickInitialDate({ ...this.props, value: this.parseInternalValue() }),
      value: buildValue(currentValue, null, TIME_FORMAT[timeFormat], localization, null),
      onChange: this.handleSelect,
      timeFormat,
      localization,
    };
    if (this.state.mode === 'hour') {
      return <HourPicker { ...pickerProps } renderView={ this.getHourView } />;
    }

    return <MinutePicker { ...pickerProps } renderView={ this.getMinuteView } />;
  }

  private handleSelect = (e: React.SyntheticEvent<HTMLElement>,
                          { value }: BasePickerOnChangeData) => {
    tick(this.handleSelectUndelayed, e, { value });
  }

  private handleSelectUndelayed = (e: React.SyntheticEvent<HTMLElement>,
                                   { value }: BasePickerOnChangeData) => {
    const {
      hour,
      minute,
    } = value;
    const {
      timeFormat,
      disableMinute,
    } = this.props;

    let outputTimeString = '';
    if (this.state.mode === 'hour' && !isNil(hour)) {
      outputTimeString = moment({ hour }).format(TIME_FORMAT[timeFormat]);
    } else if (!isNil(hour) && !isNil(minute)) {
      outputTimeString = moment({ hour, minute }).format(TIME_FORMAT[timeFormat]);
    }
    invoke(this.props, 'onChange', e, { ...this.props, value: outputTimeString });
    if (this.props.closable && this.state.mode === 'minute') {
      this.closePopup();
    }
    if (!disableMinute) {
      this.switchToNextMode();
    }
  }

  private switchToNextMode = () => {
    this.setState(({ mode }) => {
      return { mode: getNextMode(mode) };
    }, this.onModeSwitch);
  }
}

export default TimeInput;

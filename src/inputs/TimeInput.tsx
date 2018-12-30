import * as _ from 'lodash';
import * as moment from 'moment';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import { tick } from '../lib';
import {
  BasePickerOnChangeData,
} from '../pickers/BasePicker';
import HourPicker from '../pickers/timePicker/HourPicker';
import MinutePicker from '../pickers/timePicker/MinutePicker';
import InputView from '../views/InputView';
import BaseInput, {
  BaseInputProps,
  BaseInputState,
  MultimodeProps,
  TimeRelatedProps,
} from './BaseInput';
import {
  getInitializer,
  parseValue,
  TIME_FORMAT,
} from './parse';

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

export interface TimeInputOnChangeData extends TimeInputProps {
  value: string;
}

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
    icon: 'time',
    timeFormat: '24',
    disableMinute: false,
    inline: false,
  };

  public static readonly propTypes = {
    /** Currently selected value. */
    value: PropTypes.string,
    /** One of ["24", "AMPM", "ampm"] */
    timeFormat: PropTypes.oneOf([
      '24', 'AMPM', 'ampm',
    ]),
    /** If true, popup closes after selecting a date-time. */
    closable: PropTypes.bool,
    /** If true, minutes picker won't be shown after picking the hour. */
    disableMinute: PropTypes.bool,
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
  };

  constructor(props) {
    super(props);
    this.state = {
      mode: 'hour',
      popupIsClosed: false,
    };
  }

  public render() {
    const {
      value,
      timeFormat,
      closable,
      disableMinute,
      ...rest
    } = this.props;

    return (
      <InputView
        popupIsClosed={this.state.popupIsClosed}
        onMount={this.onInputViewMount}
        { ...rest }
        value={value}
        render={(pickerProps) => this.getPicker(pickerProps)}
      />
    );
  }

  private handleSelect = (e: React.SyntheticEvent,
                          { value }: BasePickerOnChangeData) => {
    tick(this.handleSelectUndelayed, e, { value });
  }

  private handleSelectUndelayed = (e: React.SyntheticEvent,
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
    if (this.state.mode === 'hour' && !_.isNil(hour)) {
      outputTimeString = moment({ hour }).format(TIME_FORMAT[timeFormat]);
    } else if (!_.isNil(hour) && !_.isNil(minute)) {
      outputTimeString = moment({ hour, minute }).format(TIME_FORMAT[timeFormat]);
    }
    _.invoke(this.props, 'onChange', e, { ...this.props, value: outputTimeString });
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

  private getPicker({ tabIndex }) {
    const {
      value,
      timeFormat,
      inline,
    } = this.props;
    const currentValue = parseValue(value, TIME_FORMAT[timeFormat]);
    const pickerProps = {
      inline,
      onCalendarViewMount: this.onCalendarViewMount,
      isPickerInFocus: this.isPickerInFocus,
      isTriggerInFocus: this.isTriggerInFocus,
      hasHeader: false,
      onHeaderClick: () => undefined,
      closePopup: this.closePopup,
      initializeWith: getInitializer({ initialDate: currentValue, dateFormat: TIME_FORMAT[timeFormat] }),
      value: currentValue,
      onChange: this.handleSelect,
      timeFormat,
      tabIndex,
    };
    if (this.state.mode === 'hour') {
      return <HourPicker { ...pickerProps } />;
    }

    return <MinutePicker { ...pickerProps } />;
  }
}

export default TimeInput;

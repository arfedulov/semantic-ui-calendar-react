import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as moment from 'moment';
import * as _ from 'lodash';

import InputView from '../views/InputView';
import HourPicker from '../pickers/timePicker/HourPicker';
import MinutePicker from '../pickers/timePicker/MinutePicker';
import BaseInput from './BaseInput';
import {
  parseValue,
  getInitializer,
  TIME_FORMAT,
} from './parse';
import { getUnhandledProps, tick } from '../lib';

function getNextMode(currentMode) {
  if (currentMode === 'hour') return 'minute';
  return 'hour';
}

class TimeInput extends BaseInput {
  /**
   * Component responsibility:
   *  - parse time input string
   *  - switch between modes ['hour', 'minute']
   *  - handle HourPicker/MinutePicker change (format { hour: number, minute: number } into output time string)
   */

  constructor(props) {
    super(props);
    this.state = {
      mode: 'hour',
    };
  }

  handleSelect = (e, { value }) => {
    tick(this.handleSelectUndelayed, e, { value });
  }

  handleSelectUndelayed = (e, { value }) => {
    const {
      hour,
      minute,
    } = value;
    const {
      timeFormat,
      disableMinute
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
    if(!disableMinute)
      this.switchToNextMode();
  }

  switchToNextMode = () => {
    this.setState(({ mode }) => {
      return { mode: getNextMode(mode) };
    }, this.onModeSwitch);
  }

  getPicker({ tabIndex }) {
    const {
      value,
      timeFormat,
      inline,
    } = this.props;
    const currentValue = parseValue(value, TIME_FORMAT[timeFormat]);
    const pickerProps = {
      inline: inline,
      onCalendarViewMount: this.onCalendarViewMount,
      isPickerInFocus: this.isPickerInFocus,
      isTriggerInFocus: this.isTriggerInFocus,
      hasHeader: false,
      closePopup: this.closePopup,
      initializeWith: getInitializer({ initialDate: currentValue, dateFormat: TIME_FORMAT[timeFormat] }),
      value: currentValue,
      onChange: this.handleSelect,
      timeFormat,
      tabIndex,
      // key: value, // seems like it works without reinstantiating picker every time value changes
    };
    if (this.state.mode === 'hour') {
      return <HourPicker { ...pickerProps } />;
    }
    return <MinutePicker { ...pickerProps } />;
  }

  render() {
    const {
      value,
    } = this.props;
    const rest = getUnhandledProps(TimeInput, this.props);
    return (
      <InputView
        popupIsClosed={this.state.popupIsClosed}
        icon="time"
        onMount={this.onInputViewMount}
        { ...rest }
        value={value}
        render={pickerProps => this.getPicker(pickerProps)}
      />
    );
  }
}

TimeInput.propTypes = {
  /** Currently selected value. */
  value: PropTypes.string,
  /** One of ["24", "AMPM", "ampm"] */
  timeFormat: PropTypes.oneOf([
    '24', 'AMPM', 'ampm',
  ]),
  /** If true, popup closes after selecting a date-time. */
  closable: PropTypes.bool,
  /** If true, minutes picker won't be shown after picking the hour. */
  disableMinute: PropTypes.bool
};

TimeInput.defaultProps = {
  timeFormat: '24',
  disableMinute: false
};

export default TimeInput;

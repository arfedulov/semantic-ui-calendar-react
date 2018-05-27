import React from 'react';
import { HourPicker, MinutePicker, PickerHeader } from '.';
import PropTypes from 'prop-types';
import moment from 'moment';

function TimePickerComponent(props) {
  const {
    selectedDate,
    onNextDayBtnClick,
    onPrevDayBtnClick,
    onHourClick,
    onMinuteClick,
    activeHour,
    activeMinute,
    mode
  } = props;

  if (mode === 'minute') {
    return (
      <React.Fragment>
        { selectedDate && (
          <PickerHeader
            width="3"
            includeDay
            activeDate={selectedDate}
            onNextBtnClick={onNextDayBtnClick}
            onPrevBtnClick={onPrevDayBtnClick} />
        ) }
        <MinutePicker
          hour={activeHour}
          activeMinute={activeMinute}
          onMinuteClick={onMinuteClick} />
      </React.Fragment>
    );
  } else {
    return (
      <React.Fragment>
        { selectedDate && (
          <PickerHeader
            width="4"
            includeDay
            activeDate={selectedDate}
            onNextBtnClick={onNextDayBtnClick}
            onPrevBtnClick={onPrevDayBtnClick} />
        ) }
        <HourPicker
          activeHour={activeHour}
          onHourClick={onHourClick} />
      </React.Fragment>
    );
  }
}

TimePickerComponent.propTypes = {
  /** (event, data) => {} */
  onHourClick: PropTypes.func.isRequired,
  /** (event, data) => {} */
  onMinuteClick: PropTypes.func.isRequired,
  /** Show date in header if given */
  selectedDate: PropTypes.instanceOf(moment),
  activeHour: PropTypes.string,
  activeMinute: PropTypes.string,
  onNextDayBtnClick: PropTypes.func,
  onPrevDayBtnClick: PropTypes.func,
  mode: PropTypes.string
};

TimePickerComponent.defaultProps = {
  mode: 'hour'
};

export default TimePickerComponent;
export {
  TimePickerComponent
};
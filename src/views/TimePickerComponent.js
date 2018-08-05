import React from 'react';
import { HourPicker, MinutePicker, PickerHeader } from '.';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Table } from 'semantic-ui-react';

function TimePickerComponent(props) {
  const {
    activeDate,
    showDate,
    handleHeaderTimeClick,
    showNextDay,
    showPrevDay,
    onHourClick,
    onMinuteClick,
    activeHour,
    activeMinute,
    mode
  } = props;

  const headerWidth = mode === 'minute'? '3' : mode === 'hour'? '4' : '7';

  if (mode === 'minute') {
    return (
      <Table
        unstackable
        celled
        textAlign="center">
        { showDate && (
          <PickerHeader
            onDateClick={handleHeaderTimeClick}
            onNextBtnClick={showNextDay}
            onPrevBtnClick={showPrevDay}
            activeDate={activeDate}
            includeDay
            width={headerWidth} />
        ) }
        <MinutePicker
          hour={activeHour}
          activeMinute={activeMinute}
          onMinuteClick={onMinuteClick} />
      </Table>
    );
  } else {
    return (
      <Table
        unstackable
        celled
        textAlign="center">
        { showDate && (
          <PickerHeader
            onDateClick={handleHeaderTimeClick}
            onNextBtnClick={showNextDay}
            onPrevBtnClick={showPrevDay}
            activeDate={activeDate}
            includeDay
            width={headerWidth} />
        ) }
        <HourPicker
          activeHour={activeHour}
          onHourClick={onHourClick} />
      </Table>
    );
  }
}

TimePickerComponent.propTypes = {
  /** (event, data) => {} */
  onHourClick: PropTypes.func.isRequired,
  /** (event, data) => {} */
  onMinuteClick: PropTypes.func.isRequired,
  showDate: PropTypes.bool,
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
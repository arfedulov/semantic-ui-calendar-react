import React from 'react';
import { Picker } from './Picker.js';

function DateTimePicker(props) {
  return <Picker { ...props } pickDateTime />;
}

export default DateTimePicker;
export {
  DateTimePicker
};
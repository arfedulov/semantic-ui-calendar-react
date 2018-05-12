import React from 'react';
import { Picker } from './Picker.js';

function DateTimePicker(props) {
  return <Picker pickDateTime { ...props } />;
}

export default DateTimePicker;
export {
  DateTimePicker
};
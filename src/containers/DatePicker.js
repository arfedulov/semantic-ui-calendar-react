import React from 'react';
import { Picker } from './Picker.js';

function DatePicker(props) {
  return <Picker pickDate { ...props } />;
}

export default DatePicker;
export {
  DatePicker
};
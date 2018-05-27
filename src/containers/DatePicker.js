import React from 'react';
import { Picker } from './Picker.js';

function DatePicker(props) {
  return <Picker { ...props } pickDate />;
}

export default DatePicker;
export {
  DatePicker
};
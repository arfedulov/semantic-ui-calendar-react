import React from 'react';
import { Picker } from './Picker.js';

function TimePicker(props) {
  return <Picker pickTime { ...props } />;
}

export default TimePicker;
export {
  TimePicker
};
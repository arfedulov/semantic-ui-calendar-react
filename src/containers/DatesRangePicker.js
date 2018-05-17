import React from 'react';
import { Picker } from './Picker.js';

function DatesRangePicker(props) {
  return <Picker pickDatesRange { ...props } />;
}

export default DatesRangePicker;
export {
  DatesRangePicker
};
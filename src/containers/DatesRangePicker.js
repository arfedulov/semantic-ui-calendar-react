import React from 'react';
import { Picker } from './Picker.js';

function DatesRangePicker(props) {
  return <Picker { ...props } pickDatesRange />;
}

export default DatesRangePicker;
export {
  DatesRangePicker
};
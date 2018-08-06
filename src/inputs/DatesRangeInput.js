import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

import InputView from '../views/InputView';
import {
  getInitializer,
} from './parse';
import { getUnhandledProps } from '../lib';
import DatesRangePicker from '../pickers/dayPicker/DatesRangePicker';
import BaseInput from './BaseInput';

const DATES_SEPARATOR = ' - ';

function cleanDate(inputString, dateFormat) {
  const formattedDateLength = moment().format(dateFormat).length;
  return inputString.trim().slice(0, formattedDateLength);
}

/**
 * Extract start and end dates from input string.
 * Return { start: Moment|undefined, end: Moment|undefined }
 * @param {string} inputString Row input string from user
 * @param {string} dateFormat Moment formatting string
 */
function parseDatesRange(inputString, dateFormat) {
  // dates range is "startDate - endDate"
  const dates = inputString.split(DATES_SEPARATOR)
    .map(date => cleanDate(date, dateFormat));
  const result = {};
  let start;
  let end;

  start = moment(dates[0], dateFormat);
  if (dates.length === 2) {
    end = moment(dates[1], dateFormat);
  }
  if (start && start.isValid()) {
    result.start = start;
  }
  if (end && end.isValid()) {
    result.end = end;
  }
  return result;
}

class DatesRangeInput extends BaseInput {
  /**
   * Component responsibility:
   *  - parse input value (start: Moment, end: Moment)
   *  - handle DayPicker change (format {start: Moment, end: Moment} into
   *    string 'start - end')
   */

  constructor(props) {
    super(props);
    this.state = {};
  }
  
  handleSelect = (e, { value }) => {
    const { dateFormat } = this.props;
    const {
      start,
      end,
    } = value;
    let outputString = '';
    if (start && end) {
      outputString = `${start.format(dateFormat)}${DATES_SEPARATOR}${end.format(dateFormat)}`;
    } else if (start) {
      outputString = `${start.format(dateFormat)}${DATES_SEPARATOR}`;
    }
    _.invoke(this.props, 'onChange', e, { ...this.props, value: outputString });
    if (this.props.closable && start && end) {
      this.closePopup();
    }
  }

  render() {
    const {
      value,
      initialDate,
      dateFormat,
      minDate,
      maxDate,
    } = this.props;
    const rest = getUnhandledProps(DatesRangeInput, this.props);
    const {
      start,
      end,
    } = parseDatesRange(value, dateFormat);
    return (
      <InputView
        popupIsClosed={this.state.popupIsClosed}
        onPopupUnmount={this.onPopupClose}
        icon="calendar"
        { ...rest }
        value={value}>
        <DatesRangePicker
          onChange={this.handleSelect}
          dateFormat={dateFormat}
          initializeWith={getInitializer({ initialDate, dateFormat })}
          start={start}
          end={end}
          minDate={minDate}
          maxDate={maxDate} />
      </InputView>
    );
  }
}

DatesRangeInput.propTypes = {
  /** Currently selected value. */
  value: PropTypes.string,
  /** Moment date formatting string. */
  dateFormat: PropTypes.string,
  /** Date to display initially when no date is selected. */
  initialDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(moment),
    PropTypes.instanceOf(Date),
  ]),
  /** Maximum date that can be selected. */
  maxDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(moment),
    PropTypes.instanceOf(Date),
  ]),
  /** Minimum date that can be selected. */
  minDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(moment),
    PropTypes.instanceOf(Date),
  ]),
  /** If true, popup closes after selecting a date-time. */
  closable: PropTypes.bool,
};

DatesRangeInput.defaultProps = {
  dateFormat: 'YYYY-MM-DD',
};

export default DatesRangeInput;

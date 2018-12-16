import * as _ from 'lodash';
import * as moment from 'moment';
import { Moment } from 'moment';
import * as PropTypes from 'prop-types';
import * as React from 'react';

import InputView from '../views/InputView';
import {
  getInitializer,
  parseValue,
} from './parse';

import DatesRangePicker from '../pickers/dayPicker/DatesRangePicker';
import BaseInput, {
  BaseInputProps,
  BaseInputState,
  DateRelatedProps,
  MinMaxValueProps,
} from './BaseInput';

const DATES_SEPARATOR = ' - ';

function cleanDate(inputString: string, dateFormat: string): string {
  const formattedDateLength = moment().format(dateFormat).length;

  return inputString.trim().slice(0, formattedDateLength);
}

interface Range {
  start?: Moment;
  end?: Moment;
}

/**
 * Extract start and end dates from input string.
 * Return { start: Moment|undefined, end: Moment|undefined }
 * @param {string} inputString Row input string from user
 * @param {string} dateFormat Moment formatting string
 */
function parseDatesRange(inputString: string, dateFormat: string): Range {
  // dates range is "startDate - endDate"
  const dates = inputString.split(DATES_SEPARATOR)
    .map((date) => cleanDate(date, dateFormat));
  const result: Range = {};
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

interface DatesRangeInputProps extends
  BaseInputProps,
  DateRelatedProps,
  MinMaxValueProps {
  //
}

class DatesRangeInput extends BaseInput<DatesRangeInputProps, BaseInputState> {
  /**
   * Component responsibility:
   *  - parse input value (start: Moment, end: Moment)
   *  - handle DayPicker change (format {start: Moment, end: Moment} into
   *    string 'start - end')
   */
  public static readonly defaultProps = {
    dateFormat: 'DD-MM-YYYY',
    inline: false,
  };

  public static readonly propTypes = {
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

  constructor(props) {
    super(props);
    this.state = {
      popupIsClosed: false,
    };
  }

  public render() {
    const {
      value,
      icon,
      dateFormat,
      initialDate,
      maxDate,
      minDate,
      closable,
      ...rest
    } = this.props;

    const {
      start,
      end,
    } = parseDatesRange(value, dateFormat);

    return (
      <InputView
        popupIsClosed={this.state.popupIsClosed}
        icon={_.isBoolean(icon) && !icon ? undefined : icon}
        { ...rest }
        value={value}
        onMount={this.onInputViewMount}
        render={(pickerProps) =>
          (<DatesRangePicker
            {...pickerProps}
            isPickerInFocus={this.isPickerInFocus}
            isTriggerInFocus={this.isTriggerInFocus}
            inline={this.props.inline}
            onCalendarViewMount={this.onCalendarViewMount}
            closePopup={this.closePopup}
            onChange={this.handleSelect}
            dateFormat={dateFormat}
            initializeWith={getInitializer({ initialDate, dateFormat })}
            start={start}
            end={end}
            minDate={parseValue(minDate, dateFormat)}
            maxDate={parseValue(maxDate, dateFormat)} />)
        }
      />
    );
  }

  private handleSelect = (e, { value }) => {
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
}

export default DatesRangeInput;

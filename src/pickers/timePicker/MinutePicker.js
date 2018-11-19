import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

import MinuteView from '../../views/MinuteView';
import { getUnhandledProps } from '../../lib';
import {
  buildTimeStringWithSuffix,
  isNextPageAvailable,
  isPrevPageAvailable,
  getCurrentDate,
} from './sharedFunctions';
import BasePicker from '../BasePicker';

const MINUTES_STEP = 5;
const MINUTES_ON_PAGE = 12;
const PAGE_WIDTH = 3;

class MinutePicker extends BasePicker {
  constructor(props) {
    super(props);
    this.state = {
      /* moment instance */
      date: props.initializeWith.clone(),
    };
    this.PAGE_WIDTH = PAGE_WIDTH;
  }

  buildCalendarValues() {
    /*
      Return array of minutes (strings) like ['16:15', '16:20', ...]
      that used to populate calendar's page.
    */
    const hour = this.state.date.hour() < 10? '0' + this.state.date.hour().toString() : this.state.date.hour().toString();
    return _.range(0, 60, MINUTES_STEP)
      .map(minute => `${minute < 10? '0' : ''}${minute}`)
      .map(minute => buildTimeStringWithSuffix(hour, minute, this.props.timeFormat));
  }

  getSelectableCellPositions = () => {
    return _.range(0, MINUTES_ON_PAGE);
  }

  getInitialDatePosition = () => {
    return 0;
  }

  getActiveCellPosition() {
    /*
      Return position of a minute that should be displayed as active
      (position in array returned by `this.buildCalendarValues`).
    */
    const { value } = this.props;
    if (value && value.isSame(this.state.date, 'date')) {
      return Math.floor(this.props.value.minutes() / MINUTES_STEP);
    }
  }

  isNextPageAvailable() {
    return isNextPageAvailable(this.state.date, this.props.maxDate);
  }

  isPrevPageAvailable() {
    return isPrevPageAvailable(this.state.date, this.props.minDate);
  }

  getCurrentDate() {
    /* Return currently selected month, date and year(string) to display in calendar header. */
    return getCurrentDate(this.state.date);
  }

  handleChange = (e, { value }) => {
    const data = {
      year: this.state.date.year(),
      month: this.state.date.month(),
      date: this.state.date.date(),
      hour: this.state.date.hour(),
      minute: this.buildCalendarValues().indexOf(value) * MINUTES_STEP,
    };
    _.invoke(this.props, 'onChange', e, { ...this.props, value: data });
  }

  switchToNextPage = () => {
    this.setState(({ date }) => {
      const nextDate = date.clone();
      nextDate.add(1, 'day');
      return { date: nextDate };
    });
  }

  switchToPrevPage = () => {
    this.setState(({ date }) => {
      const prevDate = date.clone();
      prevDate.subtract(1, 'day');
      return { date: prevDate };
    });
  }

  render() {
    const rest = getUnhandledProps(MinutePicker, this.props);
    return (
      <MinuteView
        { ...rest }
        minutes={this.buildCalendarValues()}
        onNextPageBtnClick={this.switchToNextPage}
        onPrevPageBtnClick={this.switchToPrevPage}
        onMinuteClick={this.handleChange}
        hovered={this.state.hoveredCellPosition}
        onCellHover={this.onHoveredCellPositionChange}
        onBlur={this.handleBlur}
        inline={this.props.inline}
        onMount={this.props.onCalendarViewMount}
        hasNextPage={this.isNextPageAvailable()}
        hasPrevPage={this.isPrevPageAvailable()}
        currentDate={this.getCurrentDate()}
        active={this.getActiveCellPosition()} />
    );
  }
}

MinutePicker.propTypes = {
  /** Called after minute is selected. */
  onChange: PropTypes.func.isRequired,
  /** A value for initializing minute picker's state. */
  initializeWith: PropTypes.instanceOf(moment).isRequired,
  /** Currently selected minute. */
  value: PropTypes.instanceOf(moment),
  /** Array of disabled dates. */
  disable: PropTypes.arrayOf(
    PropTypes.instanceOf(moment)
  ),
  /** Minimal date that could be selected. */
  minDate: PropTypes.instanceOf(moment),
  /** Maximal date that could be selected. */
  maxDate: PropTypes.instanceOf(moment),
  /** Time format. */
  timeFormat: PropTypes.oneOf([
    'ampm', 'AMPM', '24',
  ]),
  isPickerInFocus: PropTypes.func,
  isTriggerInFocus: PropTypes.func,
  onCalendarViewMount: PropTypes.func,
  /** Force popup to close. */
  closePopup: PropTypes.func,
  inline: PropTypes.bool,
};

MinutePicker.defaultProps = {
  timeFormat: '24',
};

export default MinutePicker;

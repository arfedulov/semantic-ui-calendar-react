import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

import DayView from '../../views/DayView';
import { WEEKS_TO_DISPLAY } from '../../views/DayView';
import { getUnhandledProps } from '../../lib';
import {
  buildDays,
  getDisabledDays,
  isNextPageAvailable,
  isPrevPageAvailable,
} from './sharedFunctions';

export const DAYS_ON_PAGE = WEEKS_TO_DISPLAY * 7;

class DayPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /* moment instance */
      date: props.initializeWith.clone(),
    };
  }

  buildDays() {
    /*
      Return array of dates (strings) like ['31', '1', ...]
      that used to populate calendar's page.
    */
    return buildDays(this.state.date, DAYS_ON_PAGE);
  }

  getActiveDayPosition() {
    /*
      Return position of a date that should be displayed as active
      (position in array returned by `this.buildDays`).
    */
    if (this.props.value && this.props.value.isSame(this.state.date, 'month')) {
      const disabledPositions = this.getDisabledDaysPositions();
      const active = this.buildDays()
        .map((day, i) => _.includes(disabledPositions, i)? undefined : day)
        .indexOf(this.props.value.date().toString());
      if (active >= 0) {
        return active;
      }
    }
  }

  getDisabledDaysPositions() {
    /*
      Return position numbers of dates that should be displayed as disabled
      (position in array returned by `this.buildDays`).
    */
    const {
      disable,
      maxDate,
      minDate,
    } = this.props;
    return getDisabledDays(disable, maxDate, minDate, this.state.date, DAYS_ON_PAGE);
  }

  isNextPageAvailable() {
    const {
      maxDate,
    } = this.props;
    return isNextPageAvailable(this.state.date, maxDate);
  }

  isPrevPageAvailable() {
    const {
      minDate,
    } = this.props;
    return isPrevPageAvailable(this.state.date, minDate);
  }

  getCurrentDate() {
    /* Return currently selected year and month(string) to display in calendar header. */
    return this.state.date.format('MMMM YYYY');
  }

  handleChange = (e, { value }) => {
    // `value` is selected date(string) like '31' or '1'
    const result = { 
      year: this.state.date.year(),
      month: this.state.date.month(),
      date: parseInt(value),
    };
    
    _.invoke(this.props, 'onChange', e, { ...this.props, value: result });
  }

  switchToNextPage = () => {
    this.setState(({ date }) => {
      const nextDate = date.clone();
      nextDate.add(1, 'month');
      return { date: nextDate };
    });
  }

  switchToPrevPage = () => {
    this.setState(({ date }) => {
      const prevDate = date.clone();
      prevDate.subtract(1, 'month');
      return { date: prevDate };
    });
  }

  render() {
    const rest = getUnhandledProps(DayPicker, this.props);
    return (
      <DayView
        { ...rest }
        days={this.buildDays()}
        hasNextPage={this.isNextPageAvailable()}
        hasPrevPage={this.isPrevPageAvailable()}
        onNextPageBtnClick={this.switchToNextPage}
        onPrevPageBtnClick={this.switchToPrevPage}
        onDayClick={this.handleChange}
        currentDate={this.getCurrentDate()}
        disabled={this.getDisabledDaysPositions()}
        active={this.getActiveDayPosition()} />
    );
  }
}

DayPicker.propTypes = {
  /** Called after day is selected. */
  onChange: PropTypes.func.isRequired,
  /** A value for initializing day picker's state. */
  initializeWith: PropTypes.instanceOf(moment).isRequired,
  /** Currently selected day. */
  value: PropTypes.instanceOf(moment),
  /** Array of disabled days. */
  disable: PropTypes.arrayOf(
    PropTypes.instanceOf(moment)
  ),
  /** Minimal date that could be selected. */
  minDate: PropTypes.instanceOf(moment),
  /** Maximal date that could be selected. */
  maxDate: PropTypes.instanceOf(moment),
};

export default DayPicker;

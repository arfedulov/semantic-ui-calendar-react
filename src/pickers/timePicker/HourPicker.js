import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

import HourView from '../../views/HourView';
import { getUnhandledProps } from '../../lib';
import {
  buildTimeStringWithSuffix,
  isNextPageAvailable,
  isPrevPageAvailable,
  getCurrentDate,
} from './sharedFunctions';
import BasePicker from '../BasePicker';

class HourPicker extends BasePicker {
  constructor(props) {
    super(props);
    this.state = {
      /* moment instance */
      date: props.initializeWith.clone(),
    };
  }

  buildHours() {
    /*
      Return array of hours (strings) like ['16:00', '17:00', ...]
      that used to populate calendar's page.
    */
    return _.range(0, 24).map((h) => {
      return `${h < 10? '0' : ''}${h}`;
    }).map(hour => buildTimeStringWithSuffix(hour, '00', this.props.timeFormat));
  }

  getInitialDatePosition = () => {
    return 0;
  }

  getActiveCellPosition() {
    /*
      Return position of an hour that should be displayed as active
      (position in array returned by `this.buildHours`).
    */
    const { value } = this.props;
    if (value && value.isSame(this.state.date, 'date')) {
      return this.props.value.hour();
    }
  }

  isNextPageAvailable() {
    return isNextPageAvailable(this.state.date, this.props.maxDate);
  }

  isPrevPageAvailable() {
    return isPrevPageAvailable(this.state.date, this.props.minDate);
  }

  getDisabledHoursPositions() {
    /*
      Return position numbers of hours that should be displayed as disabled
      (position in array returned by `this.buildHours`).
    */
    const {
      disable,
      minDate,
      maxDate,
    } = this.props;
    let disabledByDisable = [];
    let disabledByMaxDate = [];
    let disabledByMinDate = [];

    if (_.isArray(disable)) {
      disabledByDisable = _.concat(
        disabledByDisable,
        disable.filter(date => date.isSame(this.state.date, 'day'))
          .map(date => date.hour())
      );
    }
    if (minDate) {
      if (minDate.isSame(this.state.date, 'day')) {
        disabledByMinDate = _.concat(
          disabledByMinDate,
          _.range(0 , minDate.hour())
        );
      }
    }
    if (maxDate) {
      if (maxDate.isSame(this.state.date, 'day')) {
        disabledByMaxDate = _.concat(
          disabledByMaxDate,
          _.range(maxDate.hour() + 1, 24)
        );
      }
    }
    const result = _.sortBy(
      _.uniq(
        _.concat(disabledByDisable, disabledByMaxDate, disabledByMinDate)));
    if (result.length > 0) {
      return result;
    }
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
      hour: this.buildHours().indexOf(value),
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
    const rest = getUnhandledProps(HourPicker, this.props);
    return (
      <HourView
        { ...rest }
        hours={this.buildHours()}
        onNextPageBtnClick={this.switchToNextPage}
        onPrevPageBtnClick={this.switchToPrevPage}
        hasPrevPage={this.isPrevPageAvailable()}
        hasNextPage={this.isNextPageAvailable()}
        onHourClick={this.handleChange}
        hovered={this.state.hoveredCellPosition}
        onCellHover={this.onHoveredCellPositionChange}
        disabled={this.getDisabledHoursPositions()}
        active={this.getActiveCellPosition()}
        currentDate={this.getCurrentDate()} />
    );
  }
}

HourPicker.propTypes = {
  /** Called after hour is selected. */
  onChange: PropTypes.func.isRequired,
  /** A value for initializing hour picker's state. */
  initializeWith: PropTypes.instanceOf(moment).isRequired,
  /** Currently selected hour. */
  value: PropTypes.instanceOf(moment),
  /** Array of disabled hours. */
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
};

HourPicker.defaultProps = {
  timeFormat: '24',
};

export default HourPicker;

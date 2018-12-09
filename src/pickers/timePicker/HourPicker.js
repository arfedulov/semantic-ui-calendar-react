import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as moment from 'moment';
import * as _ from 'lodash';

import HourView from '../../views/HourView';
import { getUnhandledProps } from '../../lib';
import {
  buildTimeStringWithSuffix,
  isNextPageAvailable,
  isPrevPageAvailable,
  getCurrentDate,
} from './sharedFunctions';
import BasePicker from '../BasePicker';

const HOURS_ON_PAGE = 24;
const PAGE_WIDTH = 4;

class HourPicker extends BasePicker {
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
      Return array of hours (strings) like ['16:00', '17:00', ...]
      that used to populate calendar's page.
    */
    return _.range(0, 24).map((h) => {
      return `${h < 10? '0' : ''}${h}`;
    }).map(hour => buildTimeStringWithSuffix(hour, '00', this.props.timeFormat));
  }

  getSelectableCellPositions = () => {
    return _.filter(
      _.range(0, HOURS_ON_PAGE),
      h => !_.includes(this.getDisabledHoursPositions(), h),
    );
  }

  getInitialDatePosition = () => {
    return 0;
  }

  getActiveCellPosition() {
    /*
      Return position of an hour that should be displayed as active
      (position in array returned by `this.buildCalendarValues`).
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
      (position in array returned by `this.buildCalendarValues`).
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
      hour: this.buildCalendarValues().indexOf(value),
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
        hours={this.buildCalendarValues()}
        onNextPageBtnClick={this.switchToNextPage}
        onPrevPageBtnClick={this.switchToPrevPage}
        hasPrevPage={this.isPrevPageAvailable()}
        hasNextPage={this.isNextPageAvailable()}
        onHourClick={this.handleChange}
        onBlur={this.handleBlur}
        inline={this.props.inline}
        onMount={this.props.onCalendarViewMount}
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
  isPickerInFocus: PropTypes.func,
  isTriggerInFocus: PropTypes.func,
  onCalendarViewMount: PropTypes.func,
  /** Force popup to close. */
  closePopup: PropTypes.func,
  inline: PropTypes.bool,
};

HourPicker.defaultProps = {
  timeFormat: '24',
};

export default HourPicker;

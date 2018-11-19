import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

import MonthView from '../views/MonthView';
import { getUnhandledProps } from '../lib';
import BasePicker from './BasePicker';

const MONTHS_IN_YEAR = 12;
const PAGE_WIDTH = 3;

class MonthPicker extends BasePicker {
  /*
    Note:
      use it like this <MonthPicker key={someInputValue} />
      to make react create new instance when input value changes
  */
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
      Return array of months (strings) like ['Aug', 'Sep', ...]
      that used to populate calendar's page.
    */
    return moment.monthsShort();
  }

  getSelectableCellPositions = () => {
    return _.filter(
      _.range(0, MONTHS_IN_YEAR),
      m => !_.includes(this.getDisabledMonthsPositions(), m),
    );
  }

  getInitialDatePosition() {
    return this.state.date.month();
  }

  getActiveCellPosition() {
    /*
      Return position of a month that should be displayed as active
      (position in array returned by `this.buildCalendarValues`).
    */
    if (!_.isNil(this.props.value)) {
      if (this.props.value.year() === this.state.date.year()) {
        return this.props.value.month();
      }
    }
  }

  getDisabledMonthsPositions() {
    /*
      Return position numbers of months that should be displayed as disabled
      (position in array returned by `this.buildCalendarValues`).
    */
    let disabled = [];
    if (_.isArray(this.props.enable)) {
      const enabledMonthPositions = this.props.enable
        .filter(monthMoment => monthMoment.isSame(this.state.date, 'year'))
        .map(monthMoment => monthMoment.month());
      disabled = disabled.concat(
        _.range(0, MONTHS_IN_YEAR)
          .filter(monthPosition => !_.includes(enabledMonthPositions, monthPosition))
      );
    }
    if (_.isArray(this.props.disable)) {
      disabled = disabled.concat(
        this.props.disable
          .filter(monthMoment => monthMoment.year() === this.state.date.year())
          .map(monthMoment => monthMoment.month())
      );
    }
    if (!_.isNil(this.props.maxDate)) {
      if (this.props.maxDate.year() === this.state.date.year()) {
        disabled = disabled.concat(
          _.range(this.props.maxDate.month() + 1, MONTHS_IN_YEAR)
        );
      }
      if (this.props.maxDate.year() < this.state.date.year()) {
        disabled = _.range(0, MONTHS_IN_YEAR);
      }
    }
    if (!_.isNil(this.props.minDate)) {
      if (this.props.minDate.year() === this.state.date.year()) {
        disabled = disabled.concat(
          _.range(0, this.props.minDate.month())
        );
      }
      if (this.props.minDate.year() > this.state.date.year()) {
        disabled = _.range(0, MONTHS_IN_YEAR);
      }
    }
    if (disabled.length > 0) {
      return _.uniq(disabled);
    }
  }

  isNextPageAvailable() {
    const {
      maxDate,
      enable,
    } = this.props;
    if (_.isArray(enable)) {
      return _.some(enable, enabledMonth => enabledMonth.isAfter(this.state.date, 'year'));
    }
    if (_.isNil(maxDate)) return true;
    if (this.state.date.year() >= maxDate.year()) return false;
    return true;
  }

  isPrevPageAvailable() {
    const {
      minDate,
      enable,
    } = this.props;
    if (_.isArray(enable)) {
      return _.some(enable, enabledMonth => enabledMonth.isBefore(this.state.date, 'year'));
    }
    if (_.isNil(minDate)) return true;
    if (this.state.date.year() <= minDate.year()) return false;
    return true;
  }

  getCurrentYear() {
    /* Return current year(string) to display in calendar header. */
    return this.state.date.year().toString();
  }

  handleChange = (e, { value }) => {
    const year = parseInt(this.getCurrentYear());
    const month = this.buildCalendarValues().indexOf(value);
    _.invoke(this.props, 'onChange', e, { ...this.props, value: { year, month } });
  }

  switchToNextPage = () => {
    this.setState(({ date }) => {
      const nextDate = date.clone();
      nextDate.add(1, 'year');
      return { date: nextDate };
    });
  }

  switchToPrevPage = () => {
    this.setState(({ date }) => {
      const prevDate = date.clone();
      prevDate.subtract(1, 'year');
      return { date: prevDate };
    });
  }

  render() {
    const rest = getUnhandledProps(MonthPicker, this.props);
    return (
      <MonthView
        { ...rest }
        months={this.buildCalendarValues()}
        onMonthClick={this.handleChange}
        onCellHover={this.onHoveredCellPositionChange}
        onNextPageBtnClick={this.switchToNextPage}
        onPrevPageBtnClick={this.switchToPrevPage}
        hasPrevPage={this.isPrevPageAvailable()}
        hasNextPage={this.isNextPageAvailable()}
        onBlur={this.handleBlur}
        inline={this.props.inline}
        onMount={this.props.onCalendarViewMount}
        disabled={this.getDisabledMonthsPositions()}
        active={this.getActiveCellPosition()}
        hovered={this.state.hoveredCellPosition}
        currentYear={this.getCurrentYear()} />
    );
  }
}

MonthPicker.propTypes = {
  /** Called after month is selected. */
  onChange: PropTypes.func.isRequired,
  /** A value for initializing month picker's state. */
  initializeWith: PropTypes.instanceOf(moment).isRequired,
  /** Currently selected month. */
  value: PropTypes.instanceOf(moment),
  /** Array of disabled months. */
  disable: PropTypes.arrayOf(
    PropTypes.instanceOf(moment)
  ),
  /** Array of enabled months. */
  enable: PropTypes.arrayOf(
    PropTypes.instanceOf(moment)
  ),
  /** Minimal month that could be selected. */
  minDate: PropTypes.instanceOf(moment),
  /** Maximal month that could be selected. */
  maxDate: PropTypes.instanceOf(moment),
  /** Force popup to close. */
  closePopup: PropTypes.func,
  isPickerInFocus: PropTypes.func,
  isTriggerInFocus: PropTypes.func,
  onCalendarViewMount: PropTypes.func,
  inline: PropTypes.bool,
};

export default MonthPicker;

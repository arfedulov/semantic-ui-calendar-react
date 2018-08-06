import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

import YearView from '../views/YearView';
import { getUnhandledProps } from '../lib';

const YEARS_ON_PAGE = 3 * 4;

class YearPicker extends React.Component {
  /*
    Note:
      use it like this <YearPicker key={someInputValue} />
      to make react create new instance when input value changes
  */
  constructor(props) {
    super(props);
    this.state = {
      /* moment instance */
      date: props.initializeWith.clone(),
    };
  }

  buildYears() {
    /*
      Return array of years (strings) like ['2012', '2013', ...]
      that used to populate calendar's page.
    */
    const years = [];
    const first = this.state.date.year();
    for (let i = 0; i < YEARS_ON_PAGE; i++) {
      years[i] = (first + i).toString();
    }
    return years;
  }

  getActiveYearPosition() {
    /*
      Return position of a year that should be displayed as active
      (position in array returned by `this.buildYears`).
    */
    if (!_.isNil(this.props.value)) {
      const years = this.buildYears();
      const yearIndex = years.indexOf(this.props.value.year().toString());
      if (yearIndex >= 0) {
        return yearIndex;
      }
    }
  }

  getDisabledYearsPositions() {
    /*
      Return position numbers of years that should be displayed as disabled
      (position in array returned by `this.buildYears`).
    */
    let disabled = [];
    const years = this.buildYears();
    if (_.isArray(this.props.disable)) {
      disabled = disabled.concat(
        this.props.disable
          .filter(yearMoment => _.includes(years, yearMoment.year().toString()))
          .map(yearMoment => years.indexOf(yearMoment.year().toString()))
      );
    }
    if (!_.isNil(this.props.maxDate)) {
      if (_.includes(years, this.props.maxDate.year().toString())) {
        disabled = disabled.concat(
          _.range(years.indexOf(this.props.maxDate.year().toString()) + 1, years.length)
        );
      }
    }
    if (!_.isNil(this.props.minDate)) {
      if (_.includes(years, this.props.minDate.year().toString())) {
        disabled = disabled.concat(
          _.range(0, years.indexOf(this.props.minDate.year().toString()))
        );
      }
    }
    if (disabled.length > 0) {
      return _.uniq(disabled);
    }
  }

  isNextPageAvailable() {
    const {
      maxDate,
    } = this.props;
    const lastOnPage = parseInt(_.last(this.buildYears()));

    if (_.isNil(maxDate)) return true;
    return lastOnPage < maxDate.year();
  }

  isPrevPageAvailable() {
    const {
      minDate,
    } = this.props;
    const firstOnPage = parseInt(_.first(this.buildYears()));

    if (_.isNil(minDate)) return true;
    return firstOnPage > minDate.year();
  }

  handleChange = (e, { value }) => {
    const year = parseInt(value);
    _.invoke(this.props, 'onChange', e, { ...this.props, value: { year } });
  }

  switchToNextPage = () => {
    this.setState(({ date }) => {
      const nextDate = date.clone();
      nextDate.add(YEARS_ON_PAGE, 'year');
      return { date: nextDate };
    });
  }

  switchToPrevPage = () => {
    this.setState(({ date }) => {
      const prevDate = date.clone();
      prevDate.subtract(YEARS_ON_PAGE, 'year');
      return { date: prevDate };
    });
  }

  render() {
    const rest = getUnhandledProps(YearPicker, this.props);
    return (
      <YearView
        { ...rest }
        years={this.buildYears()}
        onNextPageBtnClick={this.switchToNextPage}
        onPrevPageBtnClick={this.switchToPrevPage}
        onYearClick={this.handleChange}
        hasPrevPage={this.isPrevPageAvailable()}
        hasNextPage={this.isNextPageAvailable()}
        disabled={this.getDisabledYearsPositions()}
        active={this.getActiveYearPosition()} />
    );
  }
}

YearPicker.propTypes = {
  /** Called after year is selected. */
  onChange: PropTypes.func.isRequired,
  /** A value for initializing year picker's state. */
  initializeWith: PropTypes.instanceOf(moment).isRequired,
  /** Currently selected year. */
  value: PropTypes.instanceOf(moment),
  /** Array of disabled years. */
  disable: PropTypes.arrayOf(
    PropTypes.instanceOf(moment)
  ),
  /** Minimal year that could be selected. */
  minDate: PropTypes.instanceOf(moment),
  /** Maximal year that could be selected. */
  maxDate: PropTypes.instanceOf(moment),
};

export default YearPicker;

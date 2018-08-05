import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Calendar from './Calendar';

function MinuteView(props) {
  return <Calendar />;
}

/** One of 12 five-minutes intervals. */
const MinutesIntervalType = PropTypes.oneOf(
  [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    10, 11,
  ]
);

MinuteView.propTypes = {
  /** Wether to display header or not. */
  hasHeader: PropTypes.bool.isRequired,
  /** Called after click on minute. */
  onMinuteClick: PropTypes.func.isRequired,
  /** Called after click on next page button. */
  onNextPageBtnClick: PropTypes.func,
  /** Called after click on previous page button. */
  onPrevPageBtnClick: PropTypes.func,
  /** Whether to display previous page button as active or disabled. */
  hasPrevPage: PropTypes.bool,
  /** Whether to display next page button as active or disabled. */
  hasNextPage: PropTypes.bool,
  /** Called after click on calendar header. */
  onHeaderClick: PropTypes.func,
  /** Minutes interval to display as active. */
  active: MinutesIntervalType,
  /** A Moment that is used to display date in calendar header. */
  currentDate: PropTypes.instanceOf(moment),
};

export default MinuteView;

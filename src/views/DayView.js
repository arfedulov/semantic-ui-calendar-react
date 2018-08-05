import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Calendar from './Calendar';

function DayView(props) {
  return <Calendar />;
}

export const DayPositionType = PropTypes.oneOf(
  [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
    30,
  ]
);

DayView.propTypes = {
  /** An array of days to fill a calendar with. */
  days: PropTypes.arrayOf(PropTypes.instanceOf(moment)).isRequired,
  /** Called after click on next page button. */
  onNextPageBtnClick: PropTypes.func.isRequired,
  /** Called after click on previous page button. */
  onPrevPageBtnClick: PropTypes.func.isRequired,
  /** Called after click on day. */
  onDayClick: PropTypes.func.isRequired,
  /** Whether to display previous page button as active or disabled. */
  hasPrevPage: PropTypes.bool.isRequired,
  /** Whether to display next page button as active or disabled. */
  hasNextPage: PropTypes.bool.isRequired,
  /** A Moment that is used to display date in calendar header. */
  currentMonth: PropTypes.instanceOf(moment).isRequired,
  /** Called after click on calendar header. */
  onHeaderClick: PropTypes.func,
  /** An array of day positions to display as disabled. */
  disabled: PropTypes.arrayOf(DayPositionType),
  /** Position of a day to display as active. */
  active: DayPositionType,
};

export default DayView;

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Calendar from './Calendar';
import { DayPositionType } from './DayView';

function DatesRangeView(props) {
  return <Calendar />;
}

DatesRangeView.propTypes = {
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
  /** Start and end of a range of day positions to display as active. */
  active: PropTypes.shape(
    { 
      start: DayPositionType,
      end: DayPositionType,
    }
  ),
};

export default DatesRangeView;

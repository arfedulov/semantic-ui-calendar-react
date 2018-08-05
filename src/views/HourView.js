import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Calendar from './Calendar';

function HourView(props) {
  return <Calendar />;
}

const HourType = PropTypes.oneOf(
  [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23,
  ]
);

HourView.propTypes = {
  /** Wether to display header or not. */
  hasHeader: PropTypes.bool.isRequired,
  /** Called after click on hour. */
  onHourClick: PropTypes.func.isRequired,
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
  /** An array of hours to display as disabled. */
  disabled: PropTypes.arrayOf(HourType),
  /** An hour to display as active. */
  active: HourType,
  /** A Moment that is used to display date in calendar header. */
  currentDate: PropTypes.instanceOf(moment),
};

export default HourView;

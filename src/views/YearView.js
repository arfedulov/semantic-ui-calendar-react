import React from 'react';
import PropTypes from 'prop-types';

import Calendar from './Calendar';

function YearView(props) {
  return <Calendar />;
}

YearView.propTypes = {
  /** An array of years to fill a calendar with. */
  years: PropTypes.arrayOf(PropTypes.number).isRequired,
  /** Called after click on next page button. */
  onNextPageBtnClick: PropTypes.func.isRequired,
  /** Called after click on previous page button. */
  onPrevPageBtnClick: PropTypes.func.isRequired,
  /** Called after click on year. */
  onYearClick: PropTypes.func.isRequired,
  /** Whether to display previous page button as active or disabled. */
  hasPrevPage: PropTypes.bool.isRequired,
  /** Whether to display next page button as active or disabled. */
  hasNextPage: PropTypes.bool.isRequired,
  /** Called after click on calendar header. */
  onHeaderClick: PropTypes.func,
  /** An array of years to display as disabled. */
  disabled: PropTypes.arrayOf(PropTypes.number),
  /** A year to display as active. */
  active: PropTypes.number,
};

export default YearView;

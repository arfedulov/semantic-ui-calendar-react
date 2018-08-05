import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

import Header from './CalendarHeader/Header';
import Body from './CalendarBody/Body';

function YearView(props) {
  return (
    <Table
      unstackable
      celled
      textAlign="center">
      <Header />
      <Body />
    </Table>
  );
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

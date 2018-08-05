import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';

import Header from './CalendarHeader/Header';
import Body from './CalendarBody/Body';

function MonthView(props) {
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

const MonthType = PropTypes.oneOf(
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
);

MonthView.propTypes = {
  /** Wether to display header or not. */
  hasHeader: PropTypes.bool.isRequired,
  /** Called after click on month. */
  onMonthClick: PropTypes.func.isRequired,
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
  /** An array of months to display as disabled. */
  disabled: PropTypes.arrayOf(MonthType),
  /** A month to display as active. */
  active: MonthType,
  /** A year to display in header. */
  currentYear: PropTypes.number,
};

export default MonthView;

import React from 'react';
import PropTypes from 'prop-types';

import Calendar from './Calendar';
import Header from './CalendarHeader/Header';
import Body from './CalendarBody/Body';

export const DAY_CALENDAR_ROW_WIDTH = '7';
export const WEEKS_TO_DISPLAY = 6;

function DayView(props) {
  const {
    days,
    onNextPageBtnClick,
    onPrevPageBtnClick,
    onDayClick,
    hasNextPage,
    hasPrevPage,
    currentDate,
    onHeaderClick,
    disabled,
    active,
  } = props;
  return (
    <Calendar>
      <Header
        width={DAY_CALENDAR_ROW_WIDTH}
        displayWeeks={true}
        onNextPageBtnClick={onNextPageBtnClick}
        onPrevPageBtnClick={onPrevPageBtnClick}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        title={currentDate}
        onHeaderClick={onHeaderClick} />
      <Body
        width={DAY_CALENDAR_ROW_WIDTH}
        data={days}
        onCellClick={onDayClick}
        active={active}
        disabled={disabled} />
    </Calendar>
  );
}

DayView.propTypes = {
  /** An array of dates to fill a calendar with. */
  days: PropTypes.arrayOf(PropTypes.string).isRequired,
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
  /** A date that is displayed in calendar header. */
  currentDate: PropTypes.string.isRequired,
  /** Called after click on calendar header. */
  onHeaderClick: PropTypes.func,
  /** An array of day positions to display as disabled. */
  disabled: PropTypes.arrayOf(PropTypes.number),
  /** Position of a day to display as active. */
  active: PropTypes.number,
};

export default DayView;

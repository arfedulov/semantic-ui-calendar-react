import React from 'react';
import PropTypes from 'prop-types';

import Calendar from './Calendar';
import Header from './CalendarHeader/Header';
import Body from './CalendarBody/Body';

const MINUTE_CALENDAR_ROW_WIDTH = '3';

function MinuteView(props) {
  const {
    minutes,
    hasHeader,
    onMinuteClick,
    onNextPageBtnClick,
    onPrevPageBtnClick,
    hasNextPage,
    hasPrevPage,
    onHeaderClick,
    active,
    currentDate,
  } = props;
  const headerProps = {
    onHeaderClick,
    onNextPageBtnClick,
    onPrevPageBtnClick,
    hasNextPage,
    hasPrevPage,
    title: currentDate,
    width: MINUTE_CALENDAR_ROW_WIDTH,
    displayWeeks: false,
  };
  return (
    <Calendar>
      { hasHeader && <Header { ...headerProps } /> }
      <Body
        width={MINUTE_CALENDAR_ROW_WIDTH}
        data={minutes}
        onCellClick={onMinuteClick}
        active={active} />
    </Calendar>
  );
}

MinuteView.propTypes = {
  /** Array of minutes to fill a calendar with. */
  minutes: PropTypes.arrayOf(PropTypes.string).isRequired,
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
  /** Minute index to display as active. */
  active: PropTypes.number,
  /** A date that is displayed in calendar header. */
  currentDate: PropTypes.string,
};

export default MinuteView;

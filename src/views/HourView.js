import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Calendar from './Calendar';
import Header from './CalendarHeader/Header';
import Body from './CalendarBody/Body';

const HOUR_CALENDAR_ROW_WIDTH = '4';

function HourView(props) {
  const {
    hours,
    hasHeader,
    onHourClick,
    onNextPageBtnClick,
    onPrevPageBtnClick,
    hasPrevPage,
    hasNextPage,
    onHeaderClick,
    disabled,
    active,
    currentDate,
  } = props;
  const headerProps = {
    onNextPageBtnClick,
    onPrevPageBtnClick,
    hasPrevPage,
    hasNextPage,
    onHeaderClick,
    title: currentDate,
    width: HOUR_CALENDAR_ROW_WIDTH,
    displayWeeks: false,
  };
  return (
    <Calendar>
      { hasHeader && <Header { ...headerProps } /> }
      <Body
        data={hours}
        width={HOUR_CALENDAR_ROW_WIDTH}
        onCellClick={onHourClick}
        active={active}
        disabled={disabled} />
    </Calendar>
  );
}

HourView.propTypes = {
  /** Array of hours to fill a calendar with. */
  hours: PropTypes.arrayOf(PropTypes.string).isRequired,
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
  /** Array of hour indexes to display as disabled. */
  disabled: PropTypes.arrayOf(PropTypes.number),
  /** Hour index to display as active. */
  active: PropTypes.number,
  /** Date that is displayed in calendar header. */
  currentDate: PropTypes.string,
};

export default HourView;

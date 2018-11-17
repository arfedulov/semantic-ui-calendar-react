import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Calendar from './Calendar';
import Header from './CalendarHeader/Header';
import Body from './CalendarBody/Body';
import BaseView from './BaseView';

export const DAY_CALENDAR_ROW_WIDTH = '7';
export const WEEKS_TO_DISPLAY = 6;

class DayView extends BaseView {
  render() {
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
      hovered,
      onCellHover,
      hasHeader,
      onMount,
      ...rest
    } = this.props;
    return (
      <Calendar ref={e => this.calendarNode = ReactDOM.findDOMNode(e)} {...rest}>
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
          hovered={hovered}
          onCellHover={onCellHover}
          onCellClick={onDayClick}
          active={active}
          disabled={disabled} />
      </Calendar>
    );
  }
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
  /** Called on calendar cell hover. */
  onCellHover: PropTypes.func,
  /** Index of a cell that should be displayed as hovered. */
  hovered: PropTypes.number,
  /** Called after click on calendar header. */
  onHeaderClick: PropTypes.func,
  /** An array of day positions to display as disabled. */
  disabled: PropTypes.arrayOf(PropTypes.number),
  /** Position of a day to display as active. */
  active: PropTypes.number,
  onMount: PropTypes.func,
};

export default DayView;

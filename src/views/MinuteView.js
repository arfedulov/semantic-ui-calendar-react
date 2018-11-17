import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Calendar from './Calendar';
import Header from './CalendarHeader/Header';
import Body from './CalendarBody/Body';
import BaseView from './BaseView';

const MINUTE_CALENDAR_ROW_WIDTH = '3';

class MinuteView extends BaseView {
  render() {
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
      hovered,
      onCellHover,
      onMount,
      ...rest
    } = this.props;
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
      <Calendar ref={e => this.calendarNode = ReactDOM.findDOMNode(e)} {...rest}>
        { hasHeader && <Header { ...headerProps } /> }
        <Body
          width={MINUTE_CALENDAR_ROW_WIDTH}
          data={minutes}
          hovered={hovered}
          onCellHover={onCellHover}
          onCellClick={onMinuteClick}
          active={active} />
      </Calendar>
    );
  }
}

MinuteView.propTypes = {
  /** Array of minutes to fill a calendar with. */
  minutes: PropTypes.arrayOf(PropTypes.string).isRequired,
  /** Wether to display header or not. */
  hasHeader: PropTypes.bool.isRequired,
  /** Called after click on minute. */
  onMinuteClick: PropTypes.func.isRequired,
  /** Called on calendar cell hover. */
  onCellHover: PropTypes.func,
  /** Index of a cell that should be displayed as hovered. */
  hovered: PropTypes.number,
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
  onMount: PropTypes.func,
};

export default MinuteView;

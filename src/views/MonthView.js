import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as PropTypes from 'prop-types';

import Calendar from './Calendar';
import Header from './CalendarHeader/Header';
import Body from './CalendarBody/Body';
import BaseView from './BaseView';

const MONTH_CALENDAR_ROW_WIDTH = '3';

class MonthView extends BaseView {
  render() {
    const {
      months,
      hasHeader,
      onMonthClick,
      onNextPageBtnClick,
      onPrevPageBtnClick,
      hasPrevPage,
      hasNextPage,
      onHeaderClick,
      disabled,
      active,
      currentYear,
      onCellHover,
      hovered,
      onMount,
      ...rest
    } = this.props;
    const headerProps = {
      onNextPageBtnClick,
      onPrevPageBtnClick,
      hasPrevPage,
      hasNextPage,
      onHeaderClick,
      title: currentYear,
      displayWeeks: false,
      width: MONTH_CALENDAR_ROW_WIDTH,
    };
    return (
      <Calendar ref={e => this.calendarNode = ReactDOM.findDOMNode(e)} {...rest}>
        { hasHeader && <Header { ...headerProps } /> }
        <Body
          width={MONTH_CALENDAR_ROW_WIDTH}
          data={months}
          onCellClick={onMonthClick}
          onCellHover={onCellHover}
          active={active}
          hovered={hovered}
          disabled={disabled} />
      </Calendar>
    );
  }
}

MonthView.propTypes = {
  /** Array of months to fill a calendar with. */
  months: PropTypes.arrayOf(PropTypes.string).isRequired,
  /** Wether to display header or not. */
  hasHeader: PropTypes.bool.isRequired,
  /** Called after click on month. */
  onMonthClick: PropTypes.func.isRequired,
  /** Called on calendar cell hover. */
  onCellHover: PropTypes.func,
  /** Index of a month that should be displayed as hovered. */
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
  /** An array of month indexes to display as disabled. */
  disabled: PropTypes.arrayOf(PropTypes.number),
  /** Index of a month that should be displayed as active. */
  active: PropTypes.number,
  /** A year to display in header. */
  currentYear: PropTypes.string,
  onMount: PropTypes.func,
};

export default MonthView;

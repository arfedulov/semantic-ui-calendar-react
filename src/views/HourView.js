import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as PropTypes from 'prop-types';

import Calendar from './Calendar';
import Header from './CalendarHeader/Header';
import Body from './CalendarBody/Body';
import BaseView from './BaseView';

const HOUR_CALENDAR_ROW_WIDTH = 4;

class HourView extends BaseView {
  render() {
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
      hovered,
      onCellHover,
      onMount,
      inline,
      ...rest
    } = this.props;
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
      <Calendar ref={e => this.calendarNode = ReactDOM.findDOMNode(e)} outlineOnFocus={inline} {...rest}>
        { hasHeader && <Header { ...headerProps } /> }
        <Body
          data={hours}
          width={HOUR_CALENDAR_ROW_WIDTH}
          onCellClick={onHourClick}
          hovered={hovered}
          onCellHover={onCellHover}
          active={active}
          disabled={disabled} />
      </Calendar>
    );
  }
}

HourView.propTypes = {
  /** Array of hours to fill a calendar with. */
  hours: PropTypes.arrayOf(PropTypes.string).isRequired,
  /** Wether to display header or not. */
  hasHeader: PropTypes.bool.isRequired,
  /** Called after click on hour. */
  onHourClick: PropTypes.func.isRequired,
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
  /** Array of hour indexes to display as disabled. */
  disabled: PropTypes.arrayOf(PropTypes.number),
  /** Hour index to display as active. */
  active: PropTypes.number,
  /** Date that is displayed in calendar header. */
  currentDate: PropTypes.string,
  onMount: PropTypes.func,
};

export default HourView;

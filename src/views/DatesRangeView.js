import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as PropTypes from 'prop-types';
import * as _ from 'lodash';

import Calendar from './Calendar';
import Header from './CalendarHeader/Header';
import Body from './CalendarBody/Body';
import {
  WEEKS_TO_DISPLAY,
  DAY_CALENDAR_ROW_WIDTH,
} from './DayView';
import BaseView from './BaseView';

const DAY_POSITIONS = _.range(WEEKS_TO_DISPLAY * 7);

function getActive(start, end) {
  if (_.isNil(start) && _.isNil(end)) return;
  if (!_.isNil(start) && _.isNil(end)) {
    return start;
  }
  if (!_.isNil(start) && !_.isNil(end)) {
    return DAY_POSITIONS.slice(start, end + 1);
  }
}

class DatesRangeView extends BaseView {
  render() {
    const {
      days,
      onNextPageBtnClick,
      onPrevPageBtnClick,
      onDayClick,
      hasPrevPage,
      hasNextPage,
      currentDate,
      onHeaderClick,
      active,
      disabled,
      selectedRange,
      hovered,
      onCellHover,
      onMount,
      ...rest
    } = this.props;
    const {
      start,
      end,
    } = active;
    return (
      <Calendar ref={e => this.calendarNode = ReactDOM.findDOMNode(e)} {...rest}>
        <Header
          width={DAY_CALENDAR_ROW_WIDTH}
          displayWeeks
          rangeRowContent={selectedRange}
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
          onCellHover={onCellHover}
          hovered={hovered}
          active={getActive(start, end)}
          disabled={disabled} />
      </Calendar>
    );
  }
}

DatesRangeView.propTypes = {
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
  /** Date that is displayed in calendar header. */
  currentDate: PropTypes.string.isRequired,
  /** Selected range that is displayed in calendar header. */
  selectedRange: PropTypes.string.isRequired,
  /** Start and end of a range of day positions to display as active. */
  active: PropTypes.shape(
    { 
      start: PropTypes.number,
      end: PropTypes.number,
    }
  ).isRequired,
  /** Called on calendar cell hover. */
  onCellHover: PropTypes.func,
  /** Index of a month that should be displayed as hovered. */
  hovered: PropTypes.number,
  /** Called after click on calendar header. */
  onHeaderClick: PropTypes.func,
  /** An array of day positions to display as disabled. */
  disabled: PropTypes.arrayOf(PropTypes.number),
  onMount: PropTypes.func,
};

DatesRangeView.defaultProps = {
  active: {
    start: undefined,
    end: undefined,
  }
};

export default DatesRangeView;

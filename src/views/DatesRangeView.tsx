import * as _ from 'lodash';
import * as React from 'react';

import BaseCalendarView, { BaseCalendarViewProps } from './BaseCalendarView';
import Calendar from './Calendar';
import Body from './CalendarBody/Body';
import Header from './CalendarHeader/Header';
import {
  DAY_CALENDAR_ROW_WIDTH,
  WEEKS_TO_DISPLAY,
} from './DayView';

import { findHTMLElement } from '../lib';

const DAY_POSITIONS = _.range(WEEKS_TO_DISPLAY * 7);

function getActive(start: number, end: number): number | number[] | undefined {
  if (_.isNil(start) && _.isNil(end)) {
    return;
  }
  if (!_.isNil(start) && _.isNil(end)) {
    return start;
  }
  if (!_.isNil(start) && !_.isNil(end)) {
    return DAY_POSITIONS.slice(start, end + 1);
  }
}

interface Range {
  start: number | undefined;
  end: number | undefined;
}

interface DatesRangeViewProps extends BaseCalendarViewProps {
  /** An array of dates to fill a calendar with. */
  days: string[];
  /** Called after click on next page button. */
  onNextPageBtnClick: () => void;
  /** Called after click on previous page button. */
  onPrevPageBtnClick: () => void;
  /** Called after click on day. */
  onDayClick: (e: React.SyntheticEvent, data: any) => void;
  /** Whether to display previous page button as active or disabled. */
  hasPrevPage: boolean;
  /** Whether to display next page button as active or disabled. */
  hasNextPage: boolean;
  /** Date that is displayed in calendar header. */
  currentDate: string;
  /** Selected range that is displayed in calendar header. */
  selectedRange: string;
  /** Start and end of a range of day positions to display as active. */
  active: Range;
  /** Called on calendar cell hover. */
  onCellHover: (e: React.SyntheticEvent, data: any) => void;
  /** Called after click on calendar header. */
  onHeaderClick: () => void;
  /** Index of a month that should be displayed as hovered. */
  hovered?: number;
  /** An array of day positions to display as disabled. */
  disabled?: number[];
}

class DatesRangeView extends BaseCalendarView<DatesRangeViewProps, any> {
  public static defaultProps = {
    active: {
      start: undefined,
      end: undefined,
    },
  };

  public render() {
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
      inline,
      ...rest
    } = this.props;
    const {
      start,
      end,
    } = active;

    return (
      <Calendar ref={(e) => this.calendarNode = findHTMLElement(e)} outlineOnFocus={inline} {...rest}>
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

export default DatesRangeView;

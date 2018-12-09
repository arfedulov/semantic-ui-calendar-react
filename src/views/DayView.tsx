import * as React from 'react';

import BaseView, { BaseViewProps } from './BaseView';
import Calendar from './Calendar';
import Body from './CalendarBody/Body';
import Header from './CalendarHeader/Header';

import { findHTMLElement } from '../lib';

export const DAY_CALENDAR_ROW_WIDTH = 7;
export const WEEKS_TO_DISPLAY = 6;

interface DayViewProps extends BaseViewProps {
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
  /** A date that is displayed in calendar header. */
  currentDate: string;
  /** Called on calendar cell hover. */
  onCellHover: (e: React.SyntheticEvent, data: any) => void;
  /** Called after click on calendar header. */
  onHeaderClick: () => void;
  /** Index of a cell that should be displayed as hovered. */
  hovered?: number;
  /** An array of day positions to display as disabled. */
  disabled?: number[];
  /** Position of a day to display as active. */
  active?: number;
}

class DayView extends BaseView<DayViewProps, any> {
  public render() {
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
      inline,
      ...rest
    } = this.props;

    return (
      <Calendar ref={(e) => this.calendarNode = findHTMLElement(e)} outlineOnFocus={inline} {...rest}>
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

export default DayView;

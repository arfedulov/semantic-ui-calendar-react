import * as React from 'react';

import BaseCalendarView, { BaseCalendarViewProps } from './BaseCalendarView';
import Calendar from './Calendar';
import Body from './CalendarBody/Body';
import Header, { HeaderProps } from './CalendarHeader/Header';

import { findHTMLElement } from '../lib';

const HOUR_CALENDAR_ROW_WIDTH = 4;

interface HourViewProps extends BaseCalendarViewProps {
  /** Array of hours to fill a calendar with. */
  hours: string[];
  /** Called after click on hour. */
  onHourClick: (e: React.SyntheticEvent, data: any) => void;
  /** Called on calendar cell hover. */
  onCellHover: (e: React.SyntheticEvent, data: any) => void;
  /** Index of a cell that should be displayed as hovered. */
  hovered?: number;
  /** Called after click on next page button. */
  onNextPageBtnClick?: () => void;
  /** Called after click on previous page button. */
  onPrevPageBtnClick?: () => void;
  /** Whether to display previous page button as active or disabled. */
  hasPrevPage?: boolean;
  /** Whether to display next page button as active or disabled. */
  hasNextPage?: boolean;
  /** Called after click on calendar header. */
  onHeaderClick?: () => void;
  /** Array of hour indexes to display as disabled. */
  disabled?: number[];
  /** Hour index to display as active. */
  active?: number;
  /** Date that is displayed in calendar header. */
  currentDate?: string;
}

class HourView extends BaseCalendarView<HourViewProps, any> {
  public render() {
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
    const headerProps: HeaderProps = {
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
      <Calendar ref={(e) => this.calendarNode = findHTMLElement(e)} outlineOnFocus={inline} {...rest}>
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

export default HourView;

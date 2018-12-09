import * as React from 'react';

import BaseView, { BaseViewProps } from './BaseView';
import Calendar from './Calendar';
import Body from './CalendarBody/Body';
import Header, { HeaderProps } from './CalendarHeader/Header';

import { findHTMLElement } from '../lib';

const MONTH_CALENDAR_ROW_WIDTH = 3;

interface MonthViewProps extends BaseViewProps {
  /** Array of months to fill a calendar with. */
  months: string[];
  /** Called after click on month. */
  onMonthClick: (e: React.SyntheticEvent, data: any) => void;
  /** Called on calendar cell hover. */
  onCellHover: (e: React.SyntheticEvent, data: any) => void;
  /** Index of a month that should be displayed as hovered. */
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
  /** An array of month indexes to display as disabled. */
  disabled?: number[];
  /** Index of a month that should be displayed as active. */
  active?: number;
  /** A year to display in header. */
  currentYear?: string;
}

class MonthView extends BaseView<MonthViewProps, any> {
  public render() {
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
      inline,
      ...rest
    } = this.props;
    const headerProps: HeaderProps = {
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
      <Calendar ref={(e) => this.calendarNode = findHTMLElement(e)} outlineOnFocus={inline} {...rest}>
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

export default MonthView;

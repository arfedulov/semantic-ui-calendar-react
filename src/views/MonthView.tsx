import * as React from 'react';

import BaseCalendarView, {
  BaseCalendarViewProps,
  BaseCalendarViewPropsNames,
  CalendarWithOptionalHeaderViewProps,
  CalendarWithOptionalHeaderViewPropsNames,
  SingleSelectionCalendarViewProps,
  SingleSelectionCalendarViewPropsNames,
} from './BaseCalendarView';
import Calendar from './Calendar';
import Body from './CalendarBody/Body';
import Header, { HeaderProps } from './CalendarHeader/Header';

import { findHTMLElement } from '../lib';

export const MONTH_CALENDAR_ROW_WIDTH = 3;

// IMPORTANT: keep it in sync with MonthViewPropsNames
export type MonthViewProps =
  BaseCalendarViewProps
  & SingleSelectionCalendarViewProps
  & CalendarWithOptionalHeaderViewProps;

export const MonthViewPropsNames = [
  ...BaseCalendarViewPropsNames,
  ...SingleSelectionCalendarViewPropsNames,
  ...CalendarWithOptionalHeaderViewPropsNames,
];

class MonthView extends BaseCalendarView<MonthViewProps, {}> {
  public render() {
    const {
      values,
      hasHeader,
      onValueClick,
      onNextPageBtnClick,
      onPrevPageBtnClick,
      hasPrevPage,
      hasNextPage,
      onHeaderClick,
      disabledItemIndexes,
      activeItemIndex,
      currentHeadingValue,
      onCellHover,
      hoveredItemIndex,
      onMount,
      inline,
      localization,
      ...rest
    } = this.props;
    const headerProps: HeaderProps = {
      className: 'suicr-month-view-header',
      onNextPageBtnClick,
      onPrevPageBtnClick,
      hasPrevPage,
      hasNextPage,
      onHeaderClick,
      title: currentHeadingValue,
      displayWeeks: false,
      width: MONTH_CALENDAR_ROW_WIDTH,
      localization,
    };

    return (
      <Calendar ref={(e) => this.calendarNode = findHTMLElement(e)} outlineOnFocus={inline} {...rest}>
        { hasHeader && <Header { ...headerProps } /> }
        <Body
          width={MONTH_CALENDAR_ROW_WIDTH}
          data={values}
          onCellClick={onValueClick}
          onCellHover={onCellHover}
          active={activeItemIndex}
          hovered={hoveredItemIndex}
          disabled={disabledItemIndexes} />
      </Calendar>
    );
  }
}

export default MonthView;

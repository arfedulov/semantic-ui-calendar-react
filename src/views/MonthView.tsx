import * as React from 'react';

import BaseCalendarView, {
  BaseCalendarViewProps,
  CalendarWithOptionalHeaderViewProps,
  SingleSelectionCalendarViewProps,
} from './BaseCalendarView';
import Calendar from './Calendar';
import Body from './CalendarBody/Body';
import Header, { HeaderProps } from './CalendarHeader/Header';

import { findHTMLElement } from '../lib';

const MONTH_CALENDAR_ROW_WIDTH = 3;

type MonthViewProps =
  BaseCalendarViewProps
  & SingleSelectionCalendarViewProps
  & CalendarWithOptionalHeaderViewProps;

class MonthView extends BaseCalendarView<MonthViewProps, any> {
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
      ...rest
    } = this.props;
    const headerProps: HeaderProps = {
      onNextPageBtnClick,
      onPrevPageBtnClick,
      hasPrevPage,
      hasNextPage,
      onHeaderClick,
      title: currentHeadingValue,
      displayWeeks: false,
      width: MONTH_CALENDAR_ROW_WIDTH,
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

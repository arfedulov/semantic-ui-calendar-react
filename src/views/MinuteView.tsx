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

import { findHTMLElement, getRestProps } from '../lib';

const MINUTE_CALENDAR_ROW_WIDTH = 3;

// IMPORTANT: keep it in sync with MinuteViewPropsNames
export type MinuteViewProps =
  BaseCalendarViewProps
  & SingleSelectionCalendarViewProps
  & CalendarWithOptionalHeaderViewProps;

export const MinuteViewPropsNames = [
  ...BaseCalendarViewPropsNames,
  ...SingleSelectionCalendarViewPropsNames,
  ...CalendarWithOptionalHeaderViewPropsNames,
];

class MinuteView extends BaseCalendarView<MinuteViewProps, {}> {
  public render() {
    const {
      values,
      hasHeader,
      onValueClick,
      onNextPageBtnClick,
      onPrevPageBtnClick,
      hasNextPage,
      hasPrevPage,
      onHeaderClick,
      activeItemIndex,
      currentHeadingValue,
      hoveredItemIndex,
      disabledItemIndexes,
      onCellHover,
      inline,
      localization,
    } = this.props;
    
    const headerProps: HeaderProps = {
      className: 'suicr-minute-view-header',
      onHeaderClick,
      onNextPageBtnClick,
      onPrevPageBtnClick,
      hasNextPage,
      hasPrevPage,
      title: currentHeadingValue,
      width: MINUTE_CALENDAR_ROW_WIDTH,
      displayWeeks: false,
      localization,
    };

    const rest = getRestProps(this.props, MinuteViewPropsNames);

    return (
      <Calendar ref={(e) => this.calendarNode = findHTMLElement(e)} outlineOnFocus={inline} {...rest}>
        { hasHeader && <Header { ...headerProps } /> }
        <Body
          width={MINUTE_CALENDAR_ROW_WIDTH}
          data={values}
          hovered={hoveredItemIndex}
          onCellHover={onCellHover}
          onCellClick={onValueClick}
          active={activeItemIndex}
          disabled={disabledItemIndexes} />
      </Calendar>
    );
  }
}

export default MinuteView;

import * as React from 'react';

import BaseCalendarView, {
  BaseCalendarViewProps,
  CalendarWithHeaderViewProps,
  HeadingValueProps,
  SingleSelectionCalendarViewProps,
} from './BaseCalendarView';
import Calendar from './Calendar';
import Body from './CalendarBody/Body';
import Header from './CalendarHeader/Header';

import { findHTMLElement } from '../lib';

export const DAY_CALENDAR_ROW_WIDTH = 7;
export const WEEKS_TO_DISPLAY = 6;

type DayViewProps =
  BaseCalendarViewProps
  & HeadingValueProps
  & SingleSelectionCalendarViewProps
  & CalendarWithHeaderViewProps;

class DayView extends BaseCalendarView<DayViewProps, any> {
  public render() {
    const {
      values,
      onNextPageBtnClick,
      onPrevPageBtnClick,
      onValueClick,
      hasNextPage,
      hasPrevPage,
      currentHeadingValue,
      onHeaderClick,
      disabledItemIndexes,
      activeItemIndex,
      hoveredItemIndex,
      onCellHover,
      onMount,
      inline,
      markedItemIndexes,
      markColor,
      localization,
      ...rest
    } = this.props;

    return (
      <Calendar ref={(e) => this.calendarNode = findHTMLElement(e)} outlineOnFocus={inline} {...rest}>
        <Header
          className='suicr-day-view-header'
          width={DAY_CALENDAR_ROW_WIDTH}
          displayWeeks
          onNextPageBtnClick={onNextPageBtnClick}
          onPrevPageBtnClick={onPrevPageBtnClick}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          title={currentHeadingValue}
          onHeaderClick={onHeaderClick}
          localization={localization} />
        <Body
          width={DAY_CALENDAR_ROW_WIDTH}
          data={values}
          hovered={hoveredItemIndex}
          onCellHover={onCellHover}
          onCellClick={onValueClick}
          active={activeItemIndex}
          disabled={disabledItemIndexes}
          marked={markedItemIndexes}
          markColor={markColor} />
      </Calendar>
    );
  }
}

export default DayView;

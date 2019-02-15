import React from 'react';

import BaseCalendarView, {
  BaseCalendarViewProps,
  CalendarWithOptionalHeaderViewProps,
  SingleSelectionCalendarViewProps,
} from './BaseCalendarView';
import Calendar from './Calendar';
import Body from './CalendarBody/Body';
import Header, { HeaderProps } from './CalendarHeader/Header';

import { findHTMLElement } from '../lib';

const HOUR_CALENDAR_ROW_WIDTH = 4;

type HourViewProps =
  BaseCalendarViewProps
  & SingleSelectionCalendarViewProps
  & CalendarWithOptionalHeaderViewProps;

class HourView extends BaseCalendarView<HourViewProps, any> {
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
      hoveredItemIndex,
      onCellHover,
      onMount,
      inline,
      localization,
      ...rest
    } = this.props;
    const headerProps: HeaderProps = {
      onNextPageBtnClick,
      onPrevPageBtnClick,
      hasPrevPage,
      hasNextPage,
      onHeaderClick,
      title: currentHeadingValue,
      width: HOUR_CALENDAR_ROW_WIDTH,
      displayWeeks: false,
      localization,
    };

    return (
      <Calendar ref={(e) => this.calendarNode = findHTMLElement(e)} outlineOnFocus={inline} {...rest}>
        { hasHeader && <Header { ...headerProps } /> }
        <Body
          data={values}
          width={HOUR_CALENDAR_ROW_WIDTH}
          onCellClick={onValueClick}
          hovered={hoveredItemIndex}
          onCellHover={onCellHover}
          active={activeItemIndex}
          disabled={disabledItemIndexes} />
      </Calendar>
    );
  }
}

export default HourView;

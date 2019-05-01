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

const MINUTE_CALENDAR_ROW_WIDTH = 3;

type MinuteViewProps =
  BaseCalendarViewProps
  & SingleSelectionCalendarViewProps
  & CalendarWithOptionalHeaderViewProps;

class MinuteView extends BaseCalendarView<MinuteViewProps, any> {
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
      onMount,
      inline,
      localization,
      ...rest
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

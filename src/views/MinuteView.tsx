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

type MinuteViewProps =
  BaseCalendarViewProps
  & SingleSelectionCalendarViewProps
  & CalendarWithOptionalHeaderViewProps;

class MinuteView extends BaseCalendarView<MinuteViewProps, any> {
  protected MINUTE_CALENDAR_ROW_WIDTH: number;

  constructor(props) {
    super(props);
    this.MINUTE_CALENDAR_ROW_WIDTH = 4;
  }

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
      rowWidth,
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
      width: rowWidth,
      displayWeeks: false,
      localization,
    };

    return (
      <Calendar ref={(e) => this.calendarNode = findHTMLElement(e)} outlineOnFocus={inline} {...rest}>
        { hasHeader && <Header { ...headerProps } /> }
        <Body
          width={rowWidth}
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

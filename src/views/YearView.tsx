import * as _ from 'lodash';
import * as React from 'react';

import BaseCalendarView, {
  BaseCalendarViewProps,
  CalendarWithHeaderViewPropsBase,
  SingleSelectionCalendarViewProps,
} from './BaseCalendarView';
import Calendar from './Calendar';
import Body from './CalendarBody/Body';
import Header from './CalendarHeader/Header';

import { findHTMLElement } from '../lib';

const YEAR_CALENDAR_ROW_WIDTH = 3;

type YearViewProps =
  BaseCalendarViewProps
  & SingleSelectionCalendarViewProps
  & CalendarWithHeaderViewPropsBase;

class YearView extends BaseCalendarView<YearViewProps, any> {
  public render() {
    const {
      values,
      onNextPageBtnClick,
      onPrevPageBtnClick,
      onValueClick,
      hasNextPage,
      hasPrevPage,
      onHeaderClick,
      disabledItemIndexes,
      activeItemIndex,
      hoveredItemIndex,
      onCellHover,
      onMount,
      inline,
      ...rest
    } = this.props;
    const headerTitle = `${_.first(values)} - ${_.last(values)}`;

    return (
      <Calendar ref={(e) => this.calendarNode = findHTMLElement(e)} outlineOnFocus={inline} {...rest}>
        <Header
          title={headerTitle}
          onNextPageBtnClick={onNextPageBtnClick}
          onPrevPageBtnClick={onPrevPageBtnClick}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          onHeaderClick={onHeaderClick}
          width={YEAR_CALENDAR_ROW_WIDTH}
          displayWeeks={false} />
        <Body
          width={YEAR_CALENDAR_ROW_WIDTH}
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

export default YearView;

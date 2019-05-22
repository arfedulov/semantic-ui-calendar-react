import last from 'lodash/last';
import first from 'lodash/first';

import * as React from 'react';

import BaseCalendarView, {
  BaseCalendarViewProps,
  BaseCalendarViewPropsNames,
  CalendarWithHeaderViewProps,
  CalendarWithHeaderViewPropsNames,
  SingleSelectionCalendarViewProps,
  SingleSelectionCalendarViewPropsNames,
} from './BaseCalendarView';
import Calendar from './Calendar';
import Body from './CalendarBody/Body';
import Header from './CalendarHeader/Header';

import { findHTMLElement } from '../lib';

const YEAR_CALENDAR_ROW_WIDTH = 3;

// IMPORTANT: keep it in sync with YearViewPropsNames
export type YearViewProps =
  BaseCalendarViewProps
  & SingleSelectionCalendarViewProps
  & CalendarWithHeaderViewProps;

export const YearViewPropsNames = [
  ...BaseCalendarViewPropsNames,
  ...SingleSelectionCalendarViewPropsNames,
  ...CalendarWithHeaderViewPropsNames,
];

class YearView extends BaseCalendarView<YearViewProps, {}> {
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
      localization,
      ...rest
    } = this.props;
    const headerTitle = `${first(values)} - ${last(values)}`;

    return (
      <Calendar ref={(e) => this.calendarNode = findHTMLElement(e)} outlineOnFocus={inline} {...rest}>
        <Header
          className='suicr-year-view-header'
          title={headerTitle}
          onNextPageBtnClick={onNextPageBtnClick}
          onPrevPageBtnClick={onPrevPageBtnClick}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          onHeaderClick={onHeaderClick}
          width={YEAR_CALENDAR_ROW_WIDTH}
          displayWeeks={false}
          localization={localization} />
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

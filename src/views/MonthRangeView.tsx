import range from 'lodash/range';
import isNil from 'lodash/isNil';

import * as React from 'react';
import {findHTMLElement, getRestProps} from '../lib';

import BaseCalendarView, {
  BaseCalendarViewProps,
  BaseCalendarViewPropsNames,
  CalendarWithHeaderViewProps,
  CalendarWithHeaderViewPropsNames,
  HeadingValueProps,
  HeadingValuePropsNames,
  RangeSelectionCalendarViewProps,
  RangeSelectionCalendarViewPropsNames,
} from './BaseCalendarView';

import Calendar from './Calendar';
import Body from './CalendarBody/Body';
import Header from './CalendarHeader/Header';

import { MONTH_CALENDAR_ROW_WIDTH } from './MonthView';

// IMPORTANT: keep it in sync with MonthRangeViewPropsNames
export type MonthRangeViewProps =
  BaseCalendarViewProps
  & HeadingValueProps
  & RangeSelectionCalendarViewProps
  & CalendarWithHeaderViewProps;

export const MonthRangeViewPropsNames = [
  ...BaseCalendarViewPropsNames,
  ...HeadingValuePropsNames,
  ...RangeSelectionCalendarViewPropsNames,
  ...CalendarWithHeaderViewPropsNames,
];

const MONTH_POSITIONS = range(12);

function getActive(start: number, end: number): number | number[] | undefined {
  if (isNil(start) && isNil(end)) {
    return;
  }
  if (!isNil(start) && isNil(end)) {
    return start;
  }
  if (!isNil(start) && !isNil(end)) {
    return MONTH_POSITIONS.slice(start, end + 1);
  }
}

class MonthRangeView extends BaseCalendarView<MonthRangeViewProps, {}> {
  public static defaultProps = {
    active: {
      start: undefined,
      end: undefined,
    },
  };

  public render() {
    const {
      values,
      onNextPageBtnClick,
      onPrevPageBtnClick,
      onValueClick,
      hasPrevPage,
      hasNextPage,
      currentHeadingValue,
      onHeaderClick,
      activeRange,
      disabledItemIndexes,
      currentRangeHeadingValue,
      hoveredItemIndex,
      onCellHover,
      inline,
      localization,
    } = this.props;
    const {
      start,
      end,
    } = activeRange;

    const rest = getRestProps(this.props, MonthRangeViewPropsNames);

    return (
      <Calendar ref={(e) => this.calendarNode = findHTMLElement(e)} outlineOnFocus={inline} {...rest}>
        <Header
          width={MONTH_CALENDAR_ROW_WIDTH}
          className='suicr-month-range-view-header'
          displayWeeks={false}
          rangeRowContent={currentRangeHeadingValue}
          onNextPageBtnClick={onNextPageBtnClick}
          onPrevPageBtnClick={onPrevPageBtnClick}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          title={currentHeadingValue}
          onHeaderClick={onHeaderClick}
          localization={localization}/>
        <Body
          width={MONTH_CALENDAR_ROW_WIDTH}
          data={values}
          onCellClick={onValueClick}
          onCellHover={onCellHover}
          hovered={hoveredItemIndex}
          active={getActive(start, end)}
          disabled={disabledItemIndexes}/>
      </Calendar>
    );
  }
}

export default MonthRangeView;

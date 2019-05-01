import range from 'lodash/range';
import isNil from 'lodash/isNil';

import * as React from 'react';

import BaseCalendarView, {
  BaseCalendarViewProps,
  CalendarWithHeaderViewProps,
  HeadingValueProps,
  RangeSelectionCalendarViewProps,
} from './BaseCalendarView';
import Calendar from './Calendar';
import Body from './CalendarBody/Body';
import Header from './CalendarHeader/Header';
import {
  DAY_CALENDAR_ROW_WIDTH,
  WEEKS_TO_DISPLAY,
} from './DayView';

import { findHTMLElement } from '../lib';

const DAY_POSITIONS = range(WEEKS_TO_DISPLAY * 7);

function getActive(start: number, end: number): number | number[] | undefined {
  if (isNil(start) && isNil(end)) {
    return;
  }
  if (!isNil(start) && isNil(end)) {
    return start;
  }
  if (!isNil(start) && !isNil(end)) {
    return DAY_POSITIONS.slice(start, end + 1);
  }
}

type DatesRangeViewProps =
  BaseCalendarViewProps
  & HeadingValueProps
  & RangeSelectionCalendarViewProps
  & CalendarWithHeaderViewProps;

class DatesRangeView extends BaseCalendarView<DatesRangeViewProps, any> {
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
      onMount,
      inline,
      markColor,
      markedItemIndexes,
      localization,
      ...rest
    } = this.props;
    const {
      start,
      end,
    } = activeRange;

    return (
      <Calendar ref={(e) => this.calendarNode = findHTMLElement(e)} outlineOnFocus={inline} {...rest}>
        <Header
          width={DAY_CALENDAR_ROW_WIDTH}
          className='suicr-dates-range-view-header'
          displayWeeks
          rangeRowContent={currentRangeHeadingValue}
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
          onCellClick={onValueClick}
          onCellHover={onCellHover}
          hovered={hoveredItemIndex}
          markColor={markColor}
          marked={markedItemIndexes}
          active={getActive(start, end)}
          disabled={disabledItemIndexes} />
      </Calendar>
    );
  }
}

export default DatesRangeView;

import * as _ from 'lodash';
import * as React from 'react';

import BaseView from './BaseView';
import { BaseViewProps } from './BaseView';
import Calendar from './Calendar';
import Body from './CalendarBody/Body';
import Header from './CalendarHeader/Header';

import { findHTMLElement } from '../lib';

const YEAR_CALENDAR_ROW_WIDTH = 3;

interface YearViewProps extends BaseViewProps {
  /** An array of years to fill a calendar with. */
  years: string[];
  /** Called after click on next page button. */
  onNextPageBtnClick: () => void;
  /** Called after click on previous page button. */
  onPrevPageBtnClick: () => void;
  /** Called after click on year. */
  onYearClick: (event: React.SyntheticEvent, data: any) => void;
  /** Whether to display previous page button as active or disabled. */
  hasPrevPage: boolean;
  /** Whether to display next page button as active or disabled. */
  hasNextPage: boolean;
  /** Called on calendar cell hover. */
  onCellHover: (event: React.SyntheticEvent, data: any) => void;
  /** Index of a cell that should be displayed as hovered. */
  hovered: number;
  /** Called after click on calendar header. */
  onHeaderClick: () => void;
  /** An array of numbers that represent indexes of years in `years` array that should be displayed as disabled. */
  disabled: number[];
  /** Index of a year in `years` array that should be displayed as active. */
  active: number;
}

class YearView extends BaseView<YearViewProps, any> {
  public render() {
    const {
      years,
      onNextPageBtnClick,
      onPrevPageBtnClick,
      onYearClick,
      hasNextPage,
      hasPrevPage,
      onHeaderClick,
      disabled,
      active,
      hovered,
      onCellHover,
      onMount,
      inline,
      ...rest
    } = this.props;
    const headerTitle = `${_.first(years)} - ${_.last(years)}`;

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
          data={years}
          hovered={hovered}
          onCellHover={onCellHover}
          onCellClick={onYearClick}
          active={active}
          disabled={disabled} />
      </Calendar>
    );
  }
}

export default YearView;

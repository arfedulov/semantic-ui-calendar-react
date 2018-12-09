import * as React from 'react';

import BaseView, { BaseViewProps } from './BaseView';
import Calendar from './Calendar';
import Body from './CalendarBody/Body';
import Header, { HeaderProps } from './CalendarHeader/Header';

import { findHTMLElement } from '../lib';

const MINUTE_CALENDAR_ROW_WIDTH = 3;

interface MinuteViewProps extends BaseViewProps {
  /** Array of minutes to fill a calendar with. */
  minutes: string[];
  /** Called after click on minute. */
  onMinuteClick: (e: React.SyntheticEvent, data: any) => void;
  /** Called on calendar cell hover. */
  onCellHover: (e: React.SyntheticEvent, data: any) => void;
  /** Index of a cell that should be displayed as hovered. */
  hovered?: number;
  /** Called after click on next page button. */
  onNextPageBtnClick?: () => void;
  /** Called after click on previous page button. */
  onPrevPageBtnClick?: () => void;
  /** Whether to display previous page button as active or disabled. */
  hasPrevPage?: boolean;
  /** Whether to display next page button as active or disabled. */
  hasNextPage?: boolean;
  /** Called after click on calendar header. */
  onHeaderClick?: () => void;
  /** Minute index to display as active. */
  active?: number;
  /** A date that is displayed in calendar header. */
  currentDate?: string;
}

class MinuteView extends BaseView<MinuteViewProps, any> {
  public render() {
    const {
      minutes,
      hasHeader,
      onMinuteClick,
      onNextPageBtnClick,
      onPrevPageBtnClick,
      hasNextPage,
      hasPrevPage,
      onHeaderClick,
      active,
      currentDate,
      hovered,
      onCellHover,
      onMount,
      inline,
      ...rest
    } = this.props;
    const headerProps: HeaderProps = {
      onHeaderClick,
      onNextPageBtnClick,
      onPrevPageBtnClick,
      hasNextPage,
      hasPrevPage,
      title: currentDate,
      width: MINUTE_CALENDAR_ROW_WIDTH,
      displayWeeks: false,
    };

    return (
      <Calendar ref={(e) => this.calendarNode = findHTMLElement(e)} outlineOnFocus={inline} {...rest}>
        { hasHeader && <Header { ...headerProps } /> }
        <Body
          width={MINUTE_CALENDAR_ROW_WIDTH}
          data={minutes}
          hovered={hovered}
          onCellHover={onCellHover}
          onCellClick={onMinuteClick}
          active={active} />
      </Calendar>
    );
  }
}

export default MinuteView;

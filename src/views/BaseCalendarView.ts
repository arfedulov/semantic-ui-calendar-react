import * as React from 'react';

export interface BaseCalendarViewProps {
  /** Used for passing calendar dom element to parent component. */
  onMount: (e: HTMLElement) => void;
  /** Whether a calendar is inside a popup or inline. */
  inline: boolean;
  /** Whether a calendar has header. */
  hasHeader: boolean;
  /** An array of values to fill a calendar with (dates, or years, or anything like that). */
  values: string[];
  /** Called after clicking on particular value (date, year or anything like that). */
  onValueClick: (e: React.SyntheticEvent, data: any) => void;
  /** Called on calendar cell hover. */
  onCellHover: (e: React.SyntheticEvent, data: any) => void;
  /** Index of a cell that should be displayed as hovered. */
  hoveredItemIndex?: number;
  /** An array of cell positions to display as disabled. */
  disabledItemIndexes?: number[];
}

export interface SingleSelectionCalendarViewProps {
  /** Position of a cell to display as active. */
  activeItemIndex?: number;
}

export interface RangeIndexes {
  start: number | undefined;
  end: number | undefined;
}

export interface RangeSelectionCalendarViewProps {
  /** Currently selected range value (from - to) that is displayed in calendar header. */
  currentRangeHeadingValue: string;
  /** Indexes of start and end values of currently selected range (to display as active). */
  activeRange: RangeIndexes;
}

export interface CalendarWithHeaderViewProps {
  /** Called after click on next page button. */
  onNextPageBtnClick: () => void;
  /** Called after click on previous page button. */
  onPrevPageBtnClick: () => void;
  /** Whether to display previous page button as active or disabled. */
  hasPrevPage: boolean;
  /** Whether to display next page button as active or disabled. */
  hasNextPage: boolean;
  /** A value (date, year or anything like that) that is displayed in calendar header. */
  currentHeadingValue: string;
  /** Called after click on calendar header. */
  onHeaderClick: () => void;
}

export interface CalendarWithOptionalHeaderViewProps {
  /** Called after click on next page button. */
  onNextPageBtnClick?: () => void;
  /** Called after click on previous page button. */
  onPrevPageBtnClick?: () => void;
  /** Whether to display previous page button as active or disabled. */
  hasPrevPage?: boolean;
  /** Whether to display next page button as active or disabled. */
  hasNextPage?: boolean;
  /** A value (date, year or anything like that) that is displayed in calendar header. */
  currentHeadingValue?: string;
  /** Called after click on calendar header. */
  onHeaderClick?: () => void;
}

/** Base class for picker view components. */
class BaseCalendarView<P extends BaseCalendarViewProps, S> extends React.Component<P, S> {
  protected calendarNode: HTMLElement | undefined;

  public componentDidMount() {
    if (this.props.onMount) {
      this.props.onMount(this.calendarNode);
    }
  }
}

export default BaseCalendarView;

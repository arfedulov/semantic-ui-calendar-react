import * as React from 'react';
import { SemanticCOLORS } from 'semantic-ui-react';

export interface BaseCalendarViewProps {
  /** Used for passing calendar dom element to parent component. */
  onMount: (e: HTMLElement) => void;
  /** Called on calendar blur. */
  onBlur: () => void;
  /** Whether a calendar is inside a popup or inline. */
  inline: boolean;
  /** An array of values to fill a calendar with (dates, or years, or anything like that). */
  values: string[];
  /** Called after clicking on particular value (date, year or anything like that). */
  onValueClick: (e: React.SyntheticEvent<HTMLElement>, data: OnValueClickData) => void;
  /** Called on calendar cell hover. */
  onCellHover: (e: React.SyntheticEvent<HTMLElement>, data: any) => void;
  /** Index of a cell that should be displayed as hovered. */
  hoveredItemIndex?: number;
  /** An array of cell positions to display as disabled. */
  disabledItemIndexes?: number[];
  /** An array of cell positions to display as marked. */
  markedItemIndexes?: number[];
  /** An array of cell positions to display as marked. */
  markColor?: SemanticCOLORS;
  /** Moment date localization */
  localization?: string;
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
  onNextPageBtnClick: (e?: React.SyntheticEvent<HTMLElement>, data?: any, cb?: () => void) => void;
  /** Called after click on previous page button. */
  onPrevPageBtnClick: (e?: React.SyntheticEvent<HTMLElement>, data?: any, cb?: () => void) => void;
  /** Whether to display previous page button as active or disabled. */
  hasPrevPage: boolean;
  /** Whether to display next page button as active or disabled. */
  hasNextPage: boolean;
  /** Called after click on calendar header. */
  onHeaderClick: () => void;
}

export interface HeadingValueProps {
  /** A value (date, year or anything like that) that is displayed in calendar header. */
  currentHeadingValue: string;
}

// export interface CalendarWithHeaderViewProps extends CalendarWithHeaderViewPropsBase {
//   /** A value (date, year or anything like that) that is displayed in calendar header. */
//   currentHeadingValue: string;
// }

export interface CalendarWithOptionalHeaderViewProps {
  /** Whether a calendar has header. */
  hasHeader: boolean;
  /** Called after click on next page button. */
  onNextPageBtnClick?: (e?: React.SyntheticEvent<HTMLElement>, data?: any, cb?: () => void) => void;
  /** Called after click on previous page button. */
  onPrevPageBtnClick?: (e?: React.SyntheticEvent<HTMLElement>, data?: any, cb?: () => void) => void;
  /** Whether to display previous page button as active or disabled. */
  hasPrevPage?: boolean;
  /** Whether to display next page button as active or disabled. */
  hasNextPage?: boolean;
  /** A value (date, year or anything like that) that is displayed in calendar header. */
  currentHeadingValue?: string;
  /** Called after click on calendar header. */
  onHeaderClick?: () => void;
}

export interface OnValueClickData {
  [key: string]: any;
  /** Position of the clicked cell. */
  itemPosition: number;
  /** Text content of the clicked cell. */
  value: string;
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

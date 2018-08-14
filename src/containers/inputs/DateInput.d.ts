import * as React from 'react';
import { Moment } from 'moment';

export interface DateInputProps {
  [key: string]: any;

  /**
   * Called on change.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props and proposed value.
   */
  onChange?: (
    event: React.SyntheticEvent<HTMLInputElement>,
    data: DateInputOnChangeData
  ) => void;

  /** Shorthand for Icon. */
  icon?: any;

  /** Position for the popup. */
  popupPosition?:
    | 'top left'
    | 'top right'
    | 'bottom left'
    | 'bottom right'
    | 'right center'
    | 'left center'
    | 'top center'
    | 'bottom center';

  /** Should close when cursor leaves calendar popup. */
  closeOnMouseLeave?: boolean;

  /** A date input can be formatted to appear inline in other content. */
  inline?: boolean;

  /** Current value. Creates a controlled component. */
  value?: string;

  /** Date formatting string. */
  dateFormat?: string;

  /** Display mode to start. */
  startMode?: 'year' | 'month' | 'day';

  /** Should popup close after date selection. */
  closable?: boolean;

  /** Date to display initially when no date is selected. */
  initialDate?: string | Date | Moment;

  /** Date or list of dates that are displayed as disabled. */
  disable?: string | Moment | string[] | Moment[];

  /** Maximum date that can be selected. */
  maxDate?: string | Moment;

  /** Minimum date that can be selected. */
  minDate?: string | Moment;

  /** A field can have its label next to instead of above it. */
  inlineLabel?: boolean;
}

export interface DateInputOnChangeData extends DateInputProps {
  value: string;
}

declare class DateInput extends React.Component<DateInputProps, {}> {}

export default DateInput;

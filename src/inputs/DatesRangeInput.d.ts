import * as React from 'react';
import { Moment } from 'moment';

export interface DatesRangeInputProps {
  [key: string]: any;

  /**
   * Called when the user attempts to change the value.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props and proposed value.
   */
  onChange: (
    event: React.SyntheticEvent<HTMLInputElement>,
    data: DatesRangeInputOnChangeData
  ) => void;

  /**
   * Called on clear.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props and proposed value.
   */
  onClear?: (
    event: React.SyntheticEvent<HTMLInputElement>,
    data: DatesRangeInputOnChangeData
  ) => void;

  /** Using the clearable setting will let users remove their selection from a calendar. */
  clearable?: boolean;

  /** Shorthand for Icon. */
  icon?: any;
  
  /** Optional Icon to display inside the clearable Input. */  
  clearIcon?: any;

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

  /** Should close when cursor leaves calendar popup */
  closeOnMouseLeave?: boolean;

  /** A dates range input can be formatted to appear inline in other content. */
  inline?: boolean;

  /** Date formatting string. */
  dateFormat?: string;

  /** Should popup close after date selection. */
  closable?: boolean;

  /** Open a calendar on this date. */
  initialDate?: string | Date | Moment;

  /** Maximum date that can be selected. */
  maxDate?: string | Moment;

  /** Minimum date that can be selected. */
  minDate?: string | Moment;

  /** The node where the picker should mount. */
  mountNode?: any;

  /** A field can have its label next to instead of above it. */
  inlineLabel?: boolean;
}

export interface DatesRangeInputOnChangeData extends DatesRangeInputProps {
  value: string;
}

declare class DatesRangeInput extends React.Component<
  DatesRangeInputProps,
  {}
> {}

export default DatesRangeInput;

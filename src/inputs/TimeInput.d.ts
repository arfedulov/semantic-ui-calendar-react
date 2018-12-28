import * as React from 'react';

export interface TimeInputProps {
  [key: string]: any;

  /**
   * Called when the user attempts to change the value.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props and proposed value.
   */
  onChange: (
    event: React.SyntheticEvent<HTMLInputElement>,
    data: TimeInputOnChangeData
  ) => void;

  /**
   * Called on clear.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props and proposed value.
   */
  onClear?: (
    event: React.SyntheticEvent<HTMLInputElement>,
    data: TimeInputOnChangeData
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

  /** If true, minutes picker won't be shown after picking the hour. */
  disableMinute?: boolean;

  /** A time input can be formatted to appear inline in other content. */
  inline?: boolean;

  /** Current value. Creates a controlled component. */
  value?: string;

  /** Should popup close after date selection. */
  closable?: boolean;

  /** The node where the picker should mount. */
  mountNode?: any;

  /** A field can have its label next to instead of above it. */
  inlineLabel?: boolean;

  /** One of ["24", "AMPM", "ampm"]. */
  timeFormat?: '24' | 'AMPM' | 'ampm';
}

export interface TimeInputOnChangeData extends TimeInputProps {
  value: string;
}

declare class TimeInput extends React.Component<TimeInputProps, {}> {}

export default TimeInput;

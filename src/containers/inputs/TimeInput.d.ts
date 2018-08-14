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

  /** Should close when cursor leaves calendar popup */
  closeOnMouseLeave?: boolean;

  /** A time input can be formatted to appear inline in other content. */
  inline?: boolean;

  /** Current value. Creates a controlled component. */
  value?: string;

  /** Should popup close after date selection. */
  closable?: boolean;

  /** A field can have its label next to instead of above it. */
  inlineLabel?: boolean;
}

export interface TimeInputOnChangeData extends TimeInputProps {
  value: string;
}

declare class TimeInput extends React.Component<TimeInputProps, {}> {}

export default TimeInput;

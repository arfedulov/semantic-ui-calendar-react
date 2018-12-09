import * as React from 'react';

export interface YearInputProps {
  [key: string]: any;

  /**
   * Called when the user attempts to change the value.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props and proposed value.
   */
  onChange: (
    event: React.SyntheticEvent<HTMLInputElement>,
    data: YearInputOnChangeData
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

  /** A year input can be formatted to appear inline in other content. */
  inline?: boolean;

  /** Current value. Creates a controlled component. */
  value?: string;

  /** Should popup close after date selection. */
  closable?: boolean;

  /** A field can have its label next to instead of above it. */
  inlineLabel?: boolean;

  /** The node where the picker should mount. */
  mountNode?: any;
}

export interface YearInputOnChangeData extends YearInputProps {
  value: string;
}

declare class YearInput extends React.Component<YearInputProps, {}> {}

export default YearInput;

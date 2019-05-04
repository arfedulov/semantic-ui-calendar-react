import { default as moment, Moment } from 'moment';
import * as React from 'react';
import {
  SemanticTRANSITIONS,
  SemanticCOLORS,
  SemanticICONS,
} from 'semantic-ui-react';

import {
  TimeFormat,
} from '../pickers/BasePicker';

export interface BaseInputProps {
  [key: string]: any;
  /** Currently selected value. */
  value: string;
  /** Called on selected value change. */
  onChange: (e: React.SyntheticEvent<HTMLElement>, data: any) => void;
  /** If true, popup closes after selecting a value. */
  closable?: boolean;
  /** An input can be formatted to appear inline in other content. */
  inline?: boolean;
  /** Optional icon to display inside the Input. */
  icon?: SemanticICONS | false;
  /** Icon position inside Input. Default: 'right'. */
  iconPosition?: 'right' | 'left';
  /**
   * Called on clear.
   *
   * @param {SyntheticEvent} event - React's original SyntheticEvent.
   * @param {object} data - All props and proposed value.
   */
  onClear?: (
    event: React.SyntheticEvent<HTMLInputElement>,
    data: any,
  ) => void;
  /** Using the clearable setting will let users remove their selection from a calendar. */
  clearable?: boolean;
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
  /** Should close when cursor leaves calendar popup. */
  closeOnMouseLeave?: boolean;
  /** The node where the picker should mount. */
  mountNode?: any;
  /** A field can have its label next to instead of above it. */
  inlineLabel?: boolean;
  /** Picker width (any value that `style.width` can take). */
  pickerWidth?: string;
  /** Style object for picker. */
  pickerStyle?: object;
  /** Duration of the CSS transition animation in milliseconds. */
  duration?: number;
  /** Named animation event to used. Must be defined in CSS. */
  animation?: SemanticTRANSITIONS;
  /** Moment date localization. */
  localization?: string;
  /** Try to prevent mobile keyboard appearing. */
  hideMobileKeyboard?: boolean;
}

export interface MarkedValuesProps {
  /** Array of marked dates. */
  marked?: Moment[] | Date[];
  /** String specifying the mark color (Optional). */
  markColor?: SemanticCOLORS;
}

export interface DateRelatedProps {
  /** Moment date formatting string. */
  dateFormat?: string;
  /** Date to display initially when no date is selected. */
  initialDate?: string | Date | Moment;
}

export interface TimeRelatedProps {
  /** Time format. */
  timeFormat?: TimeFormat;
  /** If true, minutes picker won't be shown after picking the hour. */
  disableMinute?: boolean;
}

export interface DisableValuesProps {
  /** Date or list of dates that are displayed as disabled. */
  disable?:
  | string
  | string[]
  | Moment
  | Moment[]
  | Date
  | Date[];
}

export interface EnableValuesProps {
  /** Date or list of dates that are enabled (the rest are disabled). */
  enable?:
  | string
  | string[]
  | Moment
  | Moment[]
  | Date
  | Date[];
}

export interface MinMaxValueProps {
  /** Maximum date that can be selected. */
  maxDate?:
  | string
  | Moment
  | Date;
  /** Minimum date that can be selected. */
  minDate?:
  | string
  | Moment
  | Date;
}

export interface MultimodeProps {
  /** Preserve viewmode on focus? */
  preserveViewMode?: boolean;
}

export interface RangeRelatedProps {
  /** Allow end date to be the same as start date. */
  allowSameEndDate?: boolean;
}

export interface BaseInputState {
  popupIsClosed: boolean;
}

abstract class BaseInput<P extends BaseInputProps,
  S extends BaseInputState> extends React.Component<P, S> {
  public static defaultProps = {
    inline: false,
    localization: moment.locale(),
  };

  private calendarNode: HTMLElement;

  private inputNode: HTMLElement;

  protected closePopup = (): void => {
    this.setState({ popupIsClosed: true });
  }

  protected openPopup = (): void => {
    this.setState({ popupIsClosed: false });
  }

  protected isPickerInFocus = (): boolean => {
    return document.activeElement === this.calendarNode;
  }

  protected isTriggerInFocus = (): boolean => {
    return document.activeElement === this.inputNode;
  }

  protected onModeSwitch = (): void => {
    // when using keyboard for selecting values on inline calendar
    // and when mode switches, picker looses focus.
    // In order to preserve focus on active picker
    // we call focus() on `calendarNode`.
    // `calendarNode` goes from *View component via
    // `this.onCalendarViewMount` callback
    if (this.props.inline
      && !this.isPickerInFocus()
      && this.calendarNode) {
      this.calendarNode.focus();
    }
  }

  protected onCalendarViewMount = (calendarNode: HTMLElement): void => {
    this.calendarNode = calendarNode;
  }

  protected onInputViewMount = (inputNode: HTMLElement): void => {
    this.inputNode = inputNode;
  }
}

export default BaseInput;

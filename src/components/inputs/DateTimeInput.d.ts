import * as React from 'react';

export interface DateTimeInputProps {
    [key: string]: any;

    /**
     * Called when the user attempts to change the value.
     *
     * @param {SyntheticEvent} event - React's original SyntheticEvent.
     * @param {object} data - All props and proposed value.
     */
    onChange: (event: React.SyntheticEvent<HTMLInputElement>, data: DateTimeInputData) => void;

    /** Shorthand for Icon. */
    icon?: any;

    /** Date formatting string. Anything that that can be passed to ``moment().format`` */
    dateFormat?: string;

    /** Characters that are used to divide date and time in string. */
    divider?: string;

    /** Display mode to start. */
    startMode?: 'year' | 'month' | 'day';

    /** Position for the popup. */
    popupPosition?: 'top left' | 'top right' | 'bottom left' | 'bottom right' | 'right center' | 'left center' | 'top center' | 'bottom center';

    /** A date time input can be formatted to appear inline in other content. */
    inline?: boolean;

    /** Current value. Creates a controlled component. */
    value?: string;
}

export interface DateTimeInputData extends DateTimeInputProps {
    value: string;
}

declare class DateTimeInput extends React.Component<DateTimeInputProps, {}> {
}

export default DateTimeInput;

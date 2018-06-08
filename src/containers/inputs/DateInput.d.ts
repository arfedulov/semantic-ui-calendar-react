import * as React from 'react';

export interface DateInputProps {
    [key: string]: any;

    /**
     * Called when the user attempts to change the value.
     *
     * @param {SyntheticEvent} event - React's original SyntheticEvent.
     * @param {object} data - All props and proposed value.
     */
    onChange: (event: React.SyntheticEvent<HTMLInputElement>, data: DateInputOnChangeData) => void;

    /** Shorthand for Icon. */
    icon?: any;

    /** Date formatting string. Anything that that can be passed to ``moment().format`` */
    dateFormat?: string;

    /** Display mode to start. */
    startMode?: 'year' | 'month' | 'day';

    /** Position for the popup. */
    popupPosition?: 'top left' | 'top right' | 'bottom left' | 'bottom right' | 'right center' | 'left center' | 'top center' | 'bottom center';

    /** A date input can be formatted to appear inline in other content. */
    inline?: boolean;

    /** Current value. Creates a controlled component. */
    value?: string;

    /** Field's name by which `onChange` handler identifies the field. */
    name?: string;
}

export interface DateInputOnChangeData extends DateInputProps {
    value: string;
    name: string;
}

declare class DateInput extends React.Component<DateInputProps, {}> {
}

export default DateInput;

import * as React from 'react';

export interface DateInputProps {
    [key: string]: any;

    /** Shorthand for Icon. */
    icon?: any;

    /** Position for the popup. */
    popupPosition?: 'top left' | 'top right' | 'bottom left' | 'bottom right' | 'right center' | 'left center' | 'top center' | 'bottom center';

    /** Is hoverable */
    hoverable?: boolean;

    /** A date input can be formatted to appear inline in other content. */
    inline?: boolean;

    /** Current value. Creates a controlled component. */
    value?: string;
}

declare class DateInput extends React.Component<DateInputProps, {}> {
}

export default DateInput;

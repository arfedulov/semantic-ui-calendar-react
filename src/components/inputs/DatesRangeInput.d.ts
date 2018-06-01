import * as React from 'react';

export interface DatesRangeInputProps {
    [key: string]: any;

    /**
     * Called when the user attempts to change the value.
     *
     * @param {SyntheticEvent} event - React's original SyntheticEvent.
     * @param {object} data - All props and proposed value.
     */
    onChange: (event: React.SyntheticEvent<HTMLInputElement>, data: DatesRangeInputOnChangeData) => void;

    /** Shorthand for Icon. */
    icon?: any;

    /** Date formatting string. Anything that that can be passed to ``moment().format`` */
    dateFormat?: string;

    /** Character that used to divide dates in string. */
    divider?: string;

    /** Position for the popup. */
    popupPosition?: 'top left' | 'top right' | 'bottom left' | 'bottom right' | 'right center' | 'left center' | 'top center' | 'bottom center';

    /** A dates range input can be formatted to appear inline in other content. */
    inline?: boolean;
}

export interface DatesRangeInputOnChangeData extends DatesRangeInputProps {
    value: string;
}

declare class DatesRangeInput extends React.Component<DatesRangeInputProps, {}> {
}

export default DatesRangeInput;

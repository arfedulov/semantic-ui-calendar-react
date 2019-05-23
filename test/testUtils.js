import * as React from 'react';

export const createRenderViewMock = (output) => {
    return (props) => {
        Object.keys(props).forEach((key) => {
        output[key] = props[key];
        });

        return <div />;
    };
};

import keys from 'lodash/keys';

const getRestProps = (props: object, excludeProps: string[]): object => {
    const rest = {};
    const propNames = keys(props);

    propNames.forEach((name) => {
        if (excludeProps.indexOf(name) < 0) {
            rest[name] = props[name];
        }
    });

    return rest;
};

export default getRestProps;

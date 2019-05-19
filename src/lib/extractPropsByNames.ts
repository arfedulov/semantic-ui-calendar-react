
const extractPropsByNames = (props: object, names: string[]): object => {
    const extractedProps = {};
    names.forEach((name) => {
        if (props.hasOwnProperty(name)) {
            extractedProps[name] = props[name];
        }
    });

    return extractedProps;
};

export default extractPropsByNames;

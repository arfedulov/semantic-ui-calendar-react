import * as moment from 'moment';

export function momentObj(props, propName, componentName) {
  if (props[propName]) {
    const value = props[propName];

    if (moment.isMoment(value)) {
      if (!value.isValid()) {
        return new Error(`${propName} in ${componentName} is invalid 'moment' object`);
      }
    } else {
      return new Error(`${propName} in ${componentName} is not 'moment' object`);
    }
  }

  return null;
}

export default {
  momentObj,
};

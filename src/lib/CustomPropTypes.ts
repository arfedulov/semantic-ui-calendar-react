import moment from 'moment-mini';

export function momentObj(props, propName, componentName) {
  if (props[propName]) {
    const value = props[propName];

    if (moment.isMoment(value)) {
      if (!value.isValid()) {
        return new Error(`${propName} in ${componentName} is invalid 'moment-mini' object`);
      }
    } else {
      return new Error(`${propName} in ${componentName} is not 'moment-mini' object`);
    }
  }

  return null;
}

export function dateObject(props, propName, componentName) {
  if (props[propName]) {
    const value = props[propName];
    if (value && value.constructor && value.constructor.name) {
      if (value.constructor.name !== 'Date') {
        return new Error(`${propName} in ${componentName} is not 'Date' object`);
      }
    }
  }

  return null;
}

export default {
  momentObj,
  dateObject,
};

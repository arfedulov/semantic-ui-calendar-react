import { assert } from 'chai';
import * as _ from 'lodash';
import * as moment from 'moment';

import {
  getInitializer,
  parseValue,
} from '../../src/inputs/parse';

describe('getInitializer', () => {
  const dateFormat = 'YYYY-MM-DD HH:mm';

  describe('`dateParams` param provided', () => {
    it('return valid moment created from `dateParams`', () => {
      const dateParams = {
        year: 2018,
        month: 4,
        date: 15,
        hour: 14,
        minute: 12,
      };
      assert(moment.isMoment(getInitializer({ dateFormat, dateParams })), 'return moment');
      assert(getInitializer({ dateFormat, dateParams }).isValid(), 'return valid moment');
      assert(
        getInitializer({ dateFormat, dateParams }).isSame(moment(dateParams), 'minute'),
        'return correct moment');
    });
  });

  describe('`initialDate` param provided', () => {
    it('return valid moment created from `initialDate`', () => {
      const initialDate = '2018-05-15 14:12';
      assert(moment.isMoment(getInitializer({ initialDate, dateFormat })), 'return moment');
      assert(getInitializer({ initialDate, dateFormat }).isValid(), 'return valid moment');
      assert(
        getInitializer({ initialDate, dateFormat }).isSame(moment(initialDate, dateFormat), 'minute'),
        'return correct moment');
    });
  });

  describe('`initialDate`, and `dateParams` params provided', () => {
    it('return valid moment created from `value`', () => {
      const value = '2018-05-15 14:12';
      const initialDate = '2020-05-15 15:00';
      const dateParams = {
        year: 2018,
        month: 4,
        date: 15,
        hour: 14,
        minute: 12,
      };
      assert(moment.isMoment(getInitializer({ initialDate, dateFormat, dateParams })), 'return moment');
      assert(getInitializer({ initialDate, dateFormat, dateParams }).isValid(), 'return valid moment');
      assert(
        getInitializer({ initialDate, dateFormat, dateParams }).isSame(moment(value, dateFormat), 'minute'),
        'return correct moment');
    });
  });
});

describe('parseValue', () => {
  describe('`value` param provided', () => {
    it('create moment from input string', () => {
      const value = 'Sep';
      const dateFormat = 'MMM';
  
      assert(moment.isMoment(parseValue(value, dateFormat)), 'return moment instance');
      assert(parseValue(value, dateFormat).isValid(), 'return valid moment instance');
      assert(parseValue(value, dateFormat).isSame(moment('Sep', 'MMM'), 'year'), 'return correct moment');
    });
  });

  describe('`value` param is not provided', () => {
    it('return undefined', () => {
      const dateFormat = 'MMM';
  
      assert(_.isUndefined(parseValue(undefined, dateFormat)), 'return undefined');
    });
  });
});

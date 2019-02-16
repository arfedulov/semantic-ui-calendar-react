import { assert } from 'chai';
import * as _ from 'lodash';
import moment from 'moment';

import {
  getInitializer,
  parseValue,
  dateValueToString,
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
      const value = 'Sep 2015';
      const dateFormat = 'MMM YYYY';
      const locale = 'en';

      assert(moment.isMoment(parseValue(value, dateFormat, locale)), 'return moment instance');
      assert(parseValue(value, dateFormat).isValid(), 'return valid moment instance');
      assert(parseValue(value, dateFormat).isSame(moment('Sep 2015', 'MMM YYYY'), 'month'), 'return correct moment');
    });

    it('create moment from input Date', () => {
      const value = new Date('2015-02-15');
      const dateFormat = 'does not matter if value is Date';
      const locale = 'en';

      const parsed = parseValue(value, dateFormat, locale);

      assert(moment.isMoment(parsed), 'return moment instance');
      assert(parsed.isValid(), 'return valid moment instance');
      assert(parsed.isSame(moment('2015-02-15', 'YYYY-MM-DD'), 'date'), 'return correct moment');
    });

    it('create moment from input Moment', () => {
      const value = moment('2015-02-15', 'YYYY-MM-DD');
      const dateFormat = 'does not matter if value is Moment';
      const locale = 'en';

      const parsed = parseValue(value, dateFormat, locale);

      assert(moment.isMoment(parsed), 'return moment instance');
      assert(parsed.isValid(), 'return valid moment instance');
      assert(parsed.isSame(moment('2015-02-15', 'YYYY-MM-DD'), 'date'), 'return correct moment');
    });
  });

  describe('`value` param is not provided', () => {
    it('return undefined', () => {
      const dateFormat = 'MMM';
      const locale = 'en';

      assert(_.isUndefined(parseValue(undefined, dateFormat, locale)), 'return undefined');
    });
  });
});

describe('dateValueToString()', () => {
  it('handles string input value', () => {
    const inputValue = '17-04-2030';
    const dateFormat = 'DD-MM-YYYY';
    const locale = 'en';

    const producedValue = dateValueToString(inputValue, dateFormat, locale);

    assert(_.isString(producedValue), 'return string value');
    assert.equal(producedValue, inputValue, 'return correct string');
  });

  it('handles Date input value', () => {
    const inputValue = new Date('2015-08-11');
    const dateFormat = 'DD-MM-YYYY';
    const locale = 'en';

    const producedValue = dateValueToString(inputValue, dateFormat, locale);

    assert(_.isString(producedValue), 'return string value');
    assert.equal(producedValue, '11-08-2015', 'return correct string');
  });

  it('handles Moment input value', () => {
    const inputValue = moment('2015-08-11', 'YYYY-MM-DD');
    const dateFormat = 'DD-MM-YYYY';
    const locale = 'en';

    const producedValue = dateValueToString(inputValue, dateFormat, locale);

    assert(_.isString(producedValue), 'return string value');
    assert.equal(producedValue, '11-08-2015', 'return correct string');
  });
});

import { assert } from 'chai';
import * as _ from 'lodash';
import moment from 'moment';

import { testExport } from '../../../src/pickers/dayPicker/sharedFunctions';
const {
  getDaysArray,
  getBrakepoints,
  getDefaultEnabledDayPositions,
  getDisabledDays,
  isNextPageAvailable,
  isPrevPageAvailable,
} = testExport;

describe('getDaysArray', () => {
  const start = 30;
  const brakepoints = [31, 31];
  const length = 6 * 7;

  it('return array of numbers', () => {
    const shouldReturn = [
      30, 31, 1, 2, 3, 4, 5,
      6, 7, 8, 9, 10, 11, 12,
      13, 14, 15, 16, 17, 18, 19,
      20, 21, 22, 23, 24, 25, 26,
      27, 28, 29, 30, 31, 1, 2,
      3, 4, 5, 6, 7, 8, 9,
    ];
    assert(_.isArray(getDaysArray(start, brakepoints, length)), 'return array');
    assert.equal(getDaysArray(start, brakepoints, length).length, length, 'return array of length 6 * 7');
    getDaysArray(start, brakepoints, length).forEach((day, i) => {
      assert.equal(day, shouldReturn[i], 'contains corect days');
    });
  });
});

describe('getBrakepoints', () => {

  it('return array of correct numbers', () => {
    const date = moment('2018-08-12');
    /*[
      29, 30, 31, 1, 2, 3, 4,
      5, 6, 7, 8, 9, 10, 11,
      12, 13, 14, 15, 16, 17, 18,
      19, 20, 21, 22, 23, 24, 25,
      26, 27, 28, 29, 30, 31, 1,
      2, 3, 4, 5, 6, 7, 8,
    ]
    */
    const shouldReturn = [31, 31];
    assert(_.isArray(getBrakepoints(date)), 'return array');
    assert.equal(getBrakepoints(date).length, 2, 'return array of length 2');
    getBrakepoints(date).forEach((bp, i) => {
      assert.equal(bp, shouldReturn[i], 'contains corect brakepoints');
    });
  });

  it('return array of correct numbers', () => {
    const date = moment('2018-09-12');
    /*[
      26, 27, 28, 29, 30, 31, 1,
      2, 3, 4, 5, 6, 7, 8,
      9, 10, 11, 12, 13, 14, 15,
      16, 17, 18, 19, 20, 21, 22,
      23, 24, 25, 26, 27, 28, 29,
      30, 1, 2, 3, 4, 5, 6,
    ]
    */
    const shouldReturn = [31, 30];
    assert(_.isArray(getBrakepoints(date)), 'return array');
    assert.equal(getBrakepoints(date).length, 2, 'return array of length 2');
    getBrakepoints(date).forEach((bp, i) => {
      assert.equal(bp, shouldReturn[i], 'contains corect brakepoints');
    });
  });
});

describe('getDefaultEnabledDayPositions', () => {
  const date = moment('2018-08-12');

  describe('return array of day positions (days from given month)', () => {
    it('return expected object', () => {

      const allDays = [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ];

      const shouldReturn = [
        3, 4, 5, 6, 7, 8, 9,
        10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
        32, 33,
      ]; // days in given month position numbers
      assert(_.isArray(getDefaultEnabledDayPositions(allDays, date)), 'return array');
      assert.equal(getDefaultEnabledDayPositions(allDays, date).length, 31, 'return array of length 31');
      getDefaultEnabledDayPositions(allDays, date).forEach((day) => {
        assert(_.isNumber(day), 'contains numbers');
      });
      const producedDays = getDefaultEnabledDayPositions(allDays, date);
      shouldReturn.forEach((expectedDay) => {
        assert(_.includes(producedDays, expectedDay), 'contains correct posiotion numbers');
      });
    });
  });
});

describe('getDisabledDays', () => {
  const date = moment('2018-08-12');
  const DAYS_ON_PAGE = 42;

  describe('minDate, maxDate, disable are all undefined', () => {
    it('return just default disabled days', () => {

      /*
      [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ]
      */

      const shouldReturn = [
        0, 1, 2,
        34, 35, 36, 37, 38, 39, 40, 41,
      ]; // days in given month position numbers
      assert(_.isArray(getDisabledDays(undefined, undefined, undefined, date, DAYS_ON_PAGE)), 'return array');
      assert.equal(getDisabledDays(undefined, undefined, undefined, date, DAYS_ON_PAGE).length, 11, 'return array of length 11');
      getDisabledDays(undefined, undefined, undefined, date, DAYS_ON_PAGE).forEach((day) => {
        assert(_.isNumber(day), 'contains numbers');
      });
      const producedDays = getDisabledDays(undefined, undefined, undefined, date, DAYS_ON_PAGE);
      shouldReturn.forEach((expectedDay) => {
        assert(_.includes(producedDays, expectedDay), 'contains correct posiotion numbers');
      });
    });
  });

  describe('`enable` is defined', () => {
    const enable = [
      moment('2018-08-09'), moment('2018-08-12'), moment('2018-08-16'),
    ];
    it('return all days positions except those that are in `enable` param', () => {

      /*
      [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ]
      */

      const shouldReturn = _.range(0, 41).filter(position => !_.includes([11, 14, 18], position));
      assert(_.isArray(getDisabledDays(undefined, undefined, undefined, date, DAYS_ON_PAGE, enable)), 'return array');
      assert.equal(getDisabledDays(undefined, undefined, undefined, date, DAYS_ON_PAGE, enable).length, 39, 'return array of length 39');
      getDisabledDays(undefined, undefined, undefined, date, DAYS_ON_PAGE, enable).forEach((day) => {
        assert(_.isNumber(day), 'contains numbers');
      });
      const producedDays = getDisabledDays(undefined, undefined, undefined, date, DAYS_ON_PAGE, enable);
      shouldReturn.forEach((expectedDay) => {
        assert(_.includes(producedDays, expectedDay), 'contains correct position numbers');
      });
    });
  });

  describe('`disable` is defined', () => {
    const disable = [
      moment('2018-08-09'), moment('2018-08-12'), moment('2018-08-16'),
    ];
    it('return default disabled days and those that are in `disable` param', () => {

      /*
      [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ]
      */

      const shouldReturn = [
        0, 1, 2,
        11, 14, 18,
        34, 35, 36, 37, 38, 39, 40, 41,
      ]; // days in given month position numbers
      assert(_.isArray(getDisabledDays(disable, undefined, undefined, date, DAYS_ON_PAGE)), 'return array');
      assert.equal(getDisabledDays(disable, undefined, undefined, date, DAYS_ON_PAGE).length, 14, 'return array of length 14');
      getDisabledDays(disable, undefined, undefined, date, DAYS_ON_PAGE).forEach((day) => {
        assert(_.isNumber(day), 'contains numbers');
      });
      const producedDays = getDisabledDays(disable, undefined, undefined, date, DAYS_ON_PAGE);
      shouldReturn.forEach((expectedDay) => {
        assert(_.includes(producedDays, expectedDay), 'contains correct posiotion numbers');
      });
    });
  });

  describe('`minDate` is defined', () => {
    const minDate = moment('2018-08-09');
    it('return default disabled days and those that are before `minDate`', () => {

      /*
      [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ]
      */

      const shouldReturn = [
        0, 1, 2,
        3, 4, 5, 6, 7, 8, 9, 10,
        34, 35, 36, 37, 38, 39, 40, 41,
      ]; // days in given month position numbers
      assert(_.isArray(getDisabledDays(undefined, undefined, minDate, date, DAYS_ON_PAGE)), 'return array');
      assert.equal(getDisabledDays(undefined, undefined, minDate, date, DAYS_ON_PAGE).length, 19, 'return array of length 19');
      getDisabledDays(undefined, undefined, minDate, date, DAYS_ON_PAGE).forEach((day) => {
        assert(_.isNumber(day), 'contains numbers');
      });
      const producedDays = getDisabledDays(undefined, undefined, minDate, date, DAYS_ON_PAGE);
      shouldReturn.forEach((expectedDay) => {
        assert(_.includes(producedDays, expectedDay), 'contains correct posiotion numbers');
      });
    });
  });

  describe('`maxDate` is defined', () => {
    const maxDate = moment('2018-08-29');
    it('return default disabled days and those that are before `minDate`', () => {

      /*
      [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ]
      */

      const shouldReturn = [
        0, 1, 2,
        32, 33,
        34, 35, 36, 37, 38, 39, 40, 41,
      ]; // days in given month position numbers
      assert(_.isArray(getDisabledDays(undefined, maxDate, undefined, date, DAYS_ON_PAGE)), 'return array');
      assert.equal(getDisabledDays(undefined, maxDate, undefined, date, DAYS_ON_PAGE).length, 13, 'return array of length 13');
      getDisabledDays(undefined, maxDate, undefined, date, DAYS_ON_PAGE).forEach((day) => {
        assert(_.isNumber(day), 'contains numbers');
      });
      const producedDays = getDisabledDays(undefined, maxDate, undefined, date, DAYS_ON_PAGE);
      shouldReturn.forEach((expectedDay) => {
        assert(_.includes(producedDays, expectedDay), 'contains correct posiotion numbers');
      });
    });
  });

  describe('`maxDate` is in previous month or before', () => {
    const maxDate = moment('2018-07-31');
    it('return all days from `date` month', () => {

      /*
      [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ]
      */

      const shouldReturn = _.range(0, DAYS_ON_PAGE); // days in given month position numbers
      assert(_.isArray(getDisabledDays(undefined, maxDate, undefined, date, DAYS_ON_PAGE)), 'return array');
      assert.equal(getDisabledDays(undefined, maxDate, undefined, date, DAYS_ON_PAGE).length, 42, 'return array of length 42');
      getDisabledDays(undefined, maxDate, undefined, date, DAYS_ON_PAGE).forEach((day) => {
        assert(_.isNumber(day), 'contains numbers');
      });
      const producedDays = getDisabledDays(undefined, maxDate, undefined, date, DAYS_ON_PAGE);
      shouldReturn.forEach((expectedDay) => {
        assert(_.includes(producedDays, expectedDay), 'contains correct posiotion numbers');
      });
    });
  });

  describe('`minDate` is in next month or after', () => {
    const minDate = moment('2018-09-01');
    it('return all days from `date` month', () => {

      /*
      [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ]
      */

      const shouldReturn = _.range(0, DAYS_ON_PAGE); // days in given month position numbers
      assert(_.isArray(getDisabledDays(undefined, undefined, minDate, date, DAYS_ON_PAGE)), 'return array');
      assert.equal(getDisabledDays(undefined, undefined, minDate, date, DAYS_ON_PAGE).length, 42, 'return array of length 42');
      getDisabledDays(undefined, undefined, minDate, date, DAYS_ON_PAGE).forEach((day) => {
        assert(_.isNumber(day), 'contains numbers');
      });
      const producedDays = getDisabledDays(undefined, undefined, minDate, date, DAYS_ON_PAGE);
      shouldReturn.forEach((expectedDay) => {
        assert(_.includes(producedDays, expectedDay), 'contains correct posiotion numbers');
      });
    });
  });
});

describe('isNextPageAvailable', () => {
  const date = moment('2018-08-12');

  describe('maxDate is undefined', () => {
    it('return true', () => {
      /*
      [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ]
      */

      assert(_.isBoolean(isNextPageAvailable(date)), 'return boolean');
      assert.isTrue(isNextPageAvailable(date), 'return true');
    });
  });

  describe('maxDate is in next month', () => {
    const maxDate = moment('2018-09-01');
    it('return true', () => {
      /*
      [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ]
      */

      assert(_.isBoolean(isNextPageAvailable(date, maxDate)), 'return boolean');
      assert.isTrue(isNextPageAvailable(date, maxDate), 'return true');
    });
  });

  describe('maxDate is in current month', () => {
    const maxDate = moment('2018-08-31');
    it('return false', () => {
      /*
      [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ]
      */

      assert(_.isBoolean(isNextPageAvailable(date, maxDate)), 'return boolean');
      assert.isFalse(isNextPageAvailable(date, maxDate), 'return false');
    });
  });

  describe('maxDate is in previous month', () => {
    const maxDate = moment('2018-07-31');
    it('return false', () => {
      /*
      [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ]
      */

      assert(_.isBoolean(isNextPageAvailable(date, maxDate)), 'return boolean');
      assert.isFalse(isNextPageAvailable(date, maxDate), 'return false');
    });
  });

  describe('maxDate is before previous month', () => {
    const maxDate = moment('2018-06-15');
    it('return false', () => {
      /*
      [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ]
      */

      assert(_.isBoolean(isNextPageAvailable(date, maxDate)), 'return boolean');
      assert.isFalse(isNextPageAvailable(date, maxDate), 'return false');
    });
  });
});

describe('isPrevPageAvailable', () => {
  const date = moment('2018-08-12');

  describe('minDate is undefined', () => {
    it('return true', () => {
      /*
      [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ]
      */

      assert(_.isBoolean(isPrevPageAvailable(date)), 'return boolean');
      assert.isTrue(isPrevPageAvailable(date), 'return true');
    });
  });

  describe('minDate is in previous month', () => {
    const minDate = moment('2018-07-31');
    it('return true', () => {
      /*
      [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ]
      */

      assert(_.isBoolean(isPrevPageAvailable(date, minDate)), 'return boolean');
      assert.isTrue(isPrevPageAvailable(date, minDate), 'return true');
    });
  });

  describe('minDate is in current month', () => {
    const minDate = moment('2018-08-01');
    it('return false', () => {
      /*
      [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ]
      */

      assert(_.isBoolean(isPrevPageAvailable(date, minDate)), 'return boolean');
      assert.isFalse(isPrevPageAvailable(date, minDate), 'return false');
    });
  });

  describe('minDate is in next month', () => {
    const minDate = moment('2018-09-01');
    it('return false', () => {
      /*
      [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ]
      */

      assert(_.isBoolean(isPrevPageAvailable(date, minDate)), 'return boolean');
      assert.isFalse(isPrevPageAvailable(date, minDate), 'return false');
    });
  });

  describe('minDate is after next month', () => {
    const minDate = moment('2018-10-15');
    it('return false', () => {
      /*
      [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ]
      */

      assert(_.isBoolean(isPrevPageAvailable(date, minDate)), 'return boolean');
      assert.isFalse(isPrevPageAvailable(date, minDate), 'return false');
    });
  });
});

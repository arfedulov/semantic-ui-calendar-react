import { assert } from 'chai';
import _ from 'lodash';
import moment from 'moment';

import {
  getDaysArray,
  getBrakepoints,
  getDefaultEnabledDayPositions,
} from '../../../src/pickers/dayPicker/sharedFunctions';

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

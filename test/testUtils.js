import test from 'tape';
import { getArrayOfWeeks, isActiveDate, Cycle } from '../src/utils.js';
import moment from 'moment';
import mockdate from 'mockdate';

mockdate.set('2018-05-15');

test('Utils testing: getArrayOfWeeks (ru locale)', (t) => {
  moment.locale('ru');
  const expected = [
    [
      moment('2018-04-30'),
      moment('2018-05-01'),
      moment('2018-05-02'),
      moment('2018-05-03'),
      moment('2018-05-04'),
      moment('2018-05-05'),
      moment('2018-05-06')
    ],
    [
      moment('2018-05-07'),
      moment('2018-05-08'),
      moment('2018-05-09'),
      moment('2018-05-10'),
      moment('2018-05-11'),
      moment('2018-05-12'),
      moment('2018-05-13')
    ],
    [
      moment('2018-05-14'),
      moment('2018-05-15'),
      moment('2018-05-16'),
      moment('2018-05-17'),
      moment('2018-05-18'),
      moment('2018-05-19'),
      moment('2018-05-20')
    ],
    [
      moment('2018-05-21'),
      moment('2018-05-22'),
      moment('2018-05-23'),
      moment('2018-05-24'),
      moment('2018-05-25'),
      moment('2018-05-26'),
      moment('2018-05-27')
    ],
    [
      moment('2018-05-28'),
      moment('2018-05-29'),
      moment('2018-05-30'),
      moment('2018-06-31'),
      moment('2018-06-01'),
      moment('2018-06-02'),
      moment('2018-06-03')
    ],
    [
      moment('2018-06-04'),
      moment('2018-06-05'),
      moment('2018-06-06'),
      moment('2018-06-07'),
      moment('2018-06-08'),
      moment('2018-06-09'),
      moment('2018-06-10')
    ],
  ];
  const comparator = (actual, expected) => {
    if (actual.length !== expected.length) {
      return false;
    }
    for (let i = 0; i < actual.length; i++) {
      if (i > 0) {
        break;
      }
      if (actual[i].length !== expected[i].length) {
        return false;
      }
      for (let j = 0; j < actual[i].length; j ++) {
        if (j > 0) {
          break;
        }
        if (!actual[i][j].isSame(expected[i][j])) {
          return false;
        }
      }
    }
    return true;
  };

  const weekLengthChecker = (arrayOfWeeks) => {
    for (let week of arrayOfWeeks) {
      if (week.length !== 7) {
        return false;
      }
    }
    return true;
  };

  const testingValue = getArrayOfWeeks(moment());
  t.equal(testingValue.length, expected.length, '`getArrayOfWeeks` return array of length 6');
  t.ok(weekLengthChecker(testingValue), 'each week has length 7');
  t.ok(comparator(testingValue, expected), '`getArrayOfWeeks` return expected array of weeks');
  t.end();
});

test('Utils testing: getArrayOfWeeks (en locale)', (t) => {
  moment.locale('en');
  const expected = [
    [
      moment('2018-04-29'),
      moment('2018-04-30'),
      moment('2018-05-01'),
      moment('2018-05-02'),
      moment('2018-05-03'),
      moment('2018-05-04'),
      moment('2018-05-05')
    ],
    [
      moment('2018-05-06'),
      moment('2018-05-07'),
      moment('2018-05-08'),
      moment('2018-05-09'),
      moment('2018-05-10'),
      moment('2018-05-11'),
      moment('2018-05-12')
    ],
    [
      moment('2018-05-13'),
      moment('2018-05-14'),
      moment('2018-05-15'),
      moment('2018-05-16'),
      moment('2018-05-17'),
      moment('2018-05-18'),
      moment('2018-05-19')
    ],
    [
      moment('2018-05-20'),
      moment('2018-05-21'),
      moment('2018-05-22'),
      moment('2018-05-23'),
      moment('2018-05-24'),
      moment('2018-05-25'),
      moment('2018-05-26')
    ],
    [
      moment('2018-05-27'),
      moment('2018-05-28'),
      moment('2018-05-29'),
      moment('2018-05-30'),
      moment('2018-06-31'),
      moment('2018-06-01'),
      moment('2018-06-02')
    ],
    [
      moment('2018-06-03'),
      moment('2018-06-04'),
      moment('2018-06-05'),
      moment('2018-06-06'),
      moment('2018-06-07'),
      moment('2018-06-08'),
      moment('2018-06-09')
    ],
  ];
  const comparator = (actual, expected) => {
    if (actual.length !== expected.length) {
      return false;
    }
    for (let i = 0; i < actual.length; i++) {
      if (i > 0) {
        break;
      }
      if (actual[i].length !== expected[i].length) {
        return false;
      }
      for (let j = 0; j < actual[i].length; j ++) {
        if (j > 0) {
          break;
        }
        if (!actual[i][j].isSame(expected[i][j])) {
          return false;
        }
      }
    }
    return true;
  };

  const weekLengthChecker = (arrayOfWeeks) => {
    for (let week of arrayOfWeeks) {
      if (week.length !== 7) {
        return false;
      }
    }
    return true;
  };

  const testingValue = getArrayOfWeeks(moment());
  t.equal(testingValue.length, expected.length, '`getArrayOfWeeks` return array of length 6');
  t.ok(weekLengthChecker(testingValue), 'each week has length 7');
  t.ok(comparator(testingValue, expected), '`getArrayOfWeeks` return expected array of weeks');
  t.end();
});

test('Utils testing: isActiveDate(dateA, dateB)', (t) => {
  t.notOk(isActiveDate(moment('2015-06-08'), moment('2015-06-09')), '2015-06-08 and 2015-06-09 are different days');
  t.ok(isActiveDate(moment('2015-06-10'), moment('2015-06-10')), '2015-06-10 and 2015-06-10 are the same day');
  t.notOk(isActiveDate(moment('2016-06-08'), moment('2017-06-08')), '2016-06-08 and 2017-06-08 are different days');
  t.notOk(isActiveDate(moment('2015-06-08'), moment('2015-07-08')), '2015-06-08 and 2015-07-08 are different days');
  t.notOk(isActiveDate(moment('2018-05-02'), moment('2018-05-09')), '2018-05-02 and 2018-05-09 are different days');
  t.end();
});

test('Utils testing: isActiveDate(date, datesRange)', (t) => {
  const range = {
    start: moment('2015-06-08'),
    end: moment('2015-06-15')
  };
  const diffMonthRange = {
    start: moment('2015-06-08'),
    end: moment('2015-07-15')
  };
  t.ok(isActiveDate(moment('2015-06-10'), range), '2015-06-10 in range [2015-06-08, 2015-06-15]');
  t.ok(isActiveDate(moment('2015-06-08'), range), '2015-06-08 in range [2015-06-08, 2015-06-15]');
  t.ok(isActiveDate(moment('2015-06-15'), range), '2015-06-15 in range [2015-06-08, 2015-06-15]');
  t.notOk(isActiveDate(moment('2015-06-07'), range), '2015-06-07 out of range [2015-06-08, 2015-06-15]');
  t.notOk(isActiveDate(moment('2015-06-16'), range), '2015-06-16 out of range [2015-06-08, 2015-06-15]');

  t.ok(isActiveDate(moment('2015-06-16'), diffMonthRange), '2015-06-16 in range [2015-06-08, 2015-07-15]');
  t.ok(isActiveDate(moment('2015-07-03'), diffMonthRange), '2015-07-03 in range [2015-06-08, 2015-07-15]');
  t.notOk(isActiveDate(moment('2015-08-03'), diffMonthRange), '2015-08-03 out of range [2015-06-08, 2015-07-15]');
  t.notOk(isActiveDate(moment('2015-05-03'), diffMonthRange), '2015-05-03 out of range [2015-06-08, 2015-07-15]');
  t.end();
});

test('Utils testing: isActiveDate(date, date || datesRange)', (t) => {
  const range = {
    start: moment('2015-06-08'),
    end: moment('2015-06-15')
  };
  const date = moment('2015-06-11');
  t.notOk(isActiveDate(moment('2015-06-10'), date || range), '2015-06-10 not equal 2015-06-11');
  t.ok(isActiveDate(moment('2015-06-11'), date || range), '2015-06-11 equal 2015-06-11');
  t.ok(isActiveDate(moment('2015-06-15'), undefined || range), '2015-06-15 in range [2015-06-08, 2015-06-15]');
  t.ok(isActiveDate(moment('2015-06-14'), undefined || range), '2015-06-14 in range [2015-06-08, 2015-06-15]');
  t.notOk(isActiveDate(moment('2015-06-07'), undefined || range), '2015-06-07 out of range [2015-06-08, 2015-06-15]');
  t.end();
});

test('Utils testing: isActiveDate(date, [someDate, undefined])', (t) => {
  const range = {
    start: moment('2015-06-08'),
    end: undefined
  };
  t.ok(isActiveDate(moment('2015-06-08'), range), '2015-06-08 is start of range [2015-06-08, undefined]');
  t.notOk(isActiveDate(moment('2015-06-09'), range), '2015-06-09 is not active if range [2015-06-08, undefined]');
  t.end();
});

test('Utils testing: isActiveDate(date, [undefined, undefined])', (t) => {
  const range = {
    start: undefined,
    end: undefined
  };
  t.notOk(isActiveDate(moment('2015-06-08'), range), 'should always be falsy');
  t.end();
});

import { assert } from 'chai';
import {
  mount,
} from 'enzyme';
import * as sinon from 'sinon';
import * as React from 'react';
import * as _ from 'lodash';
import moment from 'moment';

import DatesRangePicker from '../../../src/pickers/dayPicker/DatesRangePicker';

describe('<DatesRangePicker />', () => {
  it('initialized with moment', () => {
    const date = moment('2015-05-01');
    const wrapper = mount(<DatesRangePicker initializeWith={date} />);
    assert(
      moment.isMoment(wrapper.state('date')),
      'has moment instance in `date` state field');
    assert(
      wrapper.state('date').isSame(date),
      'initialize `date` state field with moment provided in `initializeWith` prop');
  });
});

describe('<DatesRangePicker />: buildCalendarValues', () => {

  describe('current date is 2018-08-12', () => {
    const date = moment('2018-08-12');

    it('return array of strings', () => {
      const wrapper = mount(<DatesRangePicker initializeWith={date} />);
      const shouldReturn = [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ];
      assert(_.isArray(wrapper.instance().buildCalendarValues()), 'return array');
      assert.equal(wrapper.instance().buildCalendarValues().length, 42, 'return array of length 42');
      wrapper.instance().buildCalendarValues().forEach((date, i) => {
        assert.equal(date, shouldReturn[i], 'contains corect dates');
      });
    });
  });

  describe('current date is 2018-09-12', () => {
    const date = moment('2018-09-12');

    it('return array of strings', () => {
      const wrapper = mount(<DatesRangePicker initializeWith={date} />);
      const shouldReturn = [
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
        '9', '10', '11', '12', '13', '14', '15',
        '16', '17', '18', '19', '20', '21', '22',
        '23', '24', '25', '26', '27', '28', '29',
        '30', '1', '2', '3', '4', '5', '6',
      ];
      assert(_.isArray(wrapper.instance().buildCalendarValues()), 'return array');
      assert.equal(wrapper.instance().buildCalendarValues().length, 42, 'return array of length 42');
      wrapper.instance().buildCalendarValues().forEach((date, i) => {
        assert.equal(date, shouldReturn[i], 'contains corect dates');
      });
    });
  });

  describe('current date is 2017-02-12', () => {
    const date = moment('2017-02-12');

    it('return array of strings', () => {
      const wrapper = mount(<DatesRangePicker initializeWith={date} />);
      const shouldReturn = [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
      ];

      assert(_.isArray(wrapper.instance().buildCalendarValues()), 'return array');
      assert.equal(wrapper.instance().buildCalendarValues().length, 42, 'return array of length 42');
      wrapper.instance().buildCalendarValues().forEach((date, i) => {
        assert.equal(date, shouldReturn[i], 'contains corect dates');
      });
    });
  });

  describe('current date is 2029-11-01', () => {
    const date = moment('2029-11-01');

    it('return array of strings', () => {
      const wrapper = mount(<DatesRangePicker initializeWith={date} />);
      const shouldReturn = [
        '28', '29', '30', '31', '1', '2', '3',
        '4', '5', '6', '7', '8', '9', '10',
        '11', '12', '13', '14', '15', '16', '17',
        '18', '19', '20', '21', '22', '23', '24',
        '25', '26', '27', '28', '29', '30', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ];

      assert(_.isArray(wrapper.instance().buildCalendarValues()), 'return array');
      assert.equal(wrapper.instance().buildCalendarValues().length, 42, 'return array of length 42');
      wrapper.instance().buildCalendarValues().forEach((date, i) => {
        assert.equal(date, shouldReturn[i], 'contains corect dates');
      });
    });
  });

});

describe('<DatesRangePicker />: getActiveCellsPositions', () => {
  const date = moment('2018-08-12');

  it('return empty range when `start` and `end` props are undefined', () => {
    const wrapper = mount(<DatesRangePicker
      initializeWith={date} />);
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
    assert(_.isObject(wrapper.instance().getActiveCellsPositions()), 'return object');
    assert(_.isUndefined(wrapper.instance().getActiveCellsPositions().start), 'return { start: undefined, ... }');
    assert(_.isUndefined(wrapper.instance().getActiveCellsPositions().end), 'return { end: undefined, ... }');
  });

  it('return half-filled range when `start` prop has value and `end` prop is undefined', () => {
    const wrapper = mount(<DatesRangePicker
      start={moment('2018-08-06')}
      initializeWith={date} />);
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
    assert(_.isObject(wrapper.instance().getActiveCellsPositions()), 'return object');
    assert.equal(wrapper.instance().getActiveCellsPositions().start, 8, 'return { start: 8, ... }');
    assert(_.isUndefined(wrapper.instance().getActiveCellsPositions().end), 'return { end: undefined, ... }');
  });

  it('return full range when `start` prop has value and `end` prop has value', () => {
    const wrapper = mount(<DatesRangePicker
      start={moment('2018-08-06')}
      end={moment('2018-08-12')}
      initializeWith={date} />);
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
    assert(_.isObject(wrapper.instance().getActiveCellsPositions()), 'return object');
    assert.equal(wrapper.instance().getActiveCellsPositions().start, 8, 'return { start: 8, ... }');
    assert.equal(wrapper.instance().getActiveCellsPositions().end, 14, 'return { end: 14, ... }');
  });

  describe('`start` is in previous month and is not currently displayed, `end` is undefined', () => {
    it('return empty range', () => {
      const wrapper = mount(<DatesRangePicker
        start={moment('2018-07-06')}
        initializeWith={date} />);
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
      assert(_.isObject(wrapper.instance().getActiveCellsPositions()), 'return object');
      assert(_.isUndefined(wrapper.instance().getActiveCellsPositions().start), 'return { start: undefined, ... }');
      assert(_.isUndefined(wrapper.instance().getActiveCellsPositions().end), 'return { end: undefined, ... }');
    });
  });

  describe('`start` is in previous month and is currently displayed, `end` is undefined', () => {
    it('return half-filled range', () => {
      const wrapper = mount(<DatesRangePicker
        start={moment('2018-07-30')}
        initializeWith={date} />);
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
      assert(_.isObject(wrapper.instance().getActiveCellsPositions()), 'return object');
      assert.equal(wrapper.instance().getActiveCellsPositions().start, 1, 'return { start: 1, ... }');
      assert(_.isUndefined(wrapper.instance().getActiveCellsPositions().end), 'return { end: undefined, ... }');
    });
  });

  describe('`start` is in previous month and is not currently displayed, `end` is in current month', () => {
    it('return full range', () => {
      const wrapper = mount(<DatesRangePicker
        start={moment('2018-07-06')}
        end={moment('2018-08-04')}
        initializeWith={date} />);
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
      assert(_.isObject(wrapper.instance().getActiveCellsPositions()), 'return object');
      assert.equal(wrapper.instance().getActiveCellsPositions().start, 0, 'return { start: 0, ... }');
      assert.equal(wrapper.instance().getActiveCellsPositions().end, 6, 'return { end: 6, ... }');
    });
  });

  describe('`start` is in previous month and is currently displayed, `end` is in current month', () => {
    it('return full range', () => {
      const wrapper = mount(<DatesRangePicker
        start={moment('2018-07-30')}
        end={moment('2018-08-04')}
        initializeWith={date} />);
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
      assert(_.isObject(wrapper.instance().getActiveCellsPositions()), 'return object');
      assert.equal(wrapper.instance().getActiveCellsPositions().start, 1, 'return { start: 1, ... }');
      assert.equal(wrapper.instance().getActiveCellsPositions().end, 6, 'return { end: 6, ... }');
    });
  });

  describe('`start` is in current month, `end` is in next month and is not currently displayed', () => {
    it('return full range', () => {
      const wrapper = mount(<DatesRangePicker
        start={moment('2018-08-30')}
        end={moment('2018-09-20')}
        initializeWith={date} />);
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
      assert(_.isObject(wrapper.instance().getActiveCellsPositions()), 'return object');
      assert.equal(wrapper.instance().getActiveCellsPositions().start, 32, 'return { start: 32, ... }');
      assert.equal(wrapper.instance().getActiveCellsPositions().end, 41, 'return { end: 41, ... }');
    });
  });

  describe('`start` is in current month, `end` is in next month and is currently displayed', () => {
    it('return full range', () => {
      const wrapper = mount(<DatesRangePicker
        start={moment('2018-08-30')}
        end={moment('2018-09-02')}
        initializeWith={date} />);
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
      assert(_.isObject(wrapper.instance().getActiveCellsPositions()), 'return object');
      assert.equal(wrapper.instance().getActiveCellsPositions().start, 32, 'return { start: 32, ... }');
      assert.equal(wrapper.instance().getActiveCellsPositions().end, 35, 'return { end: 35, ... }');
    });
  });

  describe('`start` is in previous month, `end` is in previous month and is not currently displayed', () => {
    it('return empty range', () => {
      const wrapper = mount(<DatesRangePicker
        start={moment('2018-07-02')}
        end={moment('2018-07-10')}
        initializeWith={date} />);
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
      assert(_.isObject(wrapper.instance().getActiveCellsPositions()), 'return object');
      assert(_.isUndefined(wrapper.instance().getActiveCellsPositions().start), 'return { start: undefined, ... }');
      assert(_.isUndefined(wrapper.instance().getActiveCellsPositions().end), 'return { end: undefined, ... }');
    });
  });

  describe('`start` is in next month, `end` is in next month and is not currently displayed', () => {
    it('return empty range', () => {
      const wrapper = mount(<DatesRangePicker
        start={moment('2018-09-10')}
        end={moment('2018-09-15')}
        initializeWith={date} />);
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
      assert(_.isObject(wrapper.instance().getActiveCellsPositions()), 'return object');
      assert(_.isUndefined(wrapper.instance().getActiveCellsPositions().start), 'return { start: undefined, ... }');
      assert(_.isUndefined(wrapper.instance().getActiveCellsPositions().end), 'return { end: undefined, ... }');
    });
  });

  describe('`start` is in prev month, `end` is in next month and is not currently displayed', () => {
    it('return full range', () => {
      const wrapper = mount(<DatesRangePicker
        start={moment('2018-07-10')}
        end={moment('2018-09-20')}
        initializeWith={date} />);
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
      assert(_.isObject(wrapper.instance().getActiveCellsPositions()), 'return object');
      assert.equal(wrapper.instance().getActiveCellsPositions().start, 0, 'return { start: 0, ... }');
      assert.equal(wrapper.instance().getActiveCellsPositions().end, 41, 'return { end: 41, ... }');
    });
  });
});

describe('<DatesRangePicker />: getDisabledPositions', () => {
  const date = moment('2018-08-12');

  describe('return disabled days based on `maxDate` prop', () => {
    it('return disabled days position numbers', () => {
      const wrapper = mount(<DatesRangePicker
        maxDate={moment('2018-08-22')}
        initializeWith={date} />);
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
        25, 26, 27, 28, 29, 30, 31, 32, 33,
        34, 35, 36, 37, 38, 39, 40, 41,
      ]; //disabled days position numbers
      assert(_.isArray(wrapper.instance().getDisabledPositions()), 'return array of numbers');
      assert.equal(wrapper.instance().getDisabledPositions().length, 20, 'return array of length 20');
      wrapper.instance().getDisabledPositions().forEach((day) => {
        assert(_.isNumber(day), 'contains numbers');
      });
      const producedDays = wrapper.instance().getDisabledPositions();
      shouldReturn.forEach((expectedDay) => {
        assert(_.includes(producedDays, expectedDay), 'contains correct posiotion numbers');
      });
    });
  });

  describe('return disabled days based on `minDate` prop', () => {
    it('return disabled days position numbers', () => {
      const wrapper = mount(<DatesRangePicker
        minDate={moment('2018-08-04')}
        initializeWith={date} />);
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
        3, 4, 5,
        34, 35, 36, 37, 38, 39, 40, 41,
      ]; //disabled days position numbers
      assert(_.isArray(wrapper.instance().getDisabledPositions()), 'return array of numbers');
      assert.equal(wrapper.instance().getDisabledPositions().length, 14, 'return array of length 14');
      wrapper.instance().getDisabledPositions().forEach((day) => {
        assert(_.isNumber(day), 'contains numbers');
      });
      const producedDays = wrapper.instance().getDisabledPositions();
      shouldReturn.forEach((expectedDay) => {
        assert(_.includes(producedDays, expectedDay), 'contains correct posiotion numbers');
      });
    });
  });

  describe('return disabled days based on `minDate`, `maxDate` props', () => {
    it('return disabled days position numbers', () => {
      const wrapper = mount(<DatesRangePicker
        minDate={moment('2018-08-04')}
        maxDate={moment('2018-08-29')}
        initializeWith={date} />);
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
        0, 1, 2, 3, 4, 5,
        32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
      ]; //disabled days position numbers
      assert(_.isArray(wrapper.instance().getDisabledPositions()), 'return array of numbers');
      assert.equal(wrapper.instance().getDisabledPositions().length, 16, 'return array of length 16');
      wrapper.instance().getDisabledPositions().forEach((day) => {
        assert(_.isNumber(day), 'contains numbers');
      });
      const producedDays = wrapper.instance().getDisabledPositions();
      shouldReturn.forEach((expectedDay) => {
        assert(_.includes(producedDays, expectedDay), 'contains correct posiotion numbers');
      });
    });
  });

  describe('return disabled days when none of `minDate`, `maxDate` props provided', () => {
    it('return disabled days position numbers (only days that are not in currently displayed month', () => {
      const wrapper = mount(<DatesRangePicker
        initializeWith={date} />);
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
      ]; //disabled days position numbers
      assert(_.isArray(wrapper.instance().getDisabledPositions()), 'return array of numbers');
      assert.equal(wrapper.instance().getDisabledPositions().length, 11, 'return array of length 11');
      wrapper.instance().getDisabledPositions().forEach((day) => {
        assert(_.isNumber(day), 'contains numbers');
      });
      const producedDays = wrapper.instance().getDisabledPositions();
      shouldReturn.forEach((expectedDay) => {
        assert(_.includes(producedDays, expectedDay), 'contains correct posiotion numbers');
      });
    });
  });
});

describe('<DatesRangePicker />: isNextPageAvailable', () => {
  const date = moment('2018-08-12');

  describe('is not available by maxDate', () => {
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
    it('return false', () => {
      const wrapper = mount(<DatesRangePicker
        maxDate={moment('2018-08-31')}
        initializeWith={date} />);

      assert(_.isBoolean(wrapper.instance().isNextPageAvailable()), 'return boolean');
      assert.isFalse(wrapper.instance().isNextPageAvailable(), 'return false');
    });
  });

  describe('available by maxDate', () => {
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
    it('return true', () => {
      const wrapper = mount(<DatesRangePicker
        maxDate={moment('2018-09-01')}
        initializeWith={date} />);

      assert(_.isBoolean(wrapper.instance().isNextPageAvailable()), 'return boolean');
      assert.isTrue(wrapper.instance().isNextPageAvailable(), 'return true');
    });
  });
});

describe('<DatesRangePicker />: isPrevPageAvailable', () => {
  const date = moment('2018-08-12');

  describe('is not available by minDate', () => {
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
    it('return false', () => {
      const wrapper = mount(<DatesRangePicker
        minDate={moment('2018-08-01')}
        initializeWith={date} />);

      assert(_.isBoolean(wrapper.instance().isPrevPageAvailable()), 'return boolean');
      assert.isFalse(wrapper.instance().isPrevPageAvailable(), 'return false');
    });
  });

  describe('available by minDate', () => {
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
    it('return true', () => {
      const wrapper = mount(<DatesRangePicker
        minDate={moment('2018-07-31')}
        initializeWith={date} />);

      assert(_.isBoolean(wrapper.instance().isPrevPageAvailable()), 'return boolean');
      assert.isTrue(wrapper.instance().isPrevPageAvailable(), 'return true');
    });
  });
});

describe('<DatesRangePicker />: getCurrentDate', () => {
  const date = moment('2018-08-12');

  it('return string in format `MMMM YYYY`', () => {
    const wrapper = mount(<DatesRangePicker
      initializeWith={date} />);

    assert(_.isString(wrapper.instance().getCurrentDate()), 'return string');
    assert.equal(wrapper.instance().getCurrentDate(), date.format('MMMM YYYY'), 'return proper value');
  });
});

describe('<DatesRangePicker />: handleChange', () => {
  const date = moment('2018-08-12');

  describe('`start` and `end` props are not provided', () => {
    it('call onChangeFake with { start: Moment, end: undefined }', () => {
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
      const onChangeFake = sinon.fake();
      const wrapper = mount(<DatesRangePicker
        onChange={onChangeFake}
        initializeWith={date} />);
      wrapper.instance().handleChange('click', { itemPosition: 17});
      const calledWithArgs = onChangeFake.args[0];

      assert(onChangeFake.calledOnce, 'onChangeFake called once');
      assert.equal(calledWithArgs[0], 'click', 'correct first argument');
      assert(moment.isMoment(calledWithArgs[1].value.start), 'has moment instance in `value.start`');
      assert(calledWithArgs[1].value.start.isSame(moment('2018-08-15'), 'date'), 'has correct moment instance in `value.start`');
      assert(_.isUndefined(calledWithArgs[1].value.end), 'has undefined in `value.end`');
    });
  });

  describe('`start` prop is provided, `end` prop is not provided', () => {
    it('call onChangeFake with { start: Moment, end: Moment }', () => {
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
      const onChangeFake = sinon.fake();
      const wrapper = mount(<DatesRangePicker
        onChange={onChangeFake}
        start={moment('2018-08-09')}
        initializeWith={date} />);
      wrapper.instance().handleChange('click', { itemPosition: 17 });
      const calledWithArgs = onChangeFake.args[0];

      assert(onChangeFake.calledOnce, 'onChangeFake called once');
      assert.equal(calledWithArgs[0], 'click', 'correct first argument');
      assert(moment.isMoment(calledWithArgs[1].value.start), 'has moment instance in `value.start`');
      assert(
        calledWithArgs[1].value.start.isSame(moment('2018-08-09'), 'date'),
        'has correct moment instance in `value.start`');
      assert(moment.isMoment(calledWithArgs[1].value.end), 'has moment instance in `value.end`');
      assert(
        calledWithArgs[1].value.end.isSame(moment('2018-08-15'), 'date'),
        'has correct moment instance in `value.end`');
    });
  });

  describe('`start` prop is provided, `end` prop is provided', () => {
    it('call onChangeFake with { start: undefined, end: undefined }', () => {
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
      const onChangeFake = sinon.fake();
      const wrapper = mount(<DatesRangePicker
        onChange={onChangeFake}
        start={moment('2018-08-09')}
        end={moment('2018-08-10')}
        initializeWith={date} />);
      wrapper.instance().handleChange('click', { itemPosition: 17 });
      const calledWithArgs = onChangeFake.args[0];

      assert(onChangeFake.calledOnce, 'onChangeFake called once');
      assert.equal(calledWithArgs[0], 'click', 'correct first argument');
      assert(_.isUndefined(calledWithArgs[1].value.start), 'has undefined in `value.start`');
      assert(_.isUndefined(calledWithArgs[1].value.end), 'has undefined in `value.end`');
    });
  });

  describe('`start` prop is provided, `end` prop is not provided, click on date before `start`', () => {
    it('call onChangeFake with { start: undefined, end: undefined }', () => {
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
      const onChangeFake = sinon.fake();
      const wrapper = mount(<DatesRangePicker
        onChange={onChangeFake}
        start={moment('2018-08-09')}
        initializeWith={date} />);
      wrapper.instance().handleChange('click', { itemPosition: 9 });
      const calledWithArgs = onChangeFake.args[0];

      assert(onChangeFake.calledOnce, 'onChangeFake called once');
      assert.equal(calledWithArgs[0], 'click', 'correct first argument');
      assert(_.isUndefined(calledWithArgs[1].value.start), 'has undefined in `value.start`');
      assert(_.isUndefined(calledWithArgs[1].value.end), 'has undefined in `value.end`');
    });
  });
});

describe('<DatesRangePicker />: switchToNextPage', () => {
  const date = moment('2018-08-12');

  it('shift `date` state field one month forward', () => {
    const wrapper = mount(<DatesRangePicker
      initializeWith={date} />);

    assert.equal(wrapper.state('date').month(), 7, 'month not changed yet');
    wrapper.instance().switchToNextPage();
    assert.equal(wrapper.state('date').month(), 7 + 1, 'month shifted one month forward');
  });
});

describe('<DatesRangePicker />: switchToPrevPage', () => {
  const date = moment('2018-08-12');

  it('shift `date` state field one month backward', () => {
    const wrapper = mount(<DatesRangePicker
      initializeWith={date} />);

    assert.equal(wrapper.state('date').month(), 7, 'month not changed yet');
    wrapper.instance().switchToPrevPage();
    assert.equal(wrapper.state('date').month(), 7 - 1, 'month shifted one month backward');
  });
});

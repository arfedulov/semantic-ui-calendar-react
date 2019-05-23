import { assert } from 'chai';
import {
  mount,
  shallow,
} from 'enzyme';
import * as sinon from 'sinon';
import * as React from 'react';
import * as _ from 'lodash';
import moment from 'moment';
import { createRenderViewMock } from '../../testUtils';

import DatesRangePicker from '../../../src/pickers/dayPicker/DatesRangePicker';

describe('<DatesRangePicker />', () => {
  it('initialized with moment', () => {
    const date = moment('2015-05-01');
    const wrapper = shallow(<DatesRangePicker initializeWith={date} renderView={ () => <div /> } />);
    assert(
      moment.isMoment(wrapper.state('date')),
      'has moment instance in `date` state field');
    assert(
      wrapper.state('date').isSame(date),
      'initialize `date` state field with moment provided in `initializeWith` prop');
  });
});

describe('<DatesRangePicker />: provide correct ``values`` prop to renderView', () => {

  describe('current date is 2018-08-12', () => {
    const date = moment('2018-08-12');

    it('``values`` is an array of expected strings', () => {
      const receivedProps = {};
      shallow(
        <DatesRangePicker
          initializeWith={date}
          renderView={ createRenderViewMock(receivedProps) }
        />);
      const expectedValues = [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ];
      assert(_.isArray(receivedProps.values), 'return array');
      assert.equal(receivedProps.values.length, 42, 'return array of length 42');
      receivedProps.values.forEach((value, i) => {
        assert.equal(value, expectedValues[i], 'contains corect dates');
      });
    });
  });

  describe('current date is 2018-09-12', () => {
    const date = moment('2018-09-12');

    it('``values`` is an array of expected strings', () => {
      const receivedProps = {};
      shallow(
        <DatesRangePicker
          initializeWith={date}
          renderView={ createRenderViewMock(receivedProps) }
        />);
      const expectedValues = [
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
        '9', '10', '11', '12', '13', '14', '15',
        '16', '17', '18', '19', '20', '21', '22',
        '23', '24', '25', '26', '27', '28', '29',
        '30', '1', '2', '3', '4', '5', '6',
      ];
      assert(_.isArray(receivedProps.values), 'return array');
      assert.equal(receivedProps.values.length, 42, 'return array of length 42');
      receivedProps.values.forEach((value, i) => {
        assert.equal(value, expectedValues[i], 'contains corect dates');
      });
    });
  });

  describe('current date is 2017-02-12', () => {
    const date = moment('2017-02-12');

    it('``values`` is an array of expected strings', () => {
      const receivedProps = {};
      shallow(
        <DatesRangePicker
          initializeWith={date}
          renderView={ createRenderViewMock(receivedProps) }
        />);
      const expectedValues = [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
      ];

      assert(_.isArray(receivedProps.values), 'return array');
      assert.equal(receivedProps.values.length, 42, 'return array of length 42');
      receivedProps.values.forEach((value, i) => {
        assert.equal(value, expectedValues[i], 'contains corect dates');
      });
    });
  });

  describe('current date is 2029-11-01', () => {
    const date = moment('2029-11-01');

    it('``values`` is an array of expected strings', () => {
      const receivedProps = {};
      shallow(
        <DatesRangePicker
          initializeWith={date}
          renderView={ createRenderViewMock(receivedProps) }
        />);
      const expectedValues = [
        '28', '29', '30', '31', '1', '2', '3',
        '4', '5', '6', '7', '8', '9', '10',
        '11', '12', '13', '14', '15', '16', '17',
        '18', '19', '20', '21', '22', '23', '24',
        '25', '26', '27', '28', '29', '30', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ];

      assert(_.isArray(receivedProps.values), 'return array');
      assert.equal(receivedProps.values.length, 42, 'return array of length 42');
      receivedProps.values.forEach((value, i) => {
        assert.equal(value, expectedValues[i], 'contains corect dates');
      });
    });
  });

});

describe.only('<DatesRangePicker />: provide correct ``activeRange`` prop to renderView', () => {
  const date = moment('2018-08-12');

  it('return empty range when `start` and `end` props are undefined', () => {
    const receivedProps = {};
    shallow(<DatesRangePicker
      initializeWith={date}
      renderView={ createRenderViewMock(receivedProps) }
    />);
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
    assert(_.isObject(receivedProps.activeRange), 'return object');
    assert(_.isUndefined(receivedProps.activeRange.start), 'return { start: undefined, ... }');
    assert(_.isUndefined(receivedProps.activeRange.end), 'return { end: undefined, ... }');
  });

  it('return half-filled range when `start` prop has value and `end` prop is undefined', () => {
    const receivedProps = {};
    shallow(<DatesRangePicker
      start={moment('2018-08-06')}
      initializeWith={date}
      renderView={ createRenderViewMock(receivedProps) }
    />);
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
    assert(_.isObject(receivedProps.activeRange), 'return object');
    assert.equal(receivedProps.activeRange.start, 8, 'return { start: 8, ... }');
    assert(_.isUndefined(receivedProps.activeRange.end), 'return { end: undefined, ... }');
  });

  it('return full range when `start` prop has value and `end` prop has value', () => {
    const receivedProps = {};
    shallow(<DatesRangePicker
      start={moment('2018-08-06')}
      end={moment('2018-08-12')}
      initializeWith={date}
      renderView={ createRenderViewMock(receivedProps) }
    />);
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
    assert(_.isObject(receivedProps.activeRange), 'return object');
    assert.equal(receivedProps.activeRange.start, 8, 'return { start: 8, ... }');
    assert.equal(receivedProps.activeRange.end, 14, 'return { end: 14, ... }');
  });

  describe('`start` is in previous month and is not currently displayed, `end` is undefined', () => {
    it('return empty range', () => {
      const receivedProps = {};
      shallow(<DatesRangePicker
        start={moment('2018-07-06')}
        initializeWith={date}
        renderView={ createRenderViewMock(receivedProps) }
      />);
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
      assert(_.isObject(receivedProps.activeRange), 'return object');
      assert(_.isUndefined(receivedProps.activeRange.start), 'return { start: undefined, ... }');
      assert(_.isUndefined(receivedProps.activeRange.end), 'return { end: undefined, ... }');
    });
  });

  describe('`start` is in previous month and is currently displayed, `end` is undefined', () => {
    it('return half-filled range', () => {
      const receivedProps = {};
      shallow(<DatesRangePicker
        start={moment('2018-07-30')}
        initializeWith={date}
        renderView={ createRenderViewMock(receivedProps) }
      />);
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
      assert(_.isObject(receivedProps.activeRange), 'return object');
      assert.equal(receivedProps.activeRange.start, 1, 'return { start: 1, ... }');
      assert(_.isUndefined(receivedProps.activeRange.end), 'return { end: undefined, ... }');
    });
  });

  describe('`start` is in previous month and is not currently displayed, `end` is in current month', () => {
    it('return full range', () => {
      const receivedProps = {};
      shallow(<DatesRangePicker
        start={moment('2018-07-06')}
        end={moment('2018-08-04')}
        initializeWith={date}
        renderView={ createRenderViewMock(receivedProps) }
      />);
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
      assert(_.isObject(receivedProps.activeRange), 'return object');
      assert.equal(receivedProps.activeRange.start, 0, 'return { start: 0, ... }');
      assert.equal(receivedProps.activeRange.end, 6, 'return { end: 6, ... }');
    });
  });

  describe('`start` is in previous month and is currently displayed, `end` is in current month', () => {
    it('return full range', () => {
      const receivedProps = {};
      shallow(<DatesRangePicker
        start={moment('2018-07-30')}
        end={moment('2018-08-04')}
        initializeWith={date}
        renderView={ createRenderViewMock(receivedProps) }
      />);
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
      assert(_.isObject(receivedProps.activeRange), 'return object');
      assert.equal(receivedProps.activeRange.start, 1, 'return { start: 1, ... }');
      assert.equal(receivedProps.activeRange.end, 6, 'return { end: 6, ... }');
    });
  });

  describe('`start` is in current month, `end` is in next month and is not currently displayed', () => {
    it('return full range', () => {
      const receivedProps = {};
      shallow(<DatesRangePicker
        start={moment('2018-08-30')}
        end={moment('2018-09-20')}
        initializeWith={date}
        renderView={ createRenderViewMock(receivedProps) }
      />);
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
      assert(_.isObject(receivedProps.activeRange), 'return object');
      assert.equal(receivedProps.activeRange.start, 32, 'return { start: 32, ... }');
      assert.equal(receivedProps.activeRange.end, 41, 'return { end: 41, ... }');
    });
  });

  describe('`start` is in current month, `end` is in next month and is currently displayed', () => {
    it('return full range', () => {
      const receivedProps = {};
      shallow(<DatesRangePicker
        start={moment('2018-08-30')}
        end={moment('2018-09-02')}
        initializeWith={date}
        renderView={ createRenderViewMock(receivedProps) }
      />);
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
      assert(_.isObject(receivedProps.activeRange), 'return object');
      assert.equal(receivedProps.activeRange.start, 32, 'return { start: 32, ... }');
      assert.equal(receivedProps.activeRange.end, 35, 'return { end: 35, ... }');
    });
  });

  describe('`start` is in previous month, `end` is in previous month and is not currently displayed', () => {
    it('return empty range', () => {
      const receivedProps = {};
      shallow(<DatesRangePicker
        start={moment('2018-07-02')}
        end={moment('2018-07-10')}
        initializeWith={date}
        renderView={ createRenderViewMock(receivedProps) }
      />);
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
      assert(_.isObject(receivedProps.activeRange), 'return object');
      assert(_.isUndefined(receivedProps.activeRange.start), 'return { start: undefined, ... }');
      assert(_.isUndefined(receivedProps.activeRange.end), 'return { end: undefined, ... }');
    });
  });

  describe('`start` is in next month, `end` is in next month and is not currently displayed', () => {
    it('return empty range', () => {
      const receivedProps = {};
      shallow(<DatesRangePicker
        start={moment('2018-09-10')}
        end={moment('2018-09-15')}
        initializeWith={date}
        renderView={ createRenderViewMock(receivedProps) }
      />);
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
      assert(_.isObject(receivedProps.activeRange), 'return object');
      assert(_.isUndefined(receivedProps.activeRange.start), 'return { start: undefined, ... }');
      assert(_.isUndefined(receivedProps.activeRange.end), 'return { end: undefined, ... }');
    });
  });

  describe('`start` is in prev month, `end` is in next month and is not currently displayed', () => {
    it('return full range', () => {
      const receivedProps = {};
      shallow(<DatesRangePicker
        start={moment('2018-07-10')}
        end={moment('2018-09-20')}
        initializeWith={date}
        renderView={ createRenderViewMock(receivedProps) }
      />);
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
      assert(_.isObject(receivedProps.activeRange), 'return object');
      assert.equal(receivedProps.activeRange.start, 0, 'return { start: 0, ... }');
      assert.equal(receivedProps.activeRange.end, 41, 'return { end: 41, ... }');
    });
  });
});

/////////////////////////  PROCEDE FROM HERE ////////////////////////////////////

describe('<DatesRangePicker />: getDisabledPositions', () => {
  const date = moment('2018-08-12');

  describe('return disabled days based on `maxDate` prop', () => {
    it('return disabled days position numbers', () => {
      shallow(<DatesRangePicker
        maxDate={moment('2018-08-22')}
        initializeWith={date}
        renderView={ createRenderViewMock(receivedProps) }
      />);
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
      shallow(<DatesRangePicker
        minDate={moment('2018-08-04')}
        initializeWith={date}
        renderView={ createRenderViewMock(receivedProps) }
      />);
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
      shallow(<DatesRangePicker
        minDate={moment('2018-08-04')}
        maxDate={moment('2018-08-29')}
        initializeWith={date}
        renderView={ createRenderViewMock(receivedProps) }
      />);
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
      shallow(<DatesRangePicker
        initializeWith={date}
        renderView={ createRenderViewMock(receivedProps) }
      />);
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
      shallow(<DatesRangePicker
        maxDate={moment('2018-08-31')}
        initializeWith={date}
        renderView={ createRenderViewMock(receivedProps) }
      />);

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
      shallow(<DatesRangePicker
        maxDate={moment('2018-09-01')}
        initializeWith={date}
        renderView={ createRenderViewMock(receivedProps) }
      />);

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
      shallow(<DatesRangePicker
        minDate={moment('2018-08-01')}
        initializeWith={date}
        renderView={ createRenderViewMock(receivedProps) }
      />);

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
      shallow(<DatesRangePicker
        minDate={moment('2018-07-31')}
        initializeWith={date}
        renderView={ createRenderViewMock(receivedProps) }
      />);

      assert(_.isBoolean(wrapper.instance().isPrevPageAvailable()), 'return boolean');
      assert.isTrue(wrapper.instance().isPrevPageAvailable(), 'return true');
    });
  });
});

describe('<DatesRangePicker />: getCurrentDate', () => {
  const date = moment('2018-08-12');

  it('return string in format `MMMM YYYY`', () => {
    shallow(<DatesRangePicker
      initializeWith={date}
      renderView={ createRenderViewMock(receivedProps) }
    />);

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
      shallow(<DatesRangePicker
        onChange={onChangeFake}
        initializeWith={date}
        renderView={ createRenderViewMock(receivedProps) }
      />);
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
      shallow(<DatesRangePicker
        onChange={onChangeFake}
        start={moment('2018-08-09')}
        initializeWith={date}
        renderView={ createRenderViewMock(receivedProps) }
      />);
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
      shallow(<DatesRangePicker
        onChange={onChangeFake}
        start={moment('2018-08-09')}
        end={moment('2018-08-10')}
        initializeWith={date}
        renderView={ createRenderViewMock(receivedProps) }
      />);
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
      shallow(<DatesRangePicker
        onChange={onChangeFake}
        start={moment('2018-08-09')}
        initializeWith={date}
        renderView={ createRenderViewMock(receivedProps) }
      />);
      wrapper.instance().handleChange('click', { itemPosition: 9 });
      const calledWithArgs = onChangeFake.args[0];

      assert(onChangeFake.calledOnce, 'onChangeFake called once');
      assert.equal(calledWithArgs[0], 'click', 'correct first argument');
      assert(_.isUndefined(calledWithArgs[1].value.start), 'has undefined in `value.start`');
      assert(_.isUndefined(calledWithArgs[1].value.end), 'has undefined in `value.end`');
    });
  });

  describe('`start` prop is provided, `allowSameEndDate` prop is set to `false`, click on the same date', () => {
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
      shallow(<DatesRangePicker
        onChange={onChangeFake}
        initializeWith={date}
        start={moment('2018-08-06')}
        allowSameEndDate={false} />);
      wrapper.instance().handleChange('click', { itemPosition: 8 });
      const calledWithArgs = onChangeFake.args[0];

      assert(onChangeFake.calledOnce, 'onChangeFake called once');
      assert.equal(calledWithArgs[0], 'click', 'correct first argument');
      assert(_.isUndefined(calledWithArgs[1].value.start), 'has undefined in `value.start`');
      assert(_.isUndefined(calledWithArgs[1].value.end), 'has undefined in `value.end`');
    });
  });

  describe('`start` prop is provided, `allowSameEndDate` prop is set to `true`, click on the same date', () => {
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
      shallow(<DatesRangePicker
        onChange={onChangeFake}
        initializeWith={date}
        start={moment('2018-08-06')}
        allowSameEndDate={true} />);
      wrapper.instance().handleChange('click', { itemPosition: 8 });
      const calledWithArgs = onChangeFake.args[0];

      assert(onChangeFake.calledOnce, 'onChangeFake called once');
      assert.equal(calledWithArgs[0], 'click', 'correct first argument');
      assert(calledWithArgs[1].value.end.isSame(moment('2018-08-06'), 'date'), 'has correct moment instance in `value.end`');
    });
  });
});

describe('<DatesRangePicker />: switchToNextPage', () => {
  const date = moment('2018-08-12');

  it('shift `date` state field one month forward', () => {
    shallow(<DatesRangePicker
      initializeWith={date}
      renderView={ createRenderViewMock(receivedProps) }
    />);

    assert.equal(wrapper.state('date').month(), 7, 'month not changed yet');
    wrapper.instance().switchToNextPage();
    assert.equal(wrapper.state('date').month(), 7 + 1, 'month shifted one month forward');
  });
});

describe('<DatesRangePicker />: switchToPrevPage', () => {
  const date = moment('2018-08-12');

  it('shift `date` state field one month backward', () => {
    shallow(<DatesRangePicker
      initializeWith={date}
      renderView={ createRenderViewMock(receivedProps) }
    />);

    assert.equal(wrapper.state('date').month(), 7, 'month not changed yet');
    wrapper.instance().switchToPrevPage();
    assert.equal(wrapper.state('date').month(), 7 - 1, 'month shifted one month backward');
  });
});

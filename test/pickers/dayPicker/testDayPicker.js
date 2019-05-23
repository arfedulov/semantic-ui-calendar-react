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

import DayPicker from '../../../src/pickers/dayPicker/DayPicker';

describe('<DayPicker />', () => {
  it('initialized with moment', () => {
    const date = moment('2015-05-01');
    const wrapper = shallow(<DayPicker initializeWith={date} renderView={ () => <div /> } />);
    assert(
      moment.isMoment(wrapper.state('date')),
      'has moment instance in `date` state field');
    assert(
      wrapper.state('date').isSame(date),
      'initialize `date` state field with moment provided in `initializeWith` prop');
  });
});

describe('<DayPicker />: provide correct ``values`` to renderView', () => {

  describe('current date is 2018-08-12', () => {
    const date = moment('2018-08-12');

    it('produce array of expected strings', () => {
      const receivedProps = {};
      shallow(<DayPicker initializeWith={date} renderView={ createRenderViewMock(receivedProps) } />);
      const expectedValues = [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ];

      assert(_.isArray(receivedProps.values), '``values`` is array');
      assert.equal(receivedProps.values.length, 42, '``values`` is array of length 42');
      receivedProps.values.forEach((value, i) => {
        assert.equal(value, expectedValues[i], '``values`` array contains corect dates');
      });
    });
  });

  describe('current date is 2018-09-12', () => {
    const date = moment('2018-09-12');

    it('produce array of expected strings', () => {
      const receivedProps = {};
      shallow(<DayPicker initializeWith={date} renderView={ createRenderViewMock(receivedProps) } />);
      const expectedValues = [
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
        '9', '10', '11', '12', '13', '14', '15',
        '16', '17', '18', '19', '20', '21', '22',
        '23', '24', '25', '26', '27', '28', '29',
        '30', '1', '2', '3', '4', '5', '6',
      ];
      assert(_.isArray(receivedProps.values), '``values`` is array');
      assert.equal(receivedProps.values.length, 42, '``values`` is array of length 42');
      receivedProps.values.forEach((value, i) => {
        assert.equal(value, expectedValues[i], 'contains corect dates');
      });
    });
  });

  describe('current date is 2017-02-12', () => {
    const date = moment('2017-02-12');

    it('produce array of expected strings', () => {
      const receivedProps = {};
      shallow(<DayPicker initializeWith={date} renderView={ createRenderViewMock(receivedProps) } />);
      const expectedValues = [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
      ];

      assert(_.isArray(receivedProps.values), '``values`` is array');
      assert.equal(receivedProps.values.length, 42, '``values`` is array of length 42');
      receivedProps.values.forEach((value, i) => {
        assert.equal(value, expectedValues[i], 'contains corect dates');
      });
    });
  });

  describe('current date is 2029-11-01', () => {
    const date = moment('2029-11-01');

    it('return array of expected strings', () => {
      const receivedProps = {};
      shallow(<DayPicker initializeWith={date} renderView={ createRenderViewMock(receivedProps) } />);
      const expectedValues = [
        '28', '29', '30', '31', '1', '2', '3',
        '4', '5', '6', '7', '8', '9', '10',
        '11', '12', '13', '14', '15', '16', '17',
        '18', '19', '20', '21', '22', '23', '24',
        '25', '26', '27', '28', '29', '30', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ];

      assert(_.isArray(receivedProps.values), '``values`` is array');
      assert.equal(receivedProps.values.length, 42, '``values`` is array of length 42');
      receivedProps.values.forEach((value, i) => {
        assert.equal(value, expectedValues[i], 'contains corect dates');
      });
    });
  });
});

describe('<DayPicker />: provide correct ``activeItemIndex`` to renderView', () => {
  const date = moment('2018-08-12');

  it('produce ``activeItemIndex`` equal to selected date\'s position', () => {
    const receivedProps = {};
    shallow(<DayPicker
      value={moment('2018-08-22')}
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

      activeItemIndex === 24
    */
    assert(_.isNumber(receivedProps.activeItemIndex), '``activeItemIndex`` is number');
    assert.equal(receivedProps.activeItemIndex, 24, '``activeItemIndex`` is active day position number');
  });
});

describe('<DayPicker />: provide correct ``disabledItemIndexes`` to renderView', () => {
  const date = moment('2018-08-12');

  it('produce ``disabledItemIndexes`` equal to disabled dates positions', () => {
    const receivedProps = {};
    shallow(<DayPicker
      disable={[moment('2018-08-22'), moment('2018-08-25')]}
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
    const expectedIndexes = [
      0, 1, 2,
      24, 27,
      34, 35, 36, 37, 38, 39, 40, 41,
    ]; //disabled days position numbers
    assert(_.isArray(receivedProps.disabledItemIndexes), '``disabledItemIndexes`` is array of numbers');
    assert.equal(receivedProps.disabledItemIndexes.length, 13, '``disabledItemIndexes`` is array of length 13');
    receivedProps.disabledItemIndexes.forEach((index) => {
      assert(_.isNumber(index), '``disabledItemIndexes`` array contains numbers');
    });
    expectedIndexes.forEach((index) => {
      assert(
        _.includes(receivedProps.disabledItemIndexes, index),
        '``disabledItemIndexes`` array contains correct posiotion numbers'
      );
    });
  });

  it('produce ``disabledItemIndexes`` equal to disabled dates positions based on `maxDate` prop', () => {
    const receivedProps = {};
    shallow(<DayPicker
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
    const expectedIndexes = [
      0, 1, 2,
      25, 26, 27, 28, 29, 30, 31, 32, 33,
      34, 35, 36, 37, 38, 39, 40, 41,
    ]; //disabled days position numbers
    assert(_.isArray(receivedProps.disabledItemIndexes), '``disabledItemIndexes`` is array of numbers');
    assert.equal(receivedProps.disabledItemIndexes.length, 20, '``disabledItemIndexes`` is array of length 20');
    receivedProps.disabledItemIndexes.forEach((index) => {
      assert(_.isNumber(index), 'contains numbers');
    });
    // const producedDays = wrapper.instance().getDisabledPositions();
    expectedIndexes.forEach((expectedIndex) => {
      assert(_.includes(receivedProps.disabledItemIndexes, expectedIndex), 'contains correct posiotion numbers');
    });
  });

  it('produce ``disabledItemIndexes`` equal to disabled dates positions based on `minDate` prop', () => {
    const receivedProps = {};
    shallow(<DayPicker
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
    const expectedIndexes = [
      0, 1, 2,
      3, 4, 5,
      34, 35, 36, 37, 38, 39, 40, 41,
    ]; //disabled days position numbers
    assert(_.isArray(receivedProps.disabledItemIndexes), '``disabledItemIndexes`` is array of numbers');
    assert.equal(receivedProps.disabledItemIndexes.length, 14, '``disabledItemIndexes`` is array of length 14');
    receivedProps.disabledItemIndexes.forEach((day) => {
      assert(_.isNumber(day), 'contains numbers');
    });

    expectedIndexes.forEach((expectedIndex) => {
      assert(_.includes(receivedProps.disabledItemIndexes, expectedIndex), 'contains correct posiotion numbers');
    });
  });

  it('produce ``disabledItemIndexes`` equal to disabled dates positions based on `minDate`, `maxDate`, `disable` props', () => {
    const receivedProps = {};
    shallow(<DayPicker
      minDate={moment('2018-08-04')}
      maxDate={moment('2018-08-29')}
      disable={[moment('2018-08-14'), moment('2018-08-16')]}
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
    const expectedIndexes = [
      0, 1, 2, 3, 4, 5,
      16, 18,
      32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
    ]; //disabled days position numbers
    assert(_.isArray(receivedProps.disabledItemIndexes), '``disabledItemIndexes`` is array of numbers');
    assert.equal(receivedProps.disabledItemIndexes.length, 18, '``disabledItemIndexes`` is array of length 18');
    receivedProps.disabledItemIndexes.forEach((index) => {
      assert(_.isNumber(index), 'contains numbers');
    });

    expectedIndexes.forEach((expectedIndex) => {
      assert(_.includes(receivedProps.disabledItemIndexes, expectedIndex), 'contains correct posiotion numbers');
    });
  });

  describe('None of `minDate`, `maxDate`, `disable` props provided', () => {
    it([
      'produce ``disabledItemIndexes`` that includes only',
      'indexes of days that are not in currently displayed month'].join(''), () => {
      const receivedProps = {};
      shallow(<DayPicker
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
      const expectedIndexes = [
        0, 1, 2,
        34, 35, 36, 37, 38, 39, 40, 41,
      ]; //disabled days position numbers
      assert(_.isArray(receivedProps.disabledItemIndexes), '``disabledItemIndexes`` is array of numbers');
      assert.equal(receivedProps.disabledItemIndexes.length, 11, '``disabledItemIndexes`` is array of length 11');
      receivedProps.disabledItemIndexes.forEach((index) => {
        assert(_.isNumber(index), 'contains numbers');
      });

      expectedIndexes.forEach((expectedIndex) => {
        assert(_.includes(receivedProps.disabledItemIndexes, expectedIndex), 'contains correct posiotion numbers');
      });
    });
  });
});

describe('<DayPicker />: provide correct ``hasNextPage`` to renderView', () => {
  const date = moment('2018-08-12');
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

  it('produce ``hasNextPage === false`` considering maxDate', () => {
    const receivedProps = {};
    shallow(<DayPicker
      maxDate={moment('2018-08-31')}
      initializeWith={date}
      renderView={ createRenderViewMock(receivedProps) }
    />);

    assert(_.isBoolean(receivedProps.hasNextPage), '``hasNextPage`` is boolean');
    assert.isFalse(receivedProps.hasNextPage, '``hasNextPage`` is false');
  });

  it('produce ``hasNextPage === true`` considering maxDate', () => {
    const receivedProps = {};
    shallow(<DayPicker
      maxDate={moment('2018-09-01')}
      initializeWith={date}
      renderView={ createRenderViewMock(receivedProps) }
    />);

    assert(_.isBoolean(receivedProps.hasNextPage), '``hasNextPage`` is boolean');
    assert.isTrue(receivedProps.hasNextPage, '``hasNextPage`` is true');
  });
});

describe('<DayPicker />: provide correct ``hasPrevPage`` to renderView', () => {
  const date = moment('2018-08-12');
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

  it('produce ``hasPrevPage === false`` considering minDate', () => {
    const receivedProps = {};
    shallow(<DayPicker
      minDate={moment('2018-08-01')}
      initializeWith={date}
      renderView={ createRenderViewMock(receivedProps) }
    />);

    assert(_.isBoolean(receivedProps.hasPrevPage), '``hasPrevPage`` is boolean');
    assert.isFalse(receivedProps.hasPrevPage, '``hasPrevPage`` is false');
  });

  it('produce ``hasPrevPage === true`` considering minDate', () => {
    const receivedProps = {};
    shallow(<DayPicker
      minDate={moment('2018-07-31')}
      initializeWith={date}
      renderView={ createRenderViewMock(receivedProps) }
    />);

    assert(_.isBoolean(receivedProps.hasPrevPage), '``hasPrevPage`` is boolean');
    assert.isTrue(receivedProps.hasPrevPage, '``hasPrevPage`` is true');
  });
});

describe('<DayPicker />: provide correct ``currentHeadingValue`` to renderView', () => {
  const date = moment('2018-08-12');

  it('produce ``currentHeadingValue`` - string in format `MMMM YYYY`', () => {
    const receivedProps = {};
    shallow(<DayPicker
      initializeWith={date}
      renderView={ createRenderViewMock(receivedProps) }
    />);

    assert(_.isString(receivedProps.currentHeadingValue), '``currentHeadingValue`` is string');
    assert.equal(receivedProps.currentHeadingValue, date.format('MMMM YYYY'), '``currentHeadingValue`` has proper value');
  });
});

describe('<DayPicker />: provide working ``onValueClick`` to renderView', () => {
  const date = moment('2018-08-12');
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

  it('call onChangeFake with { year: number, month: number, date: number }', () => {
    const onChangeFake = sinon.fake();
    const receivedProps = {};
    shallow(<DayPicker
      onChange={onChangeFake}
      initializeWith={date}
      renderView={ createRenderViewMock(receivedProps) }
    />);
    assert.equal(typeof receivedProps.onValueClick, 'function', '``onValueClick`` is a function');
    receivedProps.onValueClick('click', { key: '17', value: '15'});
    const calledWithArgs = onChangeFake.args[0];

    assert(onChangeFake.calledOnce, 'onChangeFake called once');
    assert.equal(calledWithArgs[0], 'click', 'correct first argument');
    assert.equal(calledWithArgs[1].value.year, 2018, 'correct year');
    assert.equal(calledWithArgs[1].value.month, 7, 'correct month');
    assert.equal(calledWithArgs[1].value.date, 15, 'correct date');
  });
});

describe('<DayPicker />: provide working ``onNextPageBtnClick`` to renderView', () => {
  const date = moment('2018-08-12');

  it('shift `date` state field one month forward', () => {
    const receivedProps = {};
    const wrapper = shallow(<DayPicker
      initializeWith={date}
      renderView={ createRenderViewMock(receivedProps) }
    />);

    assert.equal(typeof receivedProps.onNextPageBtnClick, 'function', '``onNextPageBtnClick`` is a function');

    assert.equal(wrapper.state('date').month(), 7, 'month not changed yet');
    receivedProps.onNextPageBtnClick();
    assert.equal(wrapper.state('date').month(), 7 + 1, 'month shifted one month forward');
  });
});

describe('<DayPicker />: provide working ``onPrevPageBtnClick`` to renderView', () => {
  const date = moment('2018-08-12');

  it('shift `date` state field one month backward', () => {
    const receivedProps = {};
    const wrapper = shallow(<DayPicker
      initializeWith={date}
      renderView={ createRenderViewMock(receivedProps) }
    />);

    assert.equal(typeof receivedProps.onPrevPageBtnClick, 'function', '``onPrevPageBtnClick`` is a function');

    assert.equal(wrapper.state('date').month(), 7, 'month not changed yet');
    receivedProps.onPrevPageBtnClick();
    assert.equal(wrapper.state('date').month(), 7 - 1, 'month shifted one month backward');
  });
});

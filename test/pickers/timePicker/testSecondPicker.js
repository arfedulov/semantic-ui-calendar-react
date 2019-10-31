import { assert } from 'chai';
import {
  mount,
} from 'enzyme';
import * as sinon from 'sinon';
import * as React from 'react';
import * as _ from 'lodash';
import moment from 'moment';

import SecondPicker from '../../../src/pickers/timePicker/SecondPicker';

describe('<SecondPicker />', () => {
  it('initialized with moment', () => {
    const date = moment('2015-05-01');
    const wrapper = mount(<SecondPicker disableSecond={false} initializeWith={date} />);
    assert(
      moment.isMoment(wrapper.state('date')),
      'has moment instance in `date` state field');
    assert(
      wrapper.state('date').isSame(date),
      'initialize `date` state field with moment provided in `initializeWith` prop');
  });
});

describe('<SecondPicker />: buildCalendarValues', () => {
  const date = moment('2018-08-12 15:00');

  describe('`timeFormat` not provided', () => {
    it('return array of strings', () => {
      const wrapper = mount(<SecondPicker disableSecond={false} initializeWith={date} />);
      const shouldReturn = [
        '15:00:00', '15:00:05', '15:00:10', '15:00:15', '15:00:20', '15:00:25',
        '15:00:30', '15:00:35', '15:00:40', '15:00:45', '15:00:50', '15:00:55',
      ];
      assert(_.isArray(wrapper.instance().buildCalendarValues()), 'return array');
      assert.equal(wrapper.instance().buildCalendarValues().length, 12, 'return array of length 12');
      wrapper.instance().buildCalendarValues().forEach((secondPosition, i) => {
        assert.equal(secondPosition, shouldReturn[i], 'contains corect second positions');
      });
    });
  });

  describe('`timeFormat` is ampm', () => {
    it('return array of strings', () => {
      const wrapper = mount(<SecondPicker
        disableSecond={false}
        timeFormat="ampm"
        initializeWith={date} />);
      const shouldReturn = [
        '03:00:00 pm', '03:00:05 pm', '03:00:10 pm', '03:00:15 pm', '03:00:20 pm', '03:00:25 pm',
        '03:00:30 pm', '03:00:35 pm', '03:00:40 pm', '03:00:45 pm', '03:00:50 pm', '03:00:55 pm',
      ];
      assert(_.isArray(wrapper.instance().buildCalendarValues()), 'return array');
      assert.equal(wrapper.instance().buildCalendarValues().length, 12, 'return array of length 12');
      wrapper.instance().buildCalendarValues().forEach((secondPosition, i) => {
        assert.equal(secondPosition, shouldReturn[i], 'contains corect second positions');
      });
    });
  });

  describe('`timeFormat` is AMPM', () => {
    it('return array of strings', () => {
      const wrapper = mount(<SecondPicker
        disableSecond={false}
        timeFormat="AMPM"
        initializeWith={date} />);
      const shouldReturn = [
        '03:00:00 PM', '03:00:05 PM', '03:00:10 PM', '03:00:15 PM', '03:00:20 PM', '03:00:25 PM',
        '03:00:30 PM', '03:00:35 PM', '03:00:40 PM', '03:00:45 PM', '03:00:50 PM', '03:00:55 PM',
      ];
      assert(_.isArray(wrapper.instance().buildCalendarValues()), 'return array');
      assert.equal(wrapper.instance().buildCalendarValues().length, 12, 'return array of length 12');
      wrapper.instance().buildCalendarValues().forEach((secondPosition, i) => {
        assert.equal(secondPosition, shouldReturn[i], 'contains corect second positions');
      });
    });
  });
});

describe('<SecondPicker />: getActiveCellPosition', () => {
  const date = moment('2018-08-12 10:00:00');

  it('return active second position when value is not multiple of 5', () => {
    const wrapper = mount(<SecondPicker
      disableSecond={false}
      value={moment('2018-08-12 10:00:17')}
      initializeWith={date} />);
    /*
      [
        '10:00:00', '10:00:05', '10:00:10', '10:00:15', '10:00:20', '10:00:25',
        '10:00:30', '10:00:35', '10:00:40', '10:00:45', '10:00:50', '10:00:55',
      ]
    */
    assert(_.isNumber(wrapper.instance().getActiveCellPosition()), 'return number');
    assert.equal(wrapper.instance().getActiveCellPosition(), 3, 'return active second position number');
  });

  it('return active second position when value is multiple of 5', () => {
    const wrapper = mount(<SecondPicker
      disableSecond={false}
      value={moment('2018-08-12 10:00:20')}
      initializeWith={date} />);
    /*
      [
        '10:00:00', '10:00:05', '10:00:10', '10:00:15', '10:00:20', '10:00:25',
        '10:00:30', '10:00:35', '10:00:40', '10:00:45', '10:00:50', '10:00:55',
      ]
    */
    assert(_.isNumber(wrapper.instance().getActiveCellPosition()), 'return number');
    assert.equal(wrapper.instance().getActiveCellPosition(), 4, 'return active second position number');
  });

  it('return active second position when value is 59', () => {
    const wrapper = mount(<SecondPicker
      disableSecond={false}
      value={moment('2018-08-12 10:00:59')}
      initializeWith={date} />);
    /*
      [
        '10:00:00', '10:00:05', '10:00:10', '10:00:15', '10:00:20', '10:00:25',
        '10:00:30', '10:00:35', '10:00:40', '10:00:45', '10:00:50', '10:00:55',
      ]
    */
    assert(_.isNumber(wrapper.instance().getActiveCellPosition()), 'return number');
    assert.equal(wrapper.instance().getActiveCellPosition(), 11, 'return active second position number');
  });

  it('return undefined when value is not provided', () => {
    const wrapper = mount(<SecondPicker
      disableSecond={false}
      initializeWith={date} />);
    assert(_.isUndefined(wrapper.instance().getActiveCellPosition()), 'return undefined');
  });
});

describe('<SecondPicker />: isNextPageAvailable', () => {
  const date = moment('2018-08-12');

  describe('is not available by maxDate', () => {
    it('return false', () => {
      const wrapper = mount(<SecondPicker
        disableSecond={false}
        maxDate={moment('2018-08-12')}
        initializeWith={date} />);

      assert(_.isBoolean(wrapper.instance().isNextPageAvailable()), 'return boolean');
      assert.isFalse(wrapper.instance().isNextPageAvailable(), 'return false');
    });
  });

  describe('available by maxDate', () => {
    it('return true', () => {
      const wrapper = mount(<SecondPicker
        disableSecond={false}
        maxDate={moment('2018-08-13')}
        initializeWith={date} />);

      assert(_.isBoolean(wrapper.instance().isNextPageAvailable()), 'return boolean');
      assert.isTrue(wrapper.instance().isNextPageAvailable(), 'return true');
    });
  });
});

describe('<SecondPicker />: isPrevPageAvailable', () => {
  const date = moment('2018-08-12');

  describe('is not available by minDate', () => {
    it('return false', () => {
      const wrapper = mount(<SecondPicker
        disableSecond={false}
        minDate={moment('2018-08-12')}
        initializeWith={date} />);

      assert(_.isBoolean(wrapper.instance().isPrevPageAvailable()), 'return boolean');
      assert.isFalse(wrapper.instance().isPrevPageAvailable(), 'return false');
    });
  });

  describe('available by minDate', () => {
    it('return true', () => {
      const wrapper = mount(<SecondPicker
        disableSecond={false}
        minDate={moment('2018-07-11')}
        initializeWith={date} />);

      assert(_.isBoolean(wrapper.instance().isPrevPageAvailable()), 'return boolean');
      assert.isTrue(wrapper.instance().isPrevPageAvailable(), 'return true');
    });
  });
});

describe('<SecondPicker />: getCurrentDate', () => {
  const date = moment('2018-08-12');

  it('return string in format `MMMM DD, YYYY`', () => {
    const wrapper = mount(<SecondPicker
      disableSecond={false}
      initializeWith={date} />);

    assert(_.isString(wrapper.instance().getCurrentDate()), 'return string');
    assert.equal(wrapper.instance().getCurrentDate(), date.format('MMMM DD, YYYY'), 'return proper value');
  });
});

describe('<SecondPicker />: handleChange', () => {
  const date = moment('2018-08-12 10:00:00');

  it('call onChangeFake with { year: number, month: number, date: number, hour: number, minute: number }', () => {
    const onChangeFake = sinon.fake();
    const wrapper = mount(<SecondPicker
      disableSecond={false}
      onChange={onChangeFake}
      initializeWith={date} />);
    const possibleValues = wrapper.instance().buildCalendarValues();
    /*
      [
        '**:00', '**:05', '**:10', '**:15', '**:20', '**:25',
        '**:30', '**:35', '**:40', '**:45', '**:50', '**:55',
      ]
    */
    wrapper.instance().handleChange('click', { value: possibleValues[8]});
    const calledWithArgs = onChangeFake.args[0];

    assert(onChangeFake.calledOnce, 'onChangeFake called once');
    assert.equal(calledWithArgs[0], 'click', 'correct first argument');
    assert.equal(calledWithArgs[1].value.year, 2018, 'correct year');
    assert.equal(calledWithArgs[1].value.month, 7, 'correct month');
    assert.equal(calledWithArgs[1].value.date, 12, 'correct date');
    assert.equal(calledWithArgs[1].value.hour, 10, 'correct hour');
    assert.equal(calledWithArgs[1].value.minute, 0, 'correct minute');
    assert.equal(calledWithArgs[1].value.second, 40, 'correct second');
  });
});

describe('<SecondPicker />: switchToNextPage', () => {
  const date = moment('2018-08-12');

  it('shift `date` state field one day forward', () => {
    const wrapper = mount(<SecondPicker
      disableSecond={false}
      initializeWith={date} />);

    assert.equal(wrapper.state('date').date(), 12, 'date not changed yet');
    wrapper.instance().switchToNextPage();
    assert.equal(wrapper.state('date').date(), 12 + 1, 'date shifted one day forward');
  });
});

describe('<SecondPicker />: switchToPrevPage', () => {
  const date = moment('2018-08-12');

  it('shift `date` state field one day backward', () => {
    const wrapper = mount(<SecondPicker
      disableSecond={false}
      initializeWith={date} />);

    assert.equal(wrapper.state('date').date(), 12, 'date not changed yet');
    wrapper.instance().switchToPrevPage();
    assert.equal(wrapper.state('date').date(), 12 - 1, 'date shifted one day backward');
  });
});

describe('<SecondPicker />: getSelectableCellPositions', () => {
  const date = moment('2018-08-12 10:00:00');

  it('return second positions that are >= `minDate`', () => {
    const wrapper = mount(<SecondPicker
      disableSecond={false}
      minDate={moment('2018-08-12 10:00:15')}
      initializeWith={date} />);
    const expected = [ 3, 4, 5, 6, 7, 8, 9, 10, 11 ];
    const actual = wrapper.instance().getSelectableCellPositions();

    assert.equal(actual.length, expected.length);
    expected.forEach((expectPos, i) => {
      assert.equal(expectPos, actual[i]);
    });
  });
});

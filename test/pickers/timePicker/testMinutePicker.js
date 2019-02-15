import { assert } from 'chai';
import {
  mount,
} from 'enzyme';
import * as sinon from 'sinon';
import * as React from 'react';
import * as _ from 'lodash';
import moment from 'moment';

import MinutePicker from '../../../src/pickers/timePicker/MinutePicker';

describe('<MinutePicker />', () => {
  it('initialized with moment', () => {
    const date = moment('2015-05-01');
    const wrapper = mount(<MinutePicker initializeWith={date} />);
    assert(
      moment.isMoment(wrapper.state('date')),
      'has moment instance in `date` state field');
    assert(
      wrapper.state('date').isSame(date),
      'initialize `date` state field with moment provided in `initializeWith` prop');
  });
});

describe('<MinutePicker />: buildCalendarValues', () => {
  const date = moment('2018-08-12 15:00');

  describe('`timeFormat` not provided', () => {
    it('return array of strings', () => {
      const wrapper = mount(<MinutePicker initializeWith={date} />);
      const shouldReturn = [
        '15:00', '15:05', '15:10', '15:15', '15:20', '15:25',
        '15:30', '15:35', '15:40', '15:45', '15:50', '15:55',
      ];
      assert(_.isArray(wrapper.instance().buildCalendarValues()), 'return array');
      assert.equal(wrapper.instance().buildCalendarValues().length, 12, 'return array of length 12');
      wrapper.instance().buildCalendarValues().forEach((minutePosition, i) => {
        assert.equal(minutePosition, shouldReturn[i], 'contains corect minute positions');
      });
    });
  });

  describe('`timeFormat` is ampm', () => {
    it('return array of strings', () => {
      const wrapper = mount(<MinutePicker
        timeFormat="ampm"
        initializeWith={date} />);
      const shouldReturn = [
        '03:00 pm', '03:05 pm', '03:10 pm', '03:15 pm', '03:20 pm', '03:25 pm',
        '03:30 pm', '03:35 pm', '03:40 pm', '03:45 pm', '03:50 pm', '03:55 pm',
      ];
      assert(_.isArray(wrapper.instance().buildCalendarValues()), 'return array');
      assert.equal(wrapper.instance().buildCalendarValues().length, 12, 'return array of length 12');
      wrapper.instance().buildCalendarValues().forEach((minutePosition, i) => {
        assert.equal(minutePosition, shouldReturn[i], 'contains corect minute positions');
      });
    });
  });

  describe('`timeFormat` is AMPM', () => {
    it('return array of strings', () => {
      const wrapper = mount(<MinutePicker
        timeFormat="AMPM"
        initializeWith={date} />);
      const shouldReturn = [
        '03:00 PM', '03:05 PM', '03:10 PM', '03:15 PM', '03:20 PM', '03:25 PM',
        '03:30 PM', '03:35 PM', '03:40 PM', '03:45 PM', '03:50 PM', '03:55 PM',
      ];
      assert(_.isArray(wrapper.instance().buildCalendarValues()), 'return array');
      assert.equal(wrapper.instance().buildCalendarValues().length, 12, 'return array of length 12');
      wrapper.instance().buildCalendarValues().forEach((minutePosition, i) => {
        assert.equal(minutePosition, shouldReturn[i], 'contains corect minute positions');
      });
    });
  });
});

describe('<MinutePicker />: getActiveCellPosition', () => {
  const date = moment('2018-08-12 10:00');

  it('return active minute position when value is not multiple of 5', () => {
    const wrapper = mount(<MinutePicker
      value={moment('2018-08-12 10:17')}
      initializeWith={date} />);
    /*
      [
        '10:00', '10:05', '10:10', '10:15', '10:20', '10:25',
        '10:30', '10:35', '10:40', '10:45', '10:50', '10:55',
      ]
    */
    assert(_.isNumber(wrapper.instance().getActiveCellPosition()), 'return number');
    assert.equal(wrapper.instance().getActiveCellPosition(), 3, 'return active minute position number');
  });

  it('return active minute position when value is multiple of 5', () => {
    const wrapper = mount(<MinutePicker
      value={moment('2018-08-12 10:20')}
      initializeWith={date} />);
    /*
      [
        '10:00', '10:05', '10:10', '10:15', '10:20', '10:25',
        '10:30', '10:35', '10:40', '10:45', '10:50', '10:55',
      ]
    */
    assert(_.isNumber(wrapper.instance().getActiveCellPosition()), 'return number');
    assert.equal(wrapper.instance().getActiveCellPosition(), 4, 'return active minute position number');
  });

  it('return active minute position when value is 59', () => {
    const wrapper = mount(<MinutePicker
      value={moment('2018-08-12 10:59')}
      initializeWith={date} />);
    /*
      [
        '10:00', '10:05', '10:10', '10:15', '10:20', '10:25',
        '10:30', '10:35', '10:40', '10:45', '10:50', '10:55',
      ]
    */
    assert(_.isNumber(wrapper.instance().getActiveCellPosition()), 'return number');
    assert.equal(wrapper.instance().getActiveCellPosition(), 11, 'return active minute position number');
  });

  it('return undefined when value is not provided', () => {
    const wrapper = mount(<MinutePicker
      initializeWith={date} />);
    assert(_.isUndefined(wrapper.instance().getActiveCellPosition()), 'return undefined');
  });
});

describe('<MinutePicker />: isNextPageAvailable', () => {
  const date = moment('2018-08-12');

  describe('is not available by maxDate', () => {
    it('return false', () => {
      const wrapper = mount(<MinutePicker
        maxDate={moment('2018-08-12')}
        initializeWith={date} />);

      assert(_.isBoolean(wrapper.instance().isNextPageAvailable()), 'return boolean');
      assert.isFalse(wrapper.instance().isNextPageAvailable(), 'return false');
    });
  });

  describe('available by maxDate', () => {
    it('return true', () => {
      const wrapper = mount(<MinutePicker
        maxDate={moment('2018-08-13')}
        initializeWith={date} />);

      assert(_.isBoolean(wrapper.instance().isNextPageAvailable()), 'return boolean');
      assert.isTrue(wrapper.instance().isNextPageAvailable(), 'return true');
    });
  });
});

describe('<MinutePicker />: isPrevPageAvailable', () => {
  const date = moment('2018-08-12');

  describe('is not available by minDate', () => {
    it('return false', () => {
      const wrapper = mount(<MinutePicker
        minDate={moment('2018-08-12')}
        initializeWith={date} />);

      assert(_.isBoolean(wrapper.instance().isPrevPageAvailable()), 'return boolean');
      assert.isFalse(wrapper.instance().isPrevPageAvailable(), 'return false');
    });
  });

  describe('available by minDate', () => {
    it('return true', () => {
      const wrapper = mount(<MinutePicker
        minDate={moment('2018-07-11')}
        initializeWith={date} />);

      assert(_.isBoolean(wrapper.instance().isPrevPageAvailable()), 'return boolean');
      assert.isTrue(wrapper.instance().isPrevPageAvailable(), 'return true');
    });
  });
});

describe('<MinutePicker />: getCurrentDate', () => {
  const date = moment('2018-08-12');

  it('return string in format `MMMM DD, YYYY`', () => {
    const wrapper = mount(<MinutePicker
      initializeWith={date} />);

    assert(_.isString(wrapper.instance().getCurrentDate()), 'return string');
    assert.equal(wrapper.instance().getCurrentDate(), date.format('MMMM DD, YYYY'), 'return proper value');
  });
});

describe('<MinutePicker />: handleChange', () => {
  const date = moment('2018-08-12 10:00');

  it('call onChangeFake with { year: number, month: number, date: number, hour: number }', () => {
    const onChangeFake = sinon.fake();
    const wrapper = mount(<MinutePicker
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
    assert.equal(calledWithArgs[1].value.minute, 40, 'correct hour');
  });
});

describe('<MinutePicker />: switchToNextPage', () => {
  const date = moment('2018-08-12');

  it('shift `date` state field one day forward', () => {
    const wrapper = mount(<MinutePicker
      initializeWith={date} />);

    assert.equal(wrapper.state('date').date(), 12, 'date not changed yet');
    wrapper.instance().switchToNextPage();
    assert.equal(wrapper.state('date').date(), 12 + 1, 'date shifted one day forward');
  });
});

describe('<MinutePicker />: switchToPrevPage', () => {
  const date = moment('2018-08-12');

  it('shift `date` state field one day backward', () => {
    const wrapper = mount(<MinutePicker
      initializeWith={date} />);

    assert.equal(wrapper.state('date').date(), 12, 'date not changed yet');
    wrapper.instance().switchToPrevPage();
    assert.equal(wrapper.state('date').date(), 12 - 1, 'date shifted one day backward');
  });
});

describe('<MinutePicker />: getSelectableCellPositions', () => {
  const date = moment('2018-08-12 10:00');

  it('return minutes positions that are >= `minDate`', () => {
    const wrapper = mount(<MinutePicker
      minDate={moment('2018-08-12 10:15')}
      initializeWith={date} />);
    const expected = [ 3, 4, 5, 6, 7, 8, 9, 10, 11 ];
    const actual = wrapper.instance().getSelectableCellPositions();

    assert.equal(actual.length, expected.length);
    expected.forEach((expectPos, i) => {
      assert.equal(expectPos, actual[i]);
    });
  });
});

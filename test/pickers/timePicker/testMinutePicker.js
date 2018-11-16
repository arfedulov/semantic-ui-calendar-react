import { assert } from 'chai';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {
  shallow,
} from 'enzyme';
import sinon from 'sinon';
import React from 'react';
import _ from 'lodash';
import moment from 'moment';

import MinutePicker from '../../../src/pickers/timePicker/MinutePicker';
import MinuteView from '../../../src/views/MinuteView';

Enzyme.configure({ adapter: new Adapter() });

describe('<MinutePicker />', () => {
  it('initialized with moment', () => {
    const date = moment('2015-05-01');
    const wrapper = shallow(<MinutePicker initializeWith={date} />);
    assert(
      moment.isMoment(wrapper.state('date')),
      'has moment instance in `date` state field');
    assert(
      wrapper.state('date').isSame(date),
      'initialize `date` state field with moment provided in `initializeWith` prop');
  });

  it('render <MinutePicker /> properly', () => {
    const date = moment('2015-05-01');
    const wrapper = shallow(<MinutePicker
      initializeWith={date} />);
    assert(wrapper.is(MinuteView), 'renders <MinuteView />');
    assert(_.isArray(wrapper.prop('minutes')), 'provide array to `minutes` prop on MinuteView');
    assert.equal(wrapper.prop('minutes').length, 12, 'provide array of length 12 to `minutes` prop on MinuteView');
    wrapper.prop('minutes').forEach((hour) => {
      assert(_.isString(hour), 'contains strings');
    });
    assert(_.isFunction(wrapper.prop('onNextPageBtnClick')), 'provide function for `onNextPageBtnClick` prop on MinuteView');
    assert(_.isFunction(wrapper.prop('onPrevPageBtnClick')), 'provide function for `onPrevPageBtnClick` prop on MinuteView');
    assert(_.isFunction(wrapper.prop('onMinuteClick')), 'provide function for `onMinuteClick` prop on MinuteView');
    assert(_.isBoolean(wrapper.prop('hasPrevPage')), 'provide boolean for `hasPrevPage` prop on MinuteView');
    assert(_.isBoolean(wrapper.prop('hasNextPage')), 'provide boolean for `hasNextPage` prop on MinuteView');
    assert(_.isString(wrapper.prop('currentDate')), 'provide string for `currentDate` prop on MinuteView');
    assert(_.has(wrapper.props(), 'active'), 'provide `active` prop to MinuteView');
  });

  it('pass unhandled props to <MinuteView />', () => {
    const date = moment('2015-05-01');
    const wrapper = shallow(<MinutePicker
      a="prop a"
      b="prop b"
      initializeWith={date} />);
    assert(wrapper.is(MinuteView), 'renders <MinuteView />');
    assert.equal(wrapper.prop('a'), 'prop a', 'provide unhandled prop `a` to MinuteView');
    assert.equal(wrapper.prop('b'), 'prop b', 'provide unhandled prop `b` to MinuteView');
  });
});

describe('<MinutePicker />: buildMinutes', () => {
  const date = moment('2018-08-12 15:00');

  describe('`timeFormat` not provided', () => {
    it('return array of strings', () => {
      const wrapper = shallow(<MinutePicker initializeWith={date} />);
      const shouldReturn = [
        '15:00', '15:05', '15:10', '15:15', '15:20', '15:25',
        '15:30', '15:35', '15:40', '15:45', '15:50', '15:55',
      ];
      assert(_.isArray(wrapper.instance().buildMinutes()), 'return array');
      assert.equal(wrapper.instance().buildMinutes().length, 12, 'return array of length 12');
      wrapper.instance().buildMinutes().forEach((minutePosition, i) => {
        assert.equal(minutePosition, shouldReturn[i], 'contains corect minute positions');
      });
    });
  });

  describe('`timeFormat` is ampm', () => {
    it('return array of strings', () => {
      const wrapper = shallow(<MinutePicker
        timeFormat="ampm"
        initializeWith={date} />);
      const shouldReturn = [
        '03:00 pm', '03:05 pm', '03:10 pm', '03:15 pm', '03:20 pm', '03:25 pm',
        '03:30 pm', '03:35 pm', '03:40 pm', '03:45 pm', '03:50 pm', '03:55 pm',
      ];
      assert(_.isArray(wrapper.instance().buildMinutes()), 'return array');
      assert.equal(wrapper.instance().buildMinutes().length, 12, 'return array of length 12');
      wrapper.instance().buildMinutes().forEach((minutePosition, i) => {
        assert.equal(minutePosition, shouldReturn[i], 'contains corect minute positions');
      });
    });
  });

  describe('`timeFormat` is AMPM', () => {
    it('return array of strings', () => {
      const wrapper = shallow(<MinutePicker
        timeFormat="AMPM"
        initializeWith={date} />);
      const shouldReturn = [
        '03:00 PM', '03:05 PM', '03:10 PM', '03:15 PM', '03:20 PM', '03:25 PM',
        '03:30 PM', '03:35 PM', '03:40 PM', '03:45 PM', '03:50 PM', '03:55 PM',
      ];
      assert(_.isArray(wrapper.instance().buildMinutes()), 'return array');
      assert.equal(wrapper.instance().buildMinutes().length, 12, 'return array of length 12');
      wrapper.instance().buildMinutes().forEach((minutePosition, i) => {
        assert.equal(minutePosition, shouldReturn[i], 'contains corect minute positions');
      });
    });
  });
});

describe('<MinutePicker />: getActiveCellPosition', () => {
  const date = moment('2018-08-12 10:00');

  it('return active minute position when value is not multiple of 5', () => {
    const wrapper = shallow(<MinutePicker
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
    const wrapper = shallow(<MinutePicker
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
    const wrapper = shallow(<MinutePicker
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
    const wrapper = shallow(<MinutePicker
      initializeWith={date} />);
    assert(_.isUndefined(wrapper.instance().getActiveCellPosition()), 'return undefined');
  });
});

describe('<MinutePicker />: isNextPageAvailable', () => {
  const date = moment('2018-08-12');

  describe('is not available by maxDate', () => {
    it('return false', () => {
      const wrapper = shallow(<MinutePicker
        maxDate={moment('2018-08-12')}
        initializeWith={date} />);
      
      assert(_.isBoolean(wrapper.instance().isNextPageAvailable()), 'return boolean');
      assert.isFalse(wrapper.instance().isNextPageAvailable(), 'return false');
    });
  });

  describe('available by maxDate', () => {
    it('return true', () => {
      const wrapper = shallow(<MinutePicker
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
      const wrapper = shallow(<MinutePicker
        minDate={moment('2018-08-12')}
        initializeWith={date} />);
      
      assert(_.isBoolean(wrapper.instance().isPrevPageAvailable()), 'return boolean');
      assert.isFalse(wrapper.instance().isPrevPageAvailable(), 'return false');
    });
  });

  describe('available by minDate', () => {
    it('return true', () => {
      const wrapper = shallow(<MinutePicker
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
    const wrapper = shallow(<MinutePicker
      initializeWith={date} />);
    
    assert(_.isString(wrapper.instance().getCurrentDate()), 'return string');
    assert.equal(wrapper.instance().getCurrentDate(), date.format('MMMM DD, YYYY'), 'return proper value');
  });
});

describe('<MinutePicker />: handleChange', () => {
  const date = moment('2018-08-12 10:00');

  it('call onChangeFake with { year: number, month: number, date: number, hour: number }', () => {
    const onChangeFake = sinon.fake();
    const wrapper = shallow(<MinutePicker
      onChange={onChangeFake}
      initializeWith={date} />);
    const possibleValues = wrapper.instance().buildMinutes();
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
    const wrapper = shallow(<MinutePicker
      initializeWith={date} />);
    
    assert.equal(wrapper.state('date').date(), 12, 'date not changed yet');
    wrapper.instance().switchToNextPage();
    assert.equal(wrapper.state('date').date(), 12 + 1, 'date shifted one day forward');
  });
});

describe('<MinutePicker />: switchToPrevPage', () => {
  const date = moment('2018-08-12');

  it('shift `date` state field one day backward', () => {
    const wrapper = shallow(<MinutePicker
      initializeWith={date} />);
    
    assert.equal(wrapper.state('date').date(), 12, 'date not changed yet');
    wrapper.instance().switchToPrevPage();
    assert.equal(wrapper.state('date').date(), 12 - 1, 'date shifted one day backward');
  });
});
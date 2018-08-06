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

import DayPicker from '../../../src/pickers/dayPicker/DayPicker';
import DayView from '../../../src/views/DayView';

Enzyme.configure({ adapter: new Adapter() });

describe('<DayPicker />', () => {
  it('initialized with moment', () => {
    const date = moment('2015-05-01');
    const wrapper = shallow(<DayPicker initializeWith={date} />);
    assert(
      moment.isMoment(wrapper.state('date')),
      'has moment instance in `date` state field');
    assert(
      wrapper.state('date').isSame(date),
      'initialize `date` state field with moment provided in `initializeWith` prop');
  });

  it('render <DayPicker /> properly', () => {
    const date = moment('2015-05-01');
    const wrapper = shallow(<DayPicker
      initializeWith={date} />);
    assert(wrapper.is(DayView), 'renders <DayView />');
    assert(_.isArray(wrapper.prop('days')), 'provide array to `days` prop on DayView');
    assert.equal(wrapper.prop('days').length, 6 * 7, 'provide array of length 6 * 7 to `days` prop on DayView');
    wrapper.prop('days').forEach((day) => {
      assert(_.isString(day), 'contains strings');
    });
    assert(_.isFunction(wrapper.prop('onNextPageBtnClick')), 'provide function for `onNextPageBtnClick` prop on DayView');
    assert(_.isFunction(wrapper.prop('onPrevPageBtnClick')), 'provide function for `onPrevPageBtnClick` prop on DayView');
    assert(_.isFunction(wrapper.prop('onDayClick')), 'provide function for `onDayClick` prop on DayView');
    assert(_.isBoolean(wrapper.prop('hasPrevPage')), 'provide boolean for `hasPrevPage` prop on DayView');
    assert(_.isBoolean(wrapper.prop('hasNextPage')), 'provide boolean for `hasNextPage` prop on DayView');
    assert(_.isString(wrapper.prop('currentDate')), 'provide string for `currentDate` prop on DayView');
    assert(_.has(wrapper.props(), 'active'), 'provide `active` prop to DayView');
    assert(_.has(wrapper.props(), 'disabled'), 'provide `disabled` prop to DayView');
  });

  it('pass unhandled props to <DayView />', () => {
    const date = moment('2015-05-01');
    const wrapper = shallow(<DayPicker
      a="prop a"
      b="prop b"
      initializeWith={date} />);
    assert(wrapper.is(DayView), 'renders <DayView />');
    assert.equal(wrapper.prop('a'), 'prop a', 'provide unhandled prop `a` to DayView');
    assert.equal(wrapper.prop('b'), 'prop b', 'provide unhandled prop `b` to DayView');
  });
});

describe('<DayPicker />: buildDays', () => {

  describe('current date is 2018-08-12', () => {
    const date = moment('2018-08-12');

    it('return array of strings', () => {
      const wrapper = shallow(<DayPicker initializeWith={date} />);
      const shouldReturn = [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ];
      assert(_.isArray(wrapper.instance().buildDays()), 'return array');
      assert.equal(wrapper.instance().buildDays().length, 42, 'return array of length 42');
      wrapper.instance().buildDays().forEach((date, i) => {
        assert.equal(date, shouldReturn[i], 'contains corect dates');
      });
    });
  });

  describe('current date is 2018-09-12', () => {
    const date = moment('2018-09-12');

    it('return array of strings', () => {
      const wrapper = shallow(<DayPicker initializeWith={date} />);
      const shouldReturn = [
        '26', '27', '28', '29', '30', '31', '1',
        '2', '3', '4', '5', '6', '7', '8',
        '9', '10', '11', '12', '13', '14', '15',
        '16', '17', '18', '19', '20', '21', '22',
        '23', '24', '25', '26', '27', '28', '29',
        '30', '1', '2', '3', '4', '5', '6',
      ];
      assert(_.isArray(wrapper.instance().buildDays()), 'return array');
      assert.equal(wrapper.instance().buildDays().length, 42, 'return array of length 42');
      wrapper.instance().buildDays().forEach((date, i) => {
        assert.equal(date, shouldReturn[i], 'contains corect dates');
      });
    });
  });

  describe('current date is 2017-02-12', () => {
    const date = moment('2017-02-12');

    it('return array of strings', () => {
      const wrapper = shallow(<DayPicker initializeWith={date} />);
      const shouldReturn = [
        '29', '30', '31', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
        '12', '13', '14', '15', '16', '17', '18',
        '19', '20', '21', '22', '23', '24', '25',
        '26', '27', '28', '1', '2', '3', '4',
        '5', '6', '7', '8', '9', '10', '11',
      ];
 
      assert(_.isArray(wrapper.instance().buildDays()), 'return array');
      assert.equal(wrapper.instance().buildDays().length, 42, 'return array of length 42');
      wrapper.instance().buildDays().forEach((date, i) => {
        assert.equal(date, shouldReturn[i], 'contains corect dates');
      });
    });
  });

  describe('current date is 2029-11-01', () => {
    const date = moment('2029-11-01');

    it('return array of strings', () => {
      const wrapper = shallow(<DayPicker initializeWith={date} />);
      const shouldReturn = [
        '28', '29', '30', '31', '1', '2', '3',
        '4', '5', '6', '7', '8', '9', '10',
        '11', '12', '13', '14', '15', '16', '17',
        '18', '19', '20', '21', '22', '23', '24',
        '25', '26', '27', '28', '29', '30', '1',
        '2', '3', '4', '5', '6', '7', '8',
      ];
 
      assert(_.isArray(wrapper.instance().buildDays()), 'return array');
      assert.equal(wrapper.instance().buildDays().length, 42, 'return array of length 42');
      wrapper.instance().buildDays().forEach((date, i) => {
        assert.equal(date, shouldReturn[i], 'contains corect dates');
      });
    });
  });
});

describe('<DayPicker />: getActiveDayPosition', () => {
  const date = moment('2018-08-12');

  it('return active day', () => {
    const wrapper = shallow(<DayPicker
      value={moment('2018-08-22')}
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
    assert(_.isNumber(wrapper.instance().getActiveDayPosition()), 'return number');
    assert.equal(wrapper.instance().getActiveDayPosition(), 24, 'return active day position number');
  });
});

describe('<DayPicker />: getDisabledDaysPositions', () => {
  const date = moment('2018-08-12');

  describe('return disabled days based on `disable` prop', () => {
    it('return disabled days position numbers', () => {
      const wrapper = shallow(<DayPicker
        disable={[moment('2018-08-22'), moment('2018-08-25')]}
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
        24, 27,
        34, 35, 36, 37, 38, 39, 40, 41,
      ]; //disabled days position numbers
      assert(_.isArray(wrapper.instance().getDisabledDaysPositions()), 'return array of numbers');
      assert.equal(wrapper.instance().getDisabledDaysPositions().length, 13, 'return array of length 13');
      wrapper.instance().getDisabledDaysPositions().forEach((day) => {
        assert(_.isNumber(day), 'contains numbers');
      });
      const producedDays = wrapper.instance().getDisabledDaysPositions();
      shouldReturn.forEach((expectedDay) => {
        assert(_.includes(producedDays, expectedDay), 'contains correct posiotion numbers');
      });
    });
  });

  describe('return disabled days based on `maxDate` prop', () => {
    it('return disabled days position numbers', () => {
      const wrapper = shallow(<DayPicker
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
      assert(_.isArray(wrapper.instance().getDisabledDaysPositions()), 'return array of numbers');
      assert.equal(wrapper.instance().getDisabledDaysPositions().length, 20, 'return array of length 20');
      wrapper.instance().getDisabledDaysPositions().forEach((day) => {
        assert(_.isNumber(day), 'contains numbers');
      });
      const producedDays = wrapper.instance().getDisabledDaysPositions();
      shouldReturn.forEach((expectedDay) => {
        assert(_.includes(producedDays, expectedDay), 'contains correct posiotion numbers');
      });
    });
  });

  describe('return disabled days based on `minDate` prop', () => {
    it('return disabled days position numbers', () => {
      const wrapper = shallow(<DayPicker
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
      assert(_.isArray(wrapper.instance().getDisabledDaysPositions()), 'return array of numbers');
      assert.equal(wrapper.instance().getDisabledDaysPositions().length, 14, 'return array of length 14');
      wrapper.instance().getDisabledDaysPositions().forEach((day) => {
        assert(_.isNumber(day), 'contains numbers');
      });
      const producedDays = wrapper.instance().getDisabledDaysPositions();
      shouldReturn.forEach((expectedDay) => {
        assert(_.includes(producedDays, expectedDay), 'contains correct posiotion numbers');
      });
    });
  });

  describe('return disabled days based on `minDate`, `maxDate`, `disable` props', () => {
    it('return disabled days position numbers', () => {
      const wrapper = shallow(<DayPicker
        minDate={moment('2018-08-04')}
        maxDate={moment('2018-08-29')}
        disable={[moment('2018-08-14'), moment('2018-08-16')]}
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
        16, 18,
        32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
      ]; //disabled days position numbers
      assert(_.isArray(wrapper.instance().getDisabledDaysPositions()), 'return array of numbers');
      assert.equal(wrapper.instance().getDisabledDaysPositions().length, 18, 'return array of length 18');
      wrapper.instance().getDisabledDaysPositions().forEach((day) => {
        assert(_.isNumber(day), 'contains numbers');
      });
      const producedDays = wrapper.instance().getDisabledDaysPositions();
      shouldReturn.forEach((expectedDay) => {
        assert(_.includes(producedDays, expectedDay), 'contains correct posiotion numbers');
      });
    });
  });

  describe('return disabled days when none of `minDate`, `maxDate`, `disable` props provided', () => {
    it('return disabled days position numbers (only days that are not in currently displayed month', () => {
      const wrapper = shallow(<DayPicker
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
      assert(_.isArray(wrapper.instance().getDisabledDaysPositions()), 'return array of numbers');
      assert.equal(wrapper.instance().getDisabledDaysPositions().length, 11, 'return array of length 11');
      wrapper.instance().getDisabledDaysPositions().forEach((day) => {
        assert(_.isNumber(day), 'contains numbers');
      });
      const producedDays = wrapper.instance().getDisabledDaysPositions();
      shouldReturn.forEach((expectedDay) => {
        assert(_.includes(producedDays, expectedDay), 'contains correct posiotion numbers');
      });
    });
  });
});

describe('<DayPicker />: isNextPageAvailable', () => {
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
      const wrapper = shallow(<DayPicker
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
      const wrapper = shallow(<DayPicker
        maxDate={moment('2018-09-01')}
        initializeWith={date} />);
      
      assert(_.isBoolean(wrapper.instance().isNextPageAvailable()), 'return boolean');
      assert.isTrue(wrapper.instance().isNextPageAvailable(), 'return true');
    });
  });
});

describe('<DayPicker />: isPrevPageAvailable', () => {
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
      const wrapper = shallow(<DayPicker
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
      const wrapper = shallow(<DayPicker
        minDate={moment('2018-07-31')}
        initializeWith={date} />);
      
      assert(_.isBoolean(wrapper.instance().isPrevPageAvailable()), 'return boolean');
      assert.isTrue(wrapper.instance().isPrevPageAvailable(), 'return true');
    });
  });
});

describe('<DayPicker />: getCurrentDate', () => {
  const date = moment('2018-08-12');

  it('return string in format `MMMM YYYY`', () => {
    const wrapper = shallow(<DayPicker
      initializeWith={date} />);
    
    assert(_.isString(wrapper.instance().getCurrentDate()), 'return string');
    assert.equal(wrapper.instance().getCurrentDate(), date.format('MMMM YYYY'), 'return proper value');
  });
});

describe('<DayPicker />: handleChange', () => {
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
    const wrapper = shallow(<DayPicker
      onChange={onChangeFake}
      initializeWith={date} />);
    wrapper.instance().handleChange('click', { key: '17', value: '15'});
    const calledWithArgs = onChangeFake.args[0];

    assert(onChangeFake.calledOnce, 'onChangeFake called once');
    assert.equal(calledWithArgs[0], 'click', 'correct first argument');
    assert.equal(calledWithArgs[1].value.year, 2018, 'correct year');
    assert.equal(calledWithArgs[1].value.month, 7, 'correct month');
    assert.equal(calledWithArgs[1].value.date, 15, 'correct date');
  });
});

describe('<DayPicker />: switchToNextPage', () => {
  const date = moment('2018-08-12');

  it('shift `date` state field one month forward', () => {
    const wrapper = shallow(<DayPicker
      initializeWith={date} />);
    
    assert.equal(wrapper.state('date').month(), 7, 'month not changed yet');
    wrapper.instance().switchToNextPage();
    assert.equal(wrapper.state('date').month(), 7 + 1, 'month shifted one month forward');
  });
});

describe('<DayPicker />: switchToPrevPage', () => {
  const date = moment('2018-08-12');

  it('shift `date` state field one month backward', () => {
    const wrapper = shallow(<DayPicker
      initializeWith={date} />);
    
    assert.equal(wrapper.state('date').month(), 7, 'month not changed yet');
    wrapper.instance().switchToPrevPage();
    assert.equal(wrapper.state('date').month(), 7 - 1, 'month shifted one month backward');
  });
});
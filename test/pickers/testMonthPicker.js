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

import MonthPicker from '../../src/pickers/MonthPicker';
import MonthView from '../../src/views/MonthView';

Enzyme.configure({ adapter: new Adapter() });

describe('<MonthPicker />', () => {
  it('initialized with moment', () => {
    const date = moment('2015-05-01');
    const wrapper = shallow(<MonthPicker initializeWith={date} />);
    assert(moment.isMoment(wrapper.state('date')), 'has moment instance in `date` state field');
    assert(wrapper.state('date').isSame(date), 'initialize `date` state field with moment provided in `initializeWith` prop');
  });

  it('render <MonthPicker /> properly', () => {
    const date = moment('2015-05-01');
    const wrapper = shallow(<MonthPicker
      initializeWith={date} />);
    assert(wrapper.is(MonthView), 'renders <MonthView />');
    assert(_.isArray(wrapper.prop('months')), 'provide array to `months` prop on MonthView');
    assert.equal(wrapper.prop('months').length, 12, 'provide array of length 12 to `months` prop on MonthView');
    wrapper.prop('months').forEach((month) => {
      assert(_.isString(month), 'contains strings');
    });
    assert(_.isFunction(wrapper.prop('onNextPageBtnClick')), 'provide function for `onNextPageBtnClick` prop on MonthView');
    assert(_.isFunction(wrapper.prop('onPrevPageBtnClick')), 'provide function for `onPrevPageBtnClick` prop on MonthView');
    assert(_.isFunction(wrapper.prop('onMonthClick')), 'provide function for `onMonthClick` prop on MonthView');
    assert(_.isBoolean(wrapper.prop('hasPrevPage')), 'provide boolean for `hasPrevPage` prop on MonthView');
    assert(_.isBoolean(wrapper.prop('hasNextPage')), 'provide boolean for `hasNextPage` prop on MonthView');
    assert(_.has(wrapper.props(), 'active'), 'provide `active` prop to MonthView');
    assert(_.has(wrapper.props(), 'disabled'), 'provide `disabled` prop to MonthView');
    assert(_.has(wrapper.props(), 'currentYear'), 'provide `currentYear` prop to MonthView');
  });

  it('pass unhandled props to <MonthView />', () => {
    const date = moment('2015-05-01');
    const wrapper = shallow(<MonthPicker
      a="prop a"
      b="prop b"
      initializeWith={date} />);
    assert(wrapper.is(MonthView), 'renders <MonthView />');
    assert.equal(wrapper.prop('a'), 'prop a', 'provide unhandled prop `a` to MonthView');
    assert.equal(wrapper.prop('b'), 'prop b', 'provide unhandled prop `b` to MonthView');
  });
});

describe('<MonthPicker />: buildMonths', () => {
  const date = moment('2015-05-01');
  /* current year 2015 */
  it('return array of strings', () => {
    const wrapper = shallow(<MonthPicker initializeWith={date} />);
    assert(_.isArray(wrapper.instance().buildMonths()), 'return array');
    wrapper.instance().buildMonths().forEach((month) => {
      assert(_.isString(month), 'contains strings');
    });
  });
});

describe('<MonthPicker />: getActiveMonthPosition', () => {
  const date = moment('2015-05-01');
  /* current year 2015 */
  it('return index of active month', () => {
    const wrapper = shallow(<MonthPicker
      value={moment('2015-02-18')}
      initializeWith={date} />);
    assert(_.isNumber(wrapper.instance().getActiveMonthPosition()), 'return number');
    assert.equal(wrapper.instance().getActiveMonthPosition(), 1, 'return index 1 (means February)');
  });

  it('return undefined if year of `value` does not equal to year of `date`', () => {
    const wrapper = shallow(<MonthPicker
      value={moment('2020-02-18')}
      initializeWith={date} />);
    assert(_.isUndefined(wrapper.instance().getActiveMonthPosition()), 'return undefined');
  });

  it('return undefined `value` is not provided', () => {
    const wrapper = shallow(<MonthPicker
      initializeWith={date} />);
    assert(_.isUndefined(wrapper.instance().getActiveMonthPosition()), 'return undefined');
  });
});

describe('<MonthPicker />: getDisabledMonthsPositions', () => {
  const date = moment('2015-05-01');
  /* current year 2015 */

  it('return indexes of disabled months', () => {
    const wrapper = shallow(<MonthPicker
      disable={[moment('2015-04-01'), moment('2015-07-01')]}
      initializeWith={date} />);
    /* disabled indexes: 3, 6 */
    assert(_.isArray(wrapper.instance().getDisabledMonthsPositions()), 'return array');
    assert.equal(wrapper.instance().getDisabledMonthsPositions().length, 2, 'return array of length 2');
    wrapper.instance().getDisabledMonthsPositions().forEach((month) => {
      assert(_.isNumber(month), 'contains numbers only');
    });
    assert(_.includes(wrapper.instance().getDisabledMonthsPositions(), 3), 'month in position 3 is disabled');
    assert(_.includes(wrapper.instance().getDisabledMonthsPositions(), 6), 'month in position 6 is disabled');
  });

  it('return indexes of disabled months in current year only', () => {
    const wrapper = shallow(<MonthPicker
      disable={[moment('2015-04-01'), moment('2015-07-01'), moment('2014-01-01'), moment('2016-09-01')]}
      initializeWith={date} />);
    /* disabled indexes: 3, 6 */
    assert(_.isArray(wrapper.instance().getDisabledMonthsPositions()), 'return array');
    assert.equal(wrapper.instance().getDisabledMonthsPositions().length, 2, 'return array of length 2');
    wrapper.instance().getDisabledMonthsPositions().forEach((month) => {
      assert(_.isNumber(month), 'contains numbers only');
    });
    assert(_.includes(wrapper.instance().getDisabledMonthsPositions(), 3), 'month in position 3 is disabled');
    assert(_.includes(wrapper.instance().getDisabledMonthsPositions(), 6), 'month in position 6 is disabled');
  });

  it('works properly if `minDate` prop is provided (which is in current year)', () => {
    const wrapper = shallow(<MonthPicker
      minDate={moment('2015-03-01')}
      initializeWith={date} />);
    /* disabled indexes: 0, 1 */
    assert(_.isArray(wrapper.instance().getDisabledMonthsPositions()), 'return array');
    assert.equal(wrapper.instance().getDisabledMonthsPositions().length, 2, 'return array of length 2');
    wrapper.instance().getDisabledMonthsPositions().forEach((month) => {
      assert(_.isNumber(month), 'contains numbers only');
    });
    assert(_.includes(wrapper.instance().getDisabledMonthsPositions(), 0), 'month in position 0 is disabled');
    assert(_.includes(wrapper.instance().getDisabledMonthsPositions(), 1), 'month in position 1 is disabled');
  });

  it('works properly if `minDate` prop is provided (which is before the current year)', () => {
    const wrapper = shallow(<MonthPicker
      minDate={moment('2014-03-01')}
      initializeWith={date} />);
    /* disabled indexes: none */
    assert(_.isUndefined(wrapper.instance().getDisabledMonthsPositions()), 'return undefined');
  });

  it('works properly if `minDate` prop is provided (which is after the current year)', () => {
    const wrapper = shallow(<MonthPicker
      minDate={moment('2016-09-01')}
      initializeWith={date} />);
    /* disabled indexes: all */
    const disabledRange = _.range(0, 12);
    assert(_.isArray(wrapper.instance().getDisabledMonthsPositions()), 'return array');
    assert.equal(wrapper.instance().getDisabledMonthsPositions().length, 12, 'return array of length 12');
    wrapper.instance().getDisabledMonthsPositions().forEach((month) => {
      assert(_.isNumber(month), 'contains numbers only');
    });
    wrapper.instance().getDisabledMonthsPositions().forEach((month) => {
      assert(_.includes(disabledRange, month), 'includes all months');
    });
  });

  it('works properly if `maxDate` prop is provided (which is in current year)', () => {
    const wrapper = shallow(<MonthPicker
      maxDate={moment('2015-09-01')}
      initializeWith={date} />);
    /* disabled indexes: 9, 10, 11 */
    assert(_.isArray(wrapper.instance().getDisabledMonthsPositions()), 'return array');
    assert.equal(wrapper.instance().getDisabledMonthsPositions().length, 3, 'return array of length 3');
    wrapper.instance().getDisabledMonthsPositions().forEach((month) => {
      assert(_.isNumber(month), 'contains numbers only');
    });
    assert(_.includes(wrapper.instance().getDisabledMonthsPositions(), 9), 'month in position 9 is disabled');
    assert(_.includes(wrapper.instance().getDisabledMonthsPositions(), 10), 'month in position 10 is disabled');
    assert(_.includes(wrapper.instance().getDisabledMonthsPositions(), 11), 'month in position 11 is disabled');
  });

  it('works properly if `maxDate` prop is provided (which is after the current year)', () => {
    const wrapper = shallow(<MonthPicker
      maxDate={moment('2016-03-01')}
      initializeWith={date} />);
    /* disabled indexes: none */
    assert(_.isUndefined(wrapper.instance().getDisabledMonthsPositions()), 'return undefined');
  });

  it('works properly if `maxDate` prop is provided (which is before the current year)', () => {
    const wrapper = shallow(<MonthPicker
      maxDate={moment('2014-09-01')}
      initializeWith={date} />);
    /* disabled indexes: all */
    const disabledRange = _.range(0, 12);
    assert(_.isArray(wrapper.instance().getDisabledMonthsPositions()), 'return array');
    assert.equal(wrapper.instance().getDisabledMonthsPositions().length, 12, 'return array of length 12');
    wrapper.instance().getDisabledMonthsPositions().forEach((month) => {
      assert(_.isNumber(month), 'contains numbers only');
    });
    wrapper.instance().getDisabledMonthsPositions().forEach((month) => {
      assert(_.includes(disabledRange, month), 'includes all months');
    });
  });

  it('works properly if `maxDate`, `minDate`, `disabled` props are all provided', () => {
    const wrapper = shallow(<MonthPicker
      maxDate={moment('2015-10-01')}
      minDate={moment('2015-02-01')}
      disable={[moment('2015-06-01')]}
      initializeWith={date} />);
    /* disabled indexes: 0, 5, 10, 11 */
    assert(_.isArray(wrapper.instance().getDisabledMonthsPositions()), 'return array');
    assert.equal(wrapper.instance().getDisabledMonthsPositions().length, 4, 'return array of length 4');
    wrapper.instance().getDisabledMonthsPositions().forEach((month) => {
      assert(_.isNumber(month), 'contains numbers only');
    });
    assert(_.includes(wrapper.instance().getDisabledMonthsPositions(), 0), 'month at position 0 is disabled');
    assert(_.includes(wrapper.instance().getDisabledMonthsPositions(), 5), 'month at position 5 is disabled');
    assert(_.includes(wrapper.instance().getDisabledMonthsPositions(), 10), 'month at position 10 is disabled');
    assert(_.includes(wrapper.instance().getDisabledMonthsPositions(), 11), 'month at position 11 is disabled');
  });

  it('works properly if `maxDate`, `minDate`, `disabled` props are all undefined', () => {
    const wrapper = shallow(<MonthPicker
      initializeWith={date} />);
    /* disabled indexes: none */
    assert(_.isUndefined(wrapper.instance().getDisabledMonthsPositions()), 'return undefined');
  });
});

describe('<MonthPicker />: isNextPageAvailable', () => {
  const date = moment('2015-05-01');
  /* current year 2015 */

  it('has method `isNextPageAvailable`', () => {
    const wrapper = shallow(<MonthPicker
      initializeWith={date} />);
    
    assert(_.isFunction(wrapper.instance().isNextPageAvailable), 'has the method');
  });

  it('return false if maxDate in current year', () => {
    const wrapper = shallow(<MonthPicker
      maxDate={moment('2015-11-01')}
      initializeWith={date} />);
    
    assert(_.isBoolean(wrapper.instance().isNextPageAvailable()), 'return boolean');
    assert.isFalse(wrapper.instance().isNextPageAvailable(), 'return false');
  });

  it('return true if maxDate is in next year', () => {
    const wrapper = shallow(<MonthPicker
      maxDate={moment('2016-11-01')}
      initializeWith={date} />);
    
    assert(_.isBoolean(wrapper.instance().isNextPageAvailable()), 'return boolean');
    assert.isTrue(wrapper.instance().isNextPageAvailable(), 'return true');
  });

  it('return true if maxDate is in a year after next year', () => {
    const wrapper = shallow(<MonthPicker
      maxDate={moment('2019-11-01')}
      initializeWith={date} />);
    
    assert(_.isBoolean(wrapper.instance().isNextPageAvailable()), 'return boolean');
    assert.isTrue(wrapper.instance().isNextPageAvailable(), 'return true');
  });
});

describe('<MonthPicker />: isPrevPageAvailable', () => {
  const date = moment('2015-05-01');
  /* current year 2015 */

  it('has method `isPrevPageAvailable`', () => {
    const wrapper = shallow(<MonthPicker
      initializeWith={date} />);
    
    assert(_.isFunction(wrapper.instance().isPrevPageAvailable), 'has the method');
  });

  it('return false if minDate in current year', () => {
    const wrapper = shallow(<MonthPicker
      minDate={moment('2015-01-01')}
      initializeWith={date} />);
    
    assert(_.isBoolean(wrapper.instance().isPrevPageAvailable()), 'return boolean');
    assert.isFalse(wrapper.instance().isPrevPageAvailable(), 'return false');
  });

  it('return true if minDate is in previous year', () => {
    const wrapper = shallow(<MonthPicker
      minDate={moment('2014-11-01')}
      initializeWith={date} />);
    
    assert(_.isBoolean(wrapper.instance().isPrevPageAvailable()), 'return boolean');
    assert.isTrue(wrapper.instance().isPrevPageAvailable(), 'return true');
  });

  it('return true if minDate is in a year before previous year', () => {
    const wrapper = shallow(<MonthPicker
      minDate={moment('2000-11-01')}
      initializeWith={date} />);
    
    assert(_.isBoolean(wrapper.instance().isPrevPageAvailable()), 'return boolean');
    assert.isTrue(wrapper.instance().isPrevPageAvailable(), 'return true');
  });
});

describe('<MonthPicker />: getCurrentYear', () => {
  const date = moment('2015-05-01');
  /* current year 2015 */

  it('has method `getCurrentYear`', () => {
    const wrapper = shallow(<MonthPicker
      initializeWith={date} />);
    
    assert(_.isFunction(wrapper.instance().getCurrentYear), 'has the method');
  });

  it('return current year as string', () => {
    const wrapper = shallow(<MonthPicker
      initializeWith={date} />);
    
    assert(_.isString(wrapper.instance().getCurrentYear()), 'return string');
    assert.equal(wrapper.instance().getCurrentYear(), '2015', 'return current year');
  });
});

describe('<MonthPicker />: handleChange', () => {
  const date = moment('2015-05-01');
  /* current year 2015 */

  it('has method `handleChange`', () => {
    const wrapper = shallow(<MonthPicker
      initializeWith={date} />);
    
    assert(_.isFunction(wrapper.instance().handleChange), 'has the method');
  });

  it('call `onChange` with proper arguments', () => {
    const onChangeFake = sinon.fake();
    const wrapper = shallow(<MonthPicker
      onChange={onChangeFake}
      initializeWith={date} />);
    
    wrapper.instance().handleChange('click', { value: 'Aug' });
    const calledWithArgs = onChangeFake.args[0];
    assert(onChangeFake.calledOnce, 'onChange is called once');
    assert.equal(calledWithArgs[0], 'click', 'correct first argument');
    assert.equal(calledWithArgs[1].value.year, 2015, 'correct year');
    assert.equal(calledWithArgs[1].value.month, 7, 'correct month');
  });
});

describe('<MonthPicker />: switchToNextPage', () => {
  it('shift date 1 year forward', () => {
    const date = moment('2015-05-01');
    const wrapper = shallow(<MonthPicker
      initializeWith={date} />);

    assert(_.isFunction(wrapper.instance().switchToNextPage), 'has `switchToNextPage` method');
    assert.equal(wrapper.instance().state.date.year(), 2015, '`date` unshifted yet');
    wrapper.instance().switchToNextPage();
    assert.equal(wrapper.instance().state.date.year(), 2015 + 1, '`date` shifted');
  });
});

describe('<MonthPicker />: switchToPrevPage', () => {
  it('shift date 1 year backward', () => {
    const date = moment('2015-05-01');
    const wrapper = shallow(<MonthPicker
      initializeWith={date} />);

    assert(_.isFunction(wrapper.instance().switchToPrevPage), 'has `switchToPrevPage` method');
    assert.equal(wrapper.instance().state.date.year(), 2015, '`date` unshifted yet');
    wrapper.instance().switchToPrevPage();
    assert.equal(wrapper.instance().state.date.year(), 2015 - 1, '`date` shifted');
  });
});
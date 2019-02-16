import { assert } from 'chai';
import {
  mount,
} from 'enzyme';
import * as sinon from 'sinon';
import * as React from 'react';
import * as _ from 'lodash';
import moment from 'moment';

import MonthPicker from '../../src/pickers/monthPicker/MonthPicker';

describe('<MonthPicker />', () => {
  it('initialized with moment', () => {
    const date = moment('2015-05-01');
    const wrapper = mount(<MonthPicker initializeWith={date} />);
    assert(moment.isMoment(wrapper.state('date')), 'has moment instance in `date` state field');
    assert(wrapper.state('date').isSame(date), 'initialize `date` state field with moment provided in `initializeWith` prop');
  });
});

describe('<MonthPicker />: buildCalendarValues', () => {
  const date = moment('2015-05-01');
  /* current year 2015 */
  it('return array of strings', () => {
    const wrapper = mount(<MonthPicker initializeWith={date} />);
    assert(_.isArray(wrapper.instance().buildCalendarValues()), 'return array');
    wrapper.instance().buildCalendarValues().forEach((month) => {
      assert(_.isString(month), 'contains strings');
    });
  });
});

describe('<MonthPicker />: getActiveCellPosition', () => {
  const date = moment('2015-05-01');
  /* current year 2015 */
  it('return index of active month', () => {
    const wrapper = mount(<MonthPicker
      value={moment('2015-02-18')}
      initializeWith={date} />);
    assert(_.isNumber(wrapper.instance().getActiveCellPosition()), 'return number');
    assert.equal(wrapper.instance().getActiveCellPosition(), 1, 'return index 1 (means February)');
  });

  it('return undefined `value` is not provided', () => {
    const wrapper = mount(<MonthPicker
      initializeWith={date} />);
    assert(_.isUndefined(wrapper.instance().getActiveCellPosition()), 'return undefined');
  });
});

describe('<MonthPicker />: getDisabledPositions', () => {
  const date = moment('2015-05-01');
  /* current year 2015 */

  it('return indexes of disabled months', () => {
    const wrapper = mount(<MonthPicker
      disable={[moment('2015-04-01'), moment('2015-07-01')]}
      initializeWith={date} />);
    /* disabled indexes: 3, 6 */
    assert(_.isArray(wrapper.instance().getDisabledPositions()), 'return array');
    assert.equal(wrapper.instance().getDisabledPositions().length, 2, 'return array of length 2');
    wrapper.instance().getDisabledPositions().forEach((month) => {
      assert(_.isNumber(month), 'contains numbers only');
    });
    assert(_.includes(wrapper.instance().getDisabledPositions(), 3), 'month in position 3 is disabled');
    assert(_.includes(wrapper.instance().getDisabledPositions(), 6), 'month in position 6 is disabled');
  });

  it('return indexes of disabled months in current year only', () => {
    const wrapper = mount(<MonthPicker
      disable={[moment('2015-04-01'), moment('2015-07-01'), moment('2014-01-01'), moment('2016-09-01')]}
      initializeWith={date} />);
    /* disabled indexes: 3, 6 */
    assert(_.isArray(wrapper.instance().getDisabledPositions()), 'return array');
    assert.equal(wrapper.instance().getDisabledPositions().length, 2, 'return array of length 2');
    wrapper.instance().getDisabledPositions().forEach((month) => {
      assert(_.isNumber(month), 'contains numbers only');
    });
    assert(_.includes(wrapper.instance().getDisabledPositions(), 3), 'month in position 3 is disabled');
    assert(_.includes(wrapper.instance().getDisabledPositions(), 6), 'month in position 6 is disabled');
  });

  it('works properly if `minDate` prop is provided (which is in current year)', () => {
    const wrapper = mount(<MonthPicker
      minDate={moment('2015-03-01')}
      initializeWith={date} />);
    /* disabled indexes: 0, 1 */
    assert(_.isArray(wrapper.instance().getDisabledPositions()), 'return array');
    assert.equal(wrapper.instance().getDisabledPositions().length, 2, 'return array of length 2');
    wrapper.instance().getDisabledPositions().forEach((month) => {
      assert(_.isNumber(month), 'contains numbers only');
    });
    assert(_.includes(wrapper.instance().getDisabledPositions(), 0), 'month in position 0 is disabled');
    assert(_.includes(wrapper.instance().getDisabledPositions(), 1), 'month in position 1 is disabled');
  });

  it('works properly if `minDate` prop is provided (which is before the current year)', () => {
    const wrapper = mount(<MonthPicker
      minDate={moment('2014-03-01')}
      initializeWith={date} />);
    /* disabled indexes: none */
    assert(_.isUndefined(wrapper.instance().getDisabledPositions()), 'return undefined');
  });

  it('works properly if `minDate` prop is provided (which is after the current year)', () => {
    const wrapper = mount(<MonthPicker
      minDate={moment('2016-09-01')}
      initializeWith={date} />);
    /* disabled indexes: all */
    const disabledRange = _.range(0, 12);
    assert(_.isArray(wrapper.instance().getDisabledPositions()), 'return array');
    assert.equal(wrapper.instance().getDisabledPositions().length, 12, 'return array of length 12');
    wrapper.instance().getDisabledPositions().forEach((month) => {
      assert(_.isNumber(month), 'contains numbers only');
    });
    wrapper.instance().getDisabledPositions().forEach((month) => {
      assert(_.includes(disabledRange, month), 'includes all months');
    });
  });

  it('works properly if `maxDate` prop is provided (which is in current year)', () => {
    const wrapper = mount(<MonthPicker
      maxDate={moment('2015-09-01')}
      initializeWith={date} />);
    /* disabled indexes: 9, 10, 11 */
    assert(_.isArray(wrapper.instance().getDisabledPositions()), 'return array');
    assert.equal(wrapper.instance().getDisabledPositions().length, 3, 'return array of length 3');
    wrapper.instance().getDisabledPositions().forEach((month) => {
      assert(_.isNumber(month), 'contains numbers only');
    });
    assert(_.includes(wrapper.instance().getDisabledPositions(), 9), 'month in position 9 is disabled');
    assert(_.includes(wrapper.instance().getDisabledPositions(), 10), 'month in position 10 is disabled');
    assert(_.includes(wrapper.instance().getDisabledPositions(), 11), 'month in position 11 is disabled');
  });

  it('works properly if `maxDate` prop is provided (which is after the current year)', () => {
    const wrapper = mount(<MonthPicker
      maxDate={moment('2016-03-01')}
      initializeWith={date} />);
    /* disabled indexes: none */
    assert(_.isUndefined(wrapper.instance().getDisabledPositions()), 'return undefined');
  });

  it('works properly if `maxDate` prop is provided (which is before the current year)', () => {
    const wrapper = mount(<MonthPicker
      maxDate={moment('2014-09-01')}
      initializeWith={date} />);
    /* disabled indexes: all */
    const disabledRange = _.range(0, 12);
    assert(_.isArray(wrapper.instance().getDisabledPositions()), 'return array');
    assert.equal(wrapper.instance().getDisabledPositions().length, 12, 'return array of length 12');
    wrapper.instance().getDisabledPositions().forEach((month) => {
      assert(_.isNumber(month), 'contains numbers only');
    });
    wrapper.instance().getDisabledPositions().forEach((month) => {
      assert(_.includes(disabledRange, month), 'includes all months');
    });
  });

  it('works properly if `maxDate`, `minDate`, `disabled` props are all provided', () => {
    const wrapper = mount(<MonthPicker
      maxDate={moment('2015-10-01')}
      minDate={moment('2015-02-01')}
      disable={[moment('2015-06-01')]}
      initializeWith={date} />);
    /* disabled indexes: 0, 5, 10, 11 */
    assert(_.isArray(wrapper.instance().getDisabledPositions()), 'return array');
    assert.equal(wrapper.instance().getDisabledPositions().length, 4, 'return array of length 4');
    wrapper.instance().getDisabledPositions().forEach((month) => {
      assert(_.isNumber(month), 'contains numbers only');
    });
    assert(_.includes(wrapper.instance().getDisabledPositions(), 0), 'month at position 0 is disabled');
    assert(_.includes(wrapper.instance().getDisabledPositions(), 5), 'month at position 5 is disabled');
    assert(_.includes(wrapper.instance().getDisabledPositions(), 10), 'month at position 10 is disabled');
    assert(_.includes(wrapper.instance().getDisabledPositions(), 11), 'month at position 11 is disabled');
  });

  it('works properly if `maxDate`, `minDate`, `disabled` props are all undefined', () => {
    const wrapper = mount(<MonthPicker
      initializeWith={date} />);
    /* disabled indexes: none */
    assert(_.isUndefined(wrapper.instance().getDisabledPositions()), 'return undefined');
  });
});

describe('<MonthPicker />: isNextPageAvailable', () => {
  const date = moment('2015-05-01');
  /* current year 2015 */

  it('has method `isNextPageAvailable`', () => {
    const wrapper = mount(<MonthPicker
      initializeWith={date} />);

    assert(_.isFunction(wrapper.instance().isNextPageAvailable), 'has the method');
  });

  it('return false if maxDate in current year', () => {
    const wrapper = mount(<MonthPicker
      maxDate={moment('2015-11-01')}
      initializeWith={date} />);

    assert(_.isBoolean(wrapper.instance().isNextPageAvailable()), 'return boolean');
    assert.isFalse(wrapper.instance().isNextPageAvailable(), 'return false');
  });

  it('return true if maxDate is in next year', () => {
    const wrapper = mount(<MonthPicker
      maxDate={moment('2016-11-01')}
      initializeWith={date} />);

    assert(_.isBoolean(wrapper.instance().isNextPageAvailable()), 'return boolean');
    assert.isTrue(wrapper.instance().isNextPageAvailable(), 'return true');
  });

  it('return true if maxDate is in a year after next year', () => {
    const wrapper = mount(<MonthPicker
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
    const wrapper = mount(<MonthPicker
      initializeWith={date} />);

    assert(_.isFunction(wrapper.instance().isPrevPageAvailable), 'has the method');
  });

  it('return false if minDate in current year', () => {
    const wrapper = mount(<MonthPicker
      minDate={moment('2015-01-01')}
      initializeWith={date} />);

    assert(_.isBoolean(wrapper.instance().isPrevPageAvailable()), 'return boolean');
    assert.isFalse(wrapper.instance().isPrevPageAvailable(), 'return false');
  });

  it('return true if minDate is in previous year', () => {
    const wrapper = mount(<MonthPicker
      minDate={moment('2014-11-01')}
      initializeWith={date} />);

    assert(_.isBoolean(wrapper.instance().isPrevPageAvailable()), 'return boolean');
    assert.isTrue(wrapper.instance().isPrevPageAvailable(), 'return true');
  });

  it('return true if minDate is in a year before previous year', () => {
    const wrapper = mount(<MonthPicker
      minDate={moment('2000-11-01')}
      initializeWith={date} />);

    assert(_.isBoolean(wrapper.instance().isPrevPageAvailable()), 'return boolean');
    assert.isTrue(wrapper.instance().isPrevPageAvailable(), 'return true');
  });
});

describe('<MonthPicker />: getCurrentDate', () => {
  const date = moment('2015-05-01');
  /* current year 2015 */

  it('has method `getCurrentDate`', () => {
    const wrapper = mount(<MonthPicker
      initializeWith={date} />);

    assert(_.isFunction(wrapper.instance().getCurrentDate), 'has the method');
  });

  it('return current year as string', () => {
    const wrapper = mount(<MonthPicker
      initializeWith={date} />);

    assert(_.isString(wrapper.instance().getCurrentDate()), 'return string');
    assert.equal(wrapper.instance().getCurrentDate(), '2015', 'return current year');
  });
});

describe('<MonthPicker />: handleChange', () => {
  const date = moment('2015-05-01');
  /* current year 2015 */

  it('has method `handleChange`', () => {
    const wrapper = mount(<MonthPicker
      initializeWith={date} />);

    assert(_.isFunction(wrapper.instance().handleChange), 'has the method');
  });

  it('call `onChange` with proper arguments', () => {
    const onChangeFake = sinon.fake();
    const wrapper = mount(<MonthPicker
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
    const wrapper = mount(<MonthPicker
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
    const wrapper = mount(<MonthPicker
      initializeWith={date} />);

    assert(_.isFunction(wrapper.instance().switchToPrevPage), 'has `switchToPrevPage` method');
    assert.equal(wrapper.instance().state.date.year(), 2015, '`date` unshifted yet');
    wrapper.instance().switchToPrevPage();
    assert.equal(wrapper.instance().state.date.year(), 2015 - 1, '`date` shifted');
  });
});

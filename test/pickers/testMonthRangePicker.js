import { assert } from 'chai';
import {
  mount,
} from 'enzyme';
import * as sinon from 'sinon';
import * as React from 'react';
import * as _ from 'lodash';
import moment from 'moment';

import MonthRangePicker from '../../src/pickers/monthPicker/MonthRangePicker';

describe('<MonthRangePicker />', () => {
  it('initialized with moment', () => {
    const date = moment('2015-05-01');
    const wrapper = mount(<MonthRangePicker initializeWith={date} />);
    assert(moment.isMoment(wrapper.state('date')), 'has moment instance in `date` state field');
    assert(wrapper.state('date').isSame(date), 'initialize `date` state field with moment provided in `initializeWith` prop');
  });
});

describe('<MonthRangePicker />: buildCalendarValues', () => {
  const date = moment('2015-05-01');
  /* current year 2015 */
  it('return array of strings', () => {
    const wrapper = mount(<MonthRangePicker initializeWith={date} />);
    assert(_.isArray(wrapper.instance().buildCalendarValues()), 'return array');
    wrapper.instance().buildCalendarValues().forEach((month) => {
      assert(_.isString(month), 'contains strings');
    });
  });

  it('return array of localized strings', () => {
    const wrapper = mount(<MonthRangePicker localization='ru' initializeWith={date} />);
    assert(_.isArray(wrapper.instance().buildCalendarValues()), 'return array');
    wrapper.instance().buildCalendarValues().forEach((month) => {
      assert(_.isString(month), 'contains strings');
      assert.isTrue(moment(month, 'MMM MMMM', 'ru').isValid(), 'localized month parsed correctly');
    });
  });
});

describe('<MonthRangePicker />: getActiveCellPosition', () => {
  const date = moment('2015-05-01');
  /* current year 2015 */
  it('return index of start month', () => {
    const wrapper = mount(<MonthRangePicker
      start={moment({year: '2015', month: '03'})}
      initializeWith={date} />);
    const rangeIndexes = wrapper.instance().getActiveCellsPositions();
    assert(_.isNumber(rangeIndexes.start), 'return number of start');
    assert.equal(rangeIndexes.start, 3, 'return index 2 (means March)');
    assert(_.isNil(rangeIndexes.end), 'return undefined of end');
  });

  it('return undefined if year of `value` does not equal to year of `date`', () => {
    const wrapper = mount(<MonthRangePicker
      start={moment({year: '2020', month: '02'})}
      initializeWith={date} />);
    const rangeIndexes = wrapper.instance().getActiveCellsPositions();
    assert(_.isUndefined(rangeIndexes.start), 'return undefined');
    assert(_.isNil(rangeIndexes.end), 'return undefined of end');
  });

  it('return indexes of start and end month', () => {
    const wrapper = mount(<MonthRangePicker
      start={moment({year: '2015', month: '03'})}
      end={moment({year: '2015', month: '07'})}
      initializeWith={date} />);
    const rangeIndexes = wrapper.instance().getActiveCellsPositions();
    assert(_.isNumber(rangeIndexes.start), 'return number of start');
    assert.equal(rangeIndexes.start, 3, 'return index 3 (means March)');
    assert(_.isNumber(rangeIndexes.end), 'return number of start');
    assert.equal(rangeIndexes.end, 7, 'return index 7 (means June)');
  });

  it('return undefined `value` is not provided', () => {
    const wrapper = mount(<MonthRangePicker
      initializeWith={date} />);
    const rangeIndexes = wrapper.instance().getActiveCellsPositions();
    assert(_.isUndefined(rangeIndexes.start), 'return undefined of start');
    assert(_.isUndefined(rangeIndexes.end), 'return undefined of end');
  });
});

describe('<MonthRangePicker />: getDisabledPositions', () => {
  const date = moment('2015-05-01');
  /* current year 2015 */

  it('works properly if `minDate` prop is provided (which is in current year)', () => {
    const wrapper = mount(<MonthRangePicker
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
    const wrapper = mount(<MonthRangePicker
      minDate={moment('2014-03-01')}
      initializeWith={date} />);
    /* disabled indexes: none */
    assert(_.isUndefined(wrapper.instance().getDisabledPositions()), 'return undefined');
  });

  it('works properly if `minDate` prop is provided (which is after the current year)', () => {
    const wrapper = mount(<MonthRangePicker
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
    const wrapper = mount(<MonthRangePicker
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
    const wrapper = mount(<MonthRangePicker
      maxDate={moment('2016-03-01')}
      initializeWith={date} />);
    /* disabled indexes: none */
    assert(_.isUndefined(wrapper.instance().getDisabledPositions()), 'return undefined');
  });

  it('works properly if `maxDate` prop is provided (which is before the current year)', () => {
    const wrapper = mount(<MonthRangePicker
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

  it('works properly if `maxDate`, `minDate` props are all provided', () => {
    const wrapper = mount(<MonthRangePicker
      maxDate={moment('2015-10-01')}
      minDate={moment('2015-02-01')}
      initializeWith={date} />);
    /* disabled indexes: 0, 10, 11 */
    assert(_.isArray(wrapper.instance().getDisabledPositions()), 'return array');
    assert.equal(wrapper.instance().getDisabledPositions().length, 3, 'return array of length 4');
    wrapper.instance().getDisabledPositions().forEach((month) => {
      assert(_.isNumber(month), 'contains numbers only');
    });
    assert(_.includes(wrapper.instance().getDisabledPositions(), 0), 'month at position 0 is disabled');
    assert(_.includes(wrapper.instance().getDisabledPositions(), 10), 'month at position 10 is disabled');
    assert(_.includes(wrapper.instance().getDisabledPositions(), 11), 'month at position 11 is disabled');
  });

  it('works properly if `maxDate`, `minDate`, `disabled` props are all undefined', () => {
    const wrapper = mount(<MonthRangePicker
      initializeWith={date} />);
    /* disabled indexes: none */
    assert(_.isUndefined(wrapper.instance().getDisabledPositions()), 'return undefined');
  });
});

describe('<MonthRangePicker />: isNextPageAvailable', () => {
  const date = moment('2015-05-01');
  /* current year 2015 */

  it('has method `isNextPageAvailable`', () => {
    const wrapper = mount(<MonthRangePicker
      initializeWith={date} />);

    assert(_.isFunction(wrapper.instance().isNextPageAvailable), 'has the method');
  });

  it('return false if maxDate in current year', () => {
    const wrapper = mount(<MonthRangePicker
      maxDate={moment('2015-11-01')}
      initializeWith={date} />);

    assert(_.isBoolean(wrapper.instance().isNextPageAvailable()), 'return boolean');
    assert.isFalse(wrapper.instance().isNextPageAvailable(), 'return false');
  });

  it('return true if maxDate is in next year', () => {
    const wrapper = mount(<MonthRangePicker
      maxDate={moment('2016-11-01')}
      initializeWith={date} />);

    assert(_.isBoolean(wrapper.instance().isNextPageAvailable()), 'return boolean');
    assert.isTrue(wrapper.instance().isNextPageAvailable(), 'return true');
  });

  it('return true if maxDate is in a year after next year', () => {
    const wrapper = mount(<MonthRangePicker
      maxDate={moment('2019-11-01')}
      initializeWith={date} />);

    assert(_.isBoolean(wrapper.instance().isNextPageAvailable()), 'return boolean');
    assert.isTrue(wrapper.instance().isNextPageAvailable(), 'return true');
  });
});

describe('<MonthRangePicker />: isPrevPageAvailable', () => {
  const date = moment('2015-05-01');
  /* current year 2015 */

  it('has method `isPrevPageAvailable`', () => {
    const wrapper = mount(<MonthRangePicker
      initializeWith={date} />);

    assert(_.isFunction(wrapper.instance().isPrevPageAvailable), 'has the method');
  });

  it('return false if minDate in current year', () => {
    const wrapper = mount(<MonthRangePicker
      minDate={moment('2015-01-01')}
      initializeWith={date} />);

    assert(_.isBoolean(wrapper.instance().isPrevPageAvailable()), 'return boolean');
    assert.isFalse(wrapper.instance().isPrevPageAvailable(), 'return false');
  });

  it('return true if minDate is in previous year', () => {
    const wrapper = mount(<MonthRangePicker
      minDate={moment('2014-11-01')}
      initializeWith={date} />);

    assert(_.isBoolean(wrapper.instance().isPrevPageAvailable()), 'return boolean');
    assert.isTrue(wrapper.instance().isPrevPageAvailable(), 'return true');
  });

  it('return true if minDate is in a year before previous year', () => {
    const wrapper = mount(<MonthRangePicker
      minDate={moment('2000-11-01')}
      initializeWith={date} />);

    assert(_.isBoolean(wrapper.instance().isPrevPageAvailable()), 'return boolean');
    assert.isTrue(wrapper.instance().isPrevPageAvailable(), 'return true');
  });
});

describe('<MonthRangePicker />: getCurrentDate', () => {
  const date = moment('2015-05-01');
  /* current year 2015 */

  it('has method `getCurrentDate`', () => {
    const wrapper = mount(<MonthRangePicker
      initializeWith={date} />);

    assert(_.isFunction(wrapper.instance().getCurrentDate), 'has the method');
  });

  it('return current year as string', () => {
    const wrapper = mount(<MonthRangePicker
      initializeWith={date} />);

    assert(_.isString(wrapper.instance().getCurrentDate()), 'return string');
    assert.equal(wrapper.instance().getCurrentDate(), '2015', 'return current year');
  });
});

describe('<MonthRangePicker />: handleChange', () => {
  const date = moment('2015-05-01');
  /* current year 2015 */

  it('has method `handleChange`', () => {
    const wrapper = mount(<MonthRangePicker
      initializeWith={date} />);

    assert(_.isFunction(wrapper.instance().handleChange), 'has the method');
  });

  it('call `onChange` with props argument', () => {
    const onChangeFake = sinon.fake();
    const wrapper = mount(<MonthRangePicker
      onChange={onChangeFake}
      initializeWith={date} />);

    wrapper.instance().handleChange('click', { itemPosition: 3});
    const calledWithArgs = onChangeFake.args[0];
    const start = calledWithArgs[1].value.start;
    assert(onChangeFake.calledOnce, 'onChange is called once');
    assert.equal(calledWithArgs[0], 'click', 'correct first argument');
    assert.isTrue(moment.isMoment(calledWithArgs[1].value.start), 'correct start');
    assert.equal(start.year(), '2015', 'correct start year');
    assert.equal(start.month(), '03', 'correct start month');
    assert.isTrue(!moment.isMoment(calledWithArgs[1].value.end), 'correct end');
  });


  it('call `onChange` with props argument for end month selected', () => {
    const onChangeFake = sinon.fake();
    const wrapper = mount(<MonthRangePicker
      onChange={onChangeFake}
      start={moment({year: '2015', month: '03'})}
      initializeWith={date} />);

    wrapper.instance().handleChange('click', { itemPosition: 7});
    const calledWithArgs = onChangeFake.args[0];
    const start = calledWithArgs[1].value.start;
    const end = calledWithArgs[1].value.end;
    assert(onChangeFake.calledOnce, 'onChange is called once');
    assert.equal(calledWithArgs[0], 'click', 'correct first argument');
    assert.isTrue(moment.isMoment(start), 'correct start');
    assert.equal(start.year(), '2015', 'correct start year');
    assert.equal(start.month(), '03', 'correct start month');

    assert.isTrue(moment.isMoment(calledWithArgs[1].value.end), 'correct end');
    assert.equal(end.year(), '2015', 'correct end year');
    assert.equal(end.month(), '07', 'correct end month');
  });
});

describe('<MonthRangePicker />: switchToNextPage', () => {
  it('shift date 1 year forward', () => {
    const date = moment('2015-05-01');
    const wrapper = mount(<MonthRangePicker
      initializeWith={date} />);

    assert(_.isFunction(wrapper.instance().switchToNextPage), 'has `switchToNextPage` method');
    assert.equal(wrapper.instance().state.date.year(), 2015, '`date` unshifted yet');
    wrapper.instance().switchToNextPage();
    assert.equal(wrapper.instance().state.date.year(), 2015 + 1, '`date` shifted');
  });
});

describe('<MonthRangePicker />: switchToPrevPage', () => {
  it('shift date 1 year backward', () => {
    const date = moment('2015-05-01');
    const wrapper = mount(<MonthRangePicker
      initializeWith={date} />);

    assert(_.isFunction(wrapper.instance().switchToPrevPage), 'has `switchToPrevPage` method');
    assert.equal(wrapper.instance().state.date.year(), 2015, '`date` unshifted yet');
    wrapper.instance().switchToPrevPage();
    assert.equal(wrapper.instance().state.date.year(), 2015 - 1, '`date` shifted');
  });
});

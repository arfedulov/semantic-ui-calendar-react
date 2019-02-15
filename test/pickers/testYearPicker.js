import { assert } from 'chai';
import {
  mount,
} from 'enzyme';
import * as sinon from 'sinon';
import * as React from 'react';
import * as _ from 'lodash';
import moment from 'moment';

import YearPicker from '../../src/pickers/YearPicker';

describe('<YearPicker />', () => {
  it('initialized with moment', () => {
    const date = moment('2015-05-01');
    const wrapper = mount(<YearPicker initializeWith={date} />);
    assert(moment.isMoment(wrapper.state('date')), 'has moment instance in `date` state field');
    assert(wrapper.state('date').isSame(date), 'initialize `date` state field with moment provided in `initializeWith` prop');
  });
});

describe('<YearPicker />: buildCalendarValues', function() {
  it('has `buildCalendarValues` method that works properly', () => {
    const date = moment('2015-05-01');
    const shouldBuildYears = [
      '2004', '2005', '2006',
      '2007', '2008', '2009',
      '2010', '2011', '2012',
      '2013', '2014', '2015',
    ];
    const wrapper = mount(<YearPicker initializeWith={date} />);
    assert(_.isFunction(wrapper.instance().buildCalendarValues), 'has the method');
    assert(_.isArray(wrapper.instance().buildCalendarValues()), 'method returns array');
    assert.equal(wrapper.instance().buildCalendarValues().length, 12, 'method returns array');
    _.forEach(wrapper.instance().buildCalendarValues(), (year) => {
      assert(_.isString(year), 'contains string');
    });
    _.forEach(wrapper.instance().buildCalendarValues(), (year, i) => {
      assert.equal(year, shouldBuildYears[i], 'contains expected year');
    });
  });
});

describe('<YearPicker />: getActiveCellPosition', function() {
  it('works properly when`value` prop provided', () => {
    const date = moment('2015-05-01');
    /*
    [
      '2004', '2005', '2006',
      '2007', '2008', '2009',
      '2010', '2011', '2012',
      '2013', '2014', '2015',
    ]
    */
    const wrapper = mount(<YearPicker
      initializeWith={date}
      value={moment('2012-01-01')} />);
    assert(_.isFunction(wrapper.instance().getActiveCellPosition), 'has the method');
    assert(_.isNumber(wrapper.instance().getActiveCellPosition()), 'method returns number');
    assert.equal(wrapper.instance().getActiveCellPosition(), 8, 'method returns active year index');
  });

  it('works properly when `value` prop is undefined', () => {
    const date = moment('2015-05-01');
    const wrapper = mount(<YearPicker
      initializeWith={date} />);
    assert(_.isUndefined(wrapper.instance().getActiveCellPosition()), 'method returns undefined if `value` prop is undefined');
  });
});

describe('<YearPicker />: getDisabledPositions', function() {
  it('works properly when `disable` prop is provided', () => {
    const date = moment('2015-05-01');
    /*
    [
      '2004', '2005', '2006',
      '2007', '2008', '2009',
      '2010', '2011', '2012',
      '2013', '2014', '2015',
    ]
    */
    const wrapper = mount(<YearPicker
      disable={[moment('2006-01-01'), moment('2008-01-01')]}
      initializeWith={date} />);
    assert(_.isFunction(wrapper.instance().getDisabledPositions), 'has the method');
    assert(_.isArray(wrapper.instance().getDisabledPositions()), 'method returns an array');
    assert.equal(wrapper.instance().getDisabledPositions().length, 2, 'method returns an array of length 2');
    _.forEach(wrapper.instance().getDisabledPositions(), (disabledIndex) => {
      assert(_.isNumber(disabledIndex), 'contains numbers only');
    });
    assert(_.includes(wrapper.instance().getDisabledPositions(), 2), 'year at position 2 is disabled');
    assert(_.includes(wrapper.instance().getDisabledPositions(), 4), 'year at position 4 is disabled');
  });

  it('works properly when `maxDate` prop is provided', () => {
    const date = moment('2015-05-01');
    /*
    [
      '2004', '2005', '2006',
      '2007', '2008', '2009',
      '2010', '2011', '2012',
      '2013', '2014', '2015',
    ]
    */
    const wrapper = mount(<YearPicker
      maxDate={moment('2011-01-01')}
      initializeWith={date} />);
    assert(_.isArray(wrapper.instance().getDisabledPositions()), 'method returns an array');
    assert.equal(wrapper.instance().getDisabledPositions().length, 4, 'method returns an array of length 4');
    _.forEach(wrapper.instance().getDisabledPositions(), (disabledIndex) => {
      assert(_.isNumber(disabledIndex), 'contains numbers only');
    });
    assert(_.includes(wrapper.instance().getDisabledPositions(), 8), 'year at position 8 is disabled');
    assert(_.includes(wrapper.instance().getDisabledPositions(), 9), 'year at position 9 is disabled');
    assert(_.includes(wrapper.instance().getDisabledPositions(), 10), 'year at position 10 is disabled');
    assert(_.includes(wrapper.instance().getDisabledPositions(), 11), 'year at position 11 is disabled');
  });

  it('works properly when `minDate` prop is provided', () => {
    const date = moment('2015-05-01');
    /*
    [
      '2004', '2005', '2006',
      '2007', '2008', '2009',
      '2010', '2011', '2012',
      '2013', '2014', '2015',
    ]
    */
    const wrapper = mount(<YearPicker
      minDate={moment('2006-01-01')}
      initializeWith={date} />);
    assert(_.isArray(wrapper.instance().getDisabledPositions()), 'method returns an array');
    assert.equal(wrapper.instance().getDisabledPositions().length, 2, 'method returns an array of length 2');
    _.forEach(wrapper.instance().getDisabledPositions(), (disabledIndex) => {
      assert(_.isNumber(disabledIndex), 'contains numbers only');
    });
    assert(_.includes(wrapper.instance().getDisabledPositions(), 0), 'year at position 0 is disabled');
    assert(_.includes(wrapper.instance().getDisabledPositions(), 1), 'year at position 1 is disabled');
  });

  it('works properly when `minDate`, `maxDate`, `disable` props are all provided', () => {
    const date = moment('2015-05-01');
    /*
    [
      '2004', '2005', '2006',
      '2007', '2008', '2009',
      '2010', '2011', '2012',
      '2013', '2014', '2015',
    ]
    */
    const wrapper = mount(<YearPicker
      minDate={moment('2006-01-01')}
      maxDate={moment('2014-01-01')}
      disable={[moment('2008-01-01')]}
      initializeWith={date} />);
    /* disabled indexes: 0, 1, 4, 11 */
    assert(_.isArray(wrapper.instance().getDisabledPositions()), 'method returns an array');
    assert.equal(wrapper.instance().getDisabledPositions().length, 4, 'method returns an array of length 4');
    _.forEach(wrapper.instance().getDisabledPositions(), (disabledIndex) => {
      assert(_.isNumber(disabledIndex), 'contains numbers only');
    });
    assert(_.includes(wrapper.instance().getDisabledPositions(), 0), 'year at position 0 is disabled');
    assert(_.includes(wrapper.instance().getDisabledPositions(), 1), 'year at position 1 is disabled');
    assert(_.includes(wrapper.instance().getDisabledPositions(), 4), 'year at position 4 is disabled');
    assert(_.includes(wrapper.instance().getDisabledPositions(), 11), 'year at position 11 is disabled');
  });

  it('works properly when `disable`, `minDate`, `maxDate` props are undefined', () => {
    const date = moment('2015-05-01');
    /*
    [
      '2004', '2005', '2006',
      '2007', '2008', '2009',
      '2010', '2011', '2012',
      '2013', '2014', '2015',
    ]
    */
    const wrapper = mount(<YearPicker
      initializeWith={date} />);
    assert(_.isFunction(wrapper.instance().getDisabledPositions), 'has the method');
    assert(_.isUndefined(wrapper.instance().getDisabledPositions()), 'method returns undefined');
  });

  describe('maxDate and minDate are in current year', () => {
    const YEARS_ON_PAGE = 12;
    it('return all positions except one', () => {
      const date = moment('2015-05-01');
      const maxDate = moment('2015-05-01');
      const minDate = moment('2015-02-01');
      /*
      [
        '2004', '2005', '2006',
        '2007', '2008', '2009',
        '2010', '2011', '2012',
        '2013', '2014', '2015',
      ]
      */
      const wrapper = mount(<YearPicker
        initializeWith={date}
        maxDate={maxDate}
        minDate={minDate} />);

      const shouldReturn = _.range(0, YEARS_ON_PAGE - 1);
      assert(_.isFunction(wrapper.instance().getDisabledPositions), 'has the method');
      assert.equal(wrapper.instance().getDisabledPositions().length, 11, 'method returns an array of length 11');
      _.forEach(wrapper.instance().getDisabledPositions(), (disabledIndex) => {
        assert(_.isNumber(disabledIndex), 'contains numbers only');
      });
      const producesValues = wrapper.instance().getDisabledPositions();
      shouldReturn.forEach((yearPosition) => {
        assert(_.includes(producesValues, yearPosition), 'produce correct values');
      });
    });
  });

  describe('maxDate and minDate are on previous page', () => {
    const YEARS_ON_PAGE = 12;
    it('return all positions', () => {
      const date = moment('2015-05-01');
      const maxDate = moment('1999-05-01');
      const minDate = moment('1995-02-01');
      /*
      [
        '2004', '2005', '2006',
        '2007', '2008', '2009',
        '2010', '2011', '2012',
        '2013', '2014', '2015',
      ]
      */
      const wrapper = mount(<YearPicker
        initializeWith={date}
        maxDate={maxDate}
        minDate={minDate} />);

      const shouldReturn = _.range(0, YEARS_ON_PAGE);
      assert(_.isFunction(wrapper.instance().getDisabledPositions), 'has the method');
      assert.equal(wrapper.instance().getDisabledPositions().length, 12, 'method returns an array of length 12');
      _.forEach(wrapper.instance().getDisabledPositions(), (disabledIndex) => {
        assert(_.isNumber(disabledIndex), 'contains numbers only');
      });
      const producesValues = wrapper.instance().getDisabledPositions();
      shouldReturn.forEach((yearPosition) => {
        assert(_.includes(producesValues, yearPosition), 'produce correct values');
      });
    });
  });

  describe('maxDate and minDate are on next page', () => {
    const YEARS_ON_PAGE = 12;
    it('return all positions', () => {
      const date = moment('2015-05-01');
      const maxDate = moment('2020-05-01');
      const minDate = moment('2018-02-01');
      /*
      [
        '2004', '2005', '2006',
        '2007', '2008', '2009',
        '2010', '2011', '2012',
        '2013', '2014', '2015',
      ]
      */
      const wrapper = mount(<YearPicker
        initializeWith={date}
        maxDate={maxDate}
        minDate={minDate} />);

      const shouldReturn = _.range(0, YEARS_ON_PAGE);
      assert(_.isFunction(wrapper.instance().getDisabledPositions), 'has the method');
      assert.equal(wrapper.instance().getDisabledPositions().length, 12, 'method returns an array of length 12');
      _.forEach(wrapper.instance().getDisabledPositions(), (disabledIndex) => {
        assert(_.isNumber(disabledIndex), 'contains numbers only');
      });
      const producesValues = wrapper.instance().getDisabledPositions();
      shouldReturn.forEach((yearPosition) => {
        assert(_.includes(producesValues, yearPosition), 'produce correct values');
      });
    });
  });
});

describe('<YearPicker />: isNextPageAvailable', function() {
  describe('`maxDate` prop is not provided', function() {
    const date = moment('2015-05-01');
    /*
    [
      '2004', '2005', '2006',
      '2007', '2008', '2009',
      '2010', '2011', '2012',
      '2013', '2014', '2015',
    ]
    */
    const wrapper = mount(<YearPicker
      initializeWith={date} />);

    it('returns true', () => {
      assert(_.isFunction(wrapper.instance().isNextPageAvailable), 'has the method');
      assert.isTrue(wrapper.instance().isNextPageAvailable(), 'returns true');
    });
  });

  describe('`maxDate` prop is less than last year on the page', function() {
    const date = moment('2015-05-01');
    /*
    [
      '2004', '2005', '2006',
      '2007', '2008', '2009',
      '2010', '2011', '2012',
      '2013', '2014', '2015',
    ]
    */
    const wrapper = mount(<YearPicker
      maxDate={moment('2014-01-01')}
      initializeWith={date} />);

    it('returns false', () => {
      assert.isFalse(wrapper.instance().isNextPageAvailable(), 'returns false');
    });
  });

  describe('`maxDate` prop is equal to the last year on page', function() {
    const date = moment('2015-05-01');
    /*
    [
      '2004', '2005', '2006',
      '2007', '2008', '2009',
      '2010', '2011', '2012',
      '2013', '2014', '2015',
    ]
    */
    const wrapper = mount(<YearPicker
      maxDate={moment('2015-01-01')}
      initializeWith={date} />);

    it('returns false', () => {
      assert.isFalse(wrapper.instance().isNextPageAvailable(), 'returns false');
    });
  });

  describe('`maxDate` prop is bigger than the last year on page', function() {
    const date = moment('2015-05-01');
    /*
    [
      '2004', '2005', '2006',
      '2007', '2008', '2009',
      '2010', '2011', '2012',
      '2013', '2014', '2015',
    ]
    */
    const wrapper = mount(<YearPicker
      maxDate={moment('2018-01-01')}
      initializeWith={date} />);

    it('returns true', () => {
      assert.isTrue(wrapper.instance().isNextPageAvailable(), 'returns true');
    });
  });
});

describe('<YearPicker />: isPrevPageAvailable', function() {
  describe('`minDate` prop is not provided', function() {
    const date = moment('2015-05-01');
    /*
    [
      '2004', '2005', '2006',
      '2007', '2008', '2009',
      '2010', '2011', '2012',
      '2013', '2014', '2015',
    ]
    */
    const wrapper = mount(<YearPicker
      initializeWith={date} />);

    it('returns true', () => {
      assert(_.isFunction(wrapper.instance().isPrevPageAvailable), 'has the method');
      assert.isTrue(wrapper.instance().isPrevPageAvailable(), 'returns true');
    });
  });

  describe('`minDate` prop is bigger than first year on the page', function() {
    const date = moment('2015-05-01');
    /*
    [
      '2004', '2005', '2006',
      '2007', '2008', '2009',
      '2010', '2011', '2012',
      '2013', '2014', '2015',
    ]
    */
    const wrapper = mount(<YearPicker
      minDate={moment('2014-01-01')}
      initializeWith={date} />);

    it('returns false', () => {
      assert.isFalse(wrapper.instance().isPrevPageAvailable(), 'returns false');
    });
  });

  describe('`minDate` prop is equal to the first year on page', function() {
    const date = moment('2015-05-01');
    /*
    [
      '2004', '2005', '2006',
      '2007', '2008', '2009',
      '2010', '2011', '2012',
      '2013', '2014', '2015',
    ]
    */
    const wrapper = mount(<YearPicker
      minDate={moment('2004-01-01')}
      initializeWith={date} />);

    it('returns false', () => {
      assert.isFalse(wrapper.instance().isPrevPageAvailable(), 'returns false');
    });
  });

  describe('`minDate` prop is less than first year on page', function() {
    const date = moment('2015-05-01');
    /*
    [
      '2004', '2005', '2006',
      '2007', '2008', '2009',
      '2010', '2011', '2012',
      '2013', '2014', '2015',
    ]
    */
    const wrapper = mount(<YearPicker
      minDate={moment('2003-01-01')}
      initializeWith={date} />);

    it('returns true', () => {
      assert.isTrue(wrapper.instance().isPrevPageAvailable(), 'returns true');
    });
  });
});

describe('<YearPicker />: handleChange', () => {
  it('call `onChange` with { year: number }', () => {
    const date = moment('2015-05-01');
    const onChangeFake = sinon.fake();
    const wrapper = mount(<YearPicker
      onChange={onChangeFake}
      initializeWith={date} />);
    wrapper.instance().handleChange('click', { value: '2020'});
    const calledWithArgs = onChangeFake.args[0];
    assert(onChangeFake.calledOnce);
    assert.equal(calledWithArgs[0], 'click', 'first argument `click`');
    assert.equal(calledWithArgs[1].value.year, 2020, 'second argument { ..., value: { year: 2020 } }');
  });
});

describe('<YearPicker />: switchToNextPage', () => {
  it('shift date 12 years forward', () => {
    const date = moment('2015-05-01');
    /*
    [
      '2015', '2016', '2017',
      '2018', '2019', '2020',
      '2021', '2022', '2023',
      '2024', '2025', '2026',
    ]
    */
    const wrapper = mount(<YearPicker
      initializeWith={date} />);
    assert(_.isFunction(wrapper.instance().switchToNextPage), 'has `switchToNextPage` method');
    assert.equal(wrapper.instance().state.date.year(), 2015, '`date` unshifted yet');
    wrapper.instance().switchToNextPage();
    assert.equal(wrapper.instance().state.date.year(), 2015 + 12, '`date` shifted');
  });
});

describe('<YearPicker />: switchToPrevPage', () => {
  it('shift date 12 years backward', () => {
    const date = moment('2015-05-01');
    /*
    [
      '2015', '2016', '2017',
      '2018', '2019', '2020',
      '2021', '2022', '2023',
      '2024', '2025', '2026',
    ]
    */
    const wrapper = mount(<YearPicker
      initializeWith={date} />);
    assert(_.isFunction(wrapper.instance().switchToPrevPage), 'has `switchToPrevPage` method');
    assert.equal(wrapper.instance().state.date.year(), 2015, '`date` unshifted yet');
    wrapper.instance().switchToPrevPage();
    assert.equal(wrapper.instance().state.date.year(), 2015 - 12, '`date` shifted');
  });
});

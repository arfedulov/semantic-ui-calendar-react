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

import YearPicker from '../../src/pickers/YearPicker';
import MonthPicker from '../../src/pickers/MonthPicker';
import DayPicker from '../../src/pickers/dayPicker/DayPicker';
import InputView from '../../src/views/InputView';
import DateInput from '../../src/inputs/DateInput';

Enzyme.configure({ adapter: new Adapter() });

describe('<DateInput />', () => {
  it('render <DateInput /> properly', () => {
    const wrapper = shallow(<DateInput />);
    const child = wrapper.children();

    assert(wrapper.is(InputView), 'renders <InputView />');
    assert.equal(wrapper.prop('icon'), 'calendar', 'provide default `icon` prop to InputView');
    assert(_.has(wrapper.props(), 'value'), 'provide value prop to InputView');
    assert(child.is(DayPicker), 'by default child is <DayPicker />');
    assert(_.isFunction(child.prop('onChange')), 'provide `onChange` callback to DayPicker');
    assert(moment.isMoment(child.prop('initializeWith')), 'provide moment instance to `initializeWith` prop on DayPicker');
    assert(_.has(child.props(), 'value'), 'pass `value` prop to DayPicker');
    assert(_.has(child.props(), 'disable'), 'pass `disable` prop to DayPicker');
    assert(_.has(child.props(), 'minDate'), 'pass `minDate` prop to DayPicker');
    assert(_.has(child.props(), 'maxDate'), 'pass `maxDate` prop to DayPicker');
  });

  it('pass unhandled props to <InputView />', () => {
    const wrapper = shallow(<DateInput
      a="prop a"
      b="prop b" />);
    assert(wrapper.render().is(InputView), 'renders <InputView />');
    assert.equal(wrapper.prop('a'), 'prop a', 'provide unhandled prop `a` to InputView');
    assert.equal(wrapper.prop('b'), 'prop b', 'provide unhandled prop `b` to InputView');
  });

  describe('`startMode` year', () => {
    it('render <DateInput /> properly', () => {
      const wrapper = shallow(<DateInput startMode="year" />);
      const child = wrapper.children();

      assert(wrapper.is(InputView), 'renders <InputView />');
      assert.equal(wrapper.prop('icon'), 'calendar', 'provide default `icon` prop to InputView');
      assert(_.has(wrapper.props(), 'value'), 'provide value prop to InputView');
      assert(child.is(YearPicker), 'child is <YearPicker />');
      assert(_.isFunction(child.prop('onChange')), 'provide `onChange` callback to YearPicker');
      assert(moment.isMoment(child.prop('initializeWith')), 'provide moment instance to `initializeWith` prop on YearPicker');
      assert(_.has(child.props(), 'value'), 'pass `value` prop to YearPicker');
      assert(_.has(child.props(), 'disable'), 'pass `disable` prop to YearPicker');
      assert(_.has(child.props(), 'minDate'), 'pass `minDate` prop to YearPicker');
      assert(_.has(child.props(), 'maxDate'), 'pass `maxDate` prop to YearPicker');
    });
  });

  describe('`startMode` month', () => {
    it('render <DateInput /> properly', () => {
      const wrapper = shallow(<DateInput startMode="month" />);
      const child = wrapper.children();

      assert(wrapper.is(InputView), 'renders <InputView />');
      assert.equal(wrapper.prop('icon'), 'calendar', 'provide default `icon` prop to InputView');
      assert(_.has(wrapper.props(), 'value'), 'provide value prop to InputView');
      assert(child.is(MonthPicker), 'child is <MonthPicker />');
      assert(_.isFunction(child.prop('onChange')), 'provide `onChange` callback to MonthPicker');
      assert(moment.isMoment(child.prop('initializeWith')), 'provide moment instance to `initializeWith` prop on MonthPicker');
      assert(_.has(child.props(), 'value'), 'pass `value` prop to MonthPicker');
      assert(_.has(child.props(), 'disable'), 'pass `disable` prop to MonthPicker');
      assert(_.has(child.props(), 'minDate'), 'pass `minDate` prop to MonthPicker');
      assert(_.has(child.props(), 'maxDate'), 'pass `maxDate` prop to MonthPicker');
    });
  });

  describe('`startMode` day', () => {
    it('render <DateInput /> properly', () => {
      const wrapper = shallow(<DateInput startMode="day" />);
      const child = wrapper.children();

      assert(wrapper.is(InputView), 'renders <InputView />');
      assert.equal(wrapper.prop('icon'), 'calendar', 'provide default `icon` prop to InputView');
      assert(_.has(wrapper.props(), 'value'), 'provide value prop to InputView');
      assert(child.is(DayPicker), 'child is <DayPicker />');
      assert(_.isFunction(child.prop('onChange')), 'provide `onChange` callback to DayPicker');
      assert(moment.isMoment(child.prop('initializeWith')), 'provide moment instance to `initializeWith` prop on DayPicker');
      assert(_.has(child.props(), 'value'), 'pass `value` prop to DayPicker');
      assert(_.has(child.props(), 'disable'), 'pass `disable` prop to DayPicker');
      assert(_.has(child.props(), 'minDate'), 'pass `minDate` prop to DayPicker');
      assert(_.has(child.props(), 'maxDate'), 'pass `maxDate` prop to DayPicker');
    });
  });
});

describe('<DateInput />: handleSelect', () => {
  it('call `onChange` when in `day` mode (default)', () => {
    const onChangeFake = sinon.fake();
    const wrapper = shallow(<DateInput
      dateFormat="YYYY-MM-DD"
      onChange={onChangeFake} />);

    wrapper.instance().handleSelect('click', { value: { year: 2030, month: 4, date: 3 } });
    const calledWithArgs = onChangeFake.args[0];

    assert(onChangeFake.calledOnce, '`onChange` callback called once');
    assert.equal(calledWithArgs[0], 'click', 'correct first argument');
    assert(_.isString(calledWithArgs[1].value), 'value is string');
    assert.equal(calledWithArgs[1].value, '2030-05-03', 'correct value');
  });

  it('switch to next mode if not in day mode', () => {
    const onChangeFake = sinon.fake();
    const wrapper = shallow(<DateInput
      dateFormat="YYYY-MM-DD"
      startMode="year"
      onChange={onChangeFake} />);
    
    assert.equal(wrapper.state('mode'), 'year', 'mode not switched yet');
    wrapper.instance().handleSelect('click', { value: { year: 2030 } });
    assert.equal(wrapper.state('mode'), 'month', 'switched to next mode');
  });

  it('does not switch to next mode if in day mode', () => {
    const onChangeFake = sinon.fake();
    const wrapper = shallow(<DateInput
      dateFormat="YYYY-MM-DD"
      startMode="day"
      onChange={onChangeFake} />);
    
    assert.equal(wrapper.state('mode'), 'day', 'mode not switched yet');
    wrapper.instance().handleSelect('click', { value: { year: 2030 } });
    assert.equal(wrapper.state('mode'), 'day', 'mode still not switched');
  });

  it('does not call `onChange` when not in `day` mode', () => {
    const onChangeFake = sinon.fake();
    const wrapper = shallow(<DateInput
      dateFormat="YYYY-MM-DD"
      startMode="year"
      onChange={onChangeFake} />);

    wrapper.instance().handleSelect('click', { value: { year: 2030 } });

    assert.isFalse(onChangeFake.calledOnce, '`onChange` callback is not called');
  });
});

describe('<DateInput />: switchToPrevMode', () => {
  it('switch to previous mode', () => {
    const wrapper = shallow(<DateInput />);

    assert.equal(wrapper.state('mode'), 'day', 'mode is not changed yet');
    wrapper.instance().switchToPrevMode();
    assert.equal(wrapper.state('mode'), 'month', 'mode changed to previous');
  });
});

describe('<DateInput />: switchToNextMode', () => {
  it('switch to next mode', () => {
    const wrapper = shallow(<DateInput />);

    assert.equal(wrapper.state('mode'), 'day', 'mode is not changed yet');
    wrapper.instance().switchToNextMode();
    assert.equal(wrapper.state('mode'), 'year', 'mode changed to next');
  });
});

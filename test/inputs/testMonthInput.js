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
import InputView from '../../src/views/InputView';
import MonthInput from '../../src/inputs/MonthInput';

Enzyme.configure({ adapter: new Adapter() });

describe('<MonthInput />', () => {
  it('render <MonthInput /> properly', () => {
    const wrapper = shallow(<MonthInput />);
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

  it('pass unhandled props to <InputView />', () => {
    const wrapper = shallow(<MonthInput
      a="prop a"
      b="prop b" />);
    assert(wrapper.is(InputView), 'renders <InputView />');
    assert.equal(wrapper.prop('a'), 'prop a', 'provide unhandled prop `a` to InputView');
    assert.equal(wrapper.prop('b'), 'prop b', 'provide unhandled prop `b` to InputView');
  });
});

describe('<MonthInput />: handleSelect', () => {
  it('call `onChange`', () => {
    const onChangeFake = sinon.fake();
    const wrapper = shallow(<MonthInput
      onChange={onChangeFake} />);

    wrapper.instance().handleSelect('click', { value: { month: 5 } });
    const calledWithArgs = onChangeFake.args[0];

    assert(onChangeFake.calledOnce, '`onChange` callback called once');
    assert.equal(calledWithArgs[0], 'click', 'correct first argument');
    assert(_.isString(calledWithArgs[1].value), 'value is string');
    assert.equal(calledWithArgs[1].value, 'Jun', 'correct value');
  });
});

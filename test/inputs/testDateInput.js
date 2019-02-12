import { assert } from 'chai';
import {
  mount
} from 'enzyme';
import sinon from 'sinon';
import React from 'react';
import _ from 'lodash';

import DateInput from '../../src/inputs/DateInput';

describe('<DateInput />: handleSelect', () => {
  it('call `onChange` when in `day` mode (default)', () => {
    const onChangeFake = sinon.fake();
    const wrapper = mount(<DateInput
      dateFormat="YYYY-MM-DD"
      onChange={onChangeFake} />);

    wrapper.instance().handleSelect('click', { value: { year: 2030, month: 4, date: 3 } });
    const calledWithArgs = onChangeFake.args[0];

    assert(onChangeFake.calledOnce, '`onChange` callback called once');
    assert.equal(calledWithArgs[0], 'click', 'correct first argument');
    assert(_.isString(calledWithArgs[1].value), 'value is string');
    assert.equal(calledWithArgs[1].value, '2030-05-03', 'correct value');
  });

  // TODO: skipped because now mode switches in callback
  it.skip('switch to next mode if not in day mode', () => {
    const onChangeFake = sinon.fake();
    const wrapper = mount(<DateInput
      dateFormat="YYYY-MM-DD"
      startMode="year"
      onChange={onChangeFake} />);

    assert.equal(wrapper.state('mode'), 'year', 'mode not switched yet');
    wrapper.instance().handleSelect('click', { value: { year: 2030 } });
    assert.equal(wrapper.state('mode'), 'month', 'switched to next mode');
  });

  // TODO: skipped because now mode switches in callback
  it.skip('does not switch to next mode if in day mode', () => {
    const onChangeFake = sinon.fake();
    const wrapper = mount(<DateInput
      dateFormat="YYYY-MM-DD"
      startMode="day"
      onChange={onChangeFake} />);

    assert.equal(wrapper.state('mode'), 'day', 'mode not switched yet');
    wrapper.instance().handleSelect('click', { value: { year: 2030 } });
    assert.equal(wrapper.state('mode'), 'day', 'mode still not switched');
  });

  it('does not call `onChange` when not in `day` mode', () => {
    const onChangeFake = sinon.fake();
    const wrapper = mount(<DateInput
      dateFormat="YYYY-MM-DD"
      startMode="year"
      onChange={onChangeFake} />);

    wrapper.instance().handleSelect('click', { value: { year: 2030 } });

    assert.isFalse(onChangeFake.calledOnce, '`onChange` callback is not called');
  });
});

describe('<DateInput />: switchToPrevMode', () => {
  const wrapper = mount(<DateInput />);

  beforeEach(function(done) {
    setTimeout(done);
  }, 0);

  it('not yet switched to previous mode', () => {
    assert.equal(wrapper.state('mode'), 'day', 'mode is not changed yet');
    wrapper.instance().switchToPrevMode();
  });

  it('switched to prev mode', () => {
    assert.equal(wrapper.state('mode'), 'month', 'mode changed to previous');
  }).timeout(0);
});

describe('<DateInput />: switchToNextMode', () => {
  const wrapper = mount(<DateInput />);

  beforeEach(function(done) {
    setTimeout(done);
  }, 0);

  it('not yet switched to next mode', () => {
    assert.equal(wrapper.state('mode'), 'day', 'mode is not changed yet');
    wrapper.instance().switchToNextMode();
  });

  it('switched to next mode', () => {
    assert.equal(wrapper.state('mode'), 'year', 'mode changed to next');
  }).timeout(0);
});

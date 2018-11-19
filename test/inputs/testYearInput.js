import { assert } from 'chai';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {
  mount,
} from 'enzyme';
import sinon from 'sinon';
import React from 'react';
import _ from 'lodash';
import YearInput from '../../src/inputs/YearInput';

Enzyme.configure({ adapter: new Adapter() });

describe('<YearInput />: handleSelect', () => {
  it('call `onChange`', () => {
    const onChangeFake = sinon.fake();
    const wrapper = mount(<YearInput
      onChange={onChangeFake} />);

    wrapper.instance().handleSelect('click', { value: { year: 2030 } });
    const calledWithArgs = onChangeFake.args[0];

    assert(onChangeFake.calledOnce, '`onChange` callback called once');
    assert.equal(calledWithArgs[0], 'click', 'correct first argument');
    assert(_.isString(calledWithArgs[1].value), 'value is string');
    assert.equal(calledWithArgs[1].value, '2030', 'correct value');
  });
});

import setup from '../setup';
import { assert } from 'chai';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {
  mount,
  shallow,
} from 'enzyme';
import sinon from 'sinon';
import React from 'react';
import { Icon } from 'semantic-ui-react';

import Header from '../../src/views/CalendarHeader/Header';

Enzyme.configure({ adapter: new Adapter() });

describe('its ok', function() {
  it('doing well', function() {
    assert.isOk(true);
  });
});

describe('<Header />', () => {
  const onPrevPageBtnClick = sinon.fake();
  it('calls onPrevPageBtnClick', () => {
    const wrapper = mount(
      <Header
        hasPrevPage
        onPrevPageBtnClick={onPrevPageBtnClick} />
    );
    const prevBtn = wrapper.find(Icon).first();
    prevBtn.simulate('click');
    assert(onPrevPageBtnClick.called, 'onPrevPageBtnClick is called');
  });
});

describe('<Header />', () => {
  const onNextPageBtnClick = sinon.fake();
  it('calls onNextPageBtnClick', () => {
    const wrapper = mount(
      <Header
        hasNextPage
        onNextPageBtnClick={onNextPageBtnClick} />
    );
    const nextBtn = wrapper.find(Icon).last();
    nextBtn.simulate('click');
    assert(onNextPageBtnClick.called, 'onNextPageBtnClick is called');
  });
});

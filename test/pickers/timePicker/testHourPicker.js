import { assert } from 'chai';
import {
  mount,
} from 'enzyme';
import * as sinon from 'sinon';
import * as React from 'react';
import * as _ from 'lodash';
import moment from 'moment';

import HourPicker from '../../../src/pickers/timePicker/HourPicker';

describe('<HourPicker />', () => {
  it('initialized with moment', () => {
    const date = moment('2015-05-01');
    const wrapper = mount(<HourPicker initializeWith={date} />);
    assert(
      moment.isMoment(wrapper.state('date')),
      'has moment instance in `date` state field');
    assert(
      wrapper.state('date').isSame(date),
      'initialize `date` state field with moment provided in `initializeWith` prop');
  });
});

describe('<HourPicker />: buildCalendarValues', () => {
  const date = moment('2018-08-12');

  describe('`timeFormat` not provided', () => {
    it('return array of strings', () => {
      const wrapper = mount(<HourPicker initializeWith={date} />);
      const shouldReturn = [
        '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
        '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
        '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
        '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',
      ];
      assert(_.isArray(wrapper.instance().buildCalendarValues()), 'return array');
      assert.equal(wrapper.instance().buildCalendarValues().length, 24, 'return array of length 24');
      wrapper.instance().buildCalendarValues().forEach((hour, i) => {
        assert.equal(hour, shouldReturn[i], 'contains corect hours');
      });
    });
  });

  describe('`timeFormat` is ampm', () => {
    it('return array of strings', () => {
      const wrapper = mount(<HourPicker
        timeFormat="ampm"
        initializeWith={date} />);
      const shouldReturn = [
        '12:00 am', '01:00 am', '02:00 am', '03:00 am', '04:00 am', '05:00 am',
        '06:00 am', '07:00 am', '08:00 am', '09:00 am', '10:00 am', '11:00 am',
        '12:00 pm', '01:00 pm', '02:00 pm', '03:00 pm', '04:00 pm', '05:00 pm',
        '06:00 pm', '07:00 pm', '08:00 pm', '09:00 pm', '10:00 pm', '11:00 pm',
      ];
      assert(_.isArray(wrapper.instance().buildCalendarValues()), 'return array');
      assert.equal(wrapper.instance().buildCalendarValues().length, 24, 'return array of length 24');
      wrapper.instance().buildCalendarValues().forEach((hour, i) => {
        assert.equal(hour, shouldReturn[i], 'contains corect hours');
      });
    });
  });

  describe('`timeFormat` is AMPM', () => {
    it('return array of strings', () => {
      const wrapper = mount(<HourPicker
        timeFormat="AMPM"
        initializeWith={date} />);
      const shouldReturn = [
        '12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM',
        '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
        '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
        '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM',
      ];
      assert(_.isArray(wrapper.instance().buildCalendarValues()), 'return array');
      assert.equal(wrapper.instance().buildCalendarValues().length, 24, 'return array of length 24');
      wrapper.instance().buildCalendarValues().forEach((hour, i) => {
        assert.equal(hour, shouldReturn[i], 'contains corect hours');
      });
    });
  });


});

describe('<HourPicker />: getActiveCellPosition', () => {
  const date = moment('2018-08-12');

  it('return active hour', () => {
    const wrapper = mount(<HourPicker
      value={moment('2018-08-12 15:00')}
      initializeWith={date} />);
    /*
      [
        '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
        '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
        '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
        '18:00', '19:00', '20:00', '21:00', '22:00', '23:00',
      ]
    */
    assert(_.isNumber(wrapper.instance().getActiveCellPosition()), 'return number');
    assert.equal(wrapper.instance().getActiveCellPosition(), 15, 'return active hour position number');
  });
});

describe('<HourPicker />: getDisabledPositions', () => {
  const date = moment('2018-08-12');

  describe('return disabled hour positions based on `disable` prop', () => {
    it('return disabled hour positions position numbers', () => {
      const wrapper = mount(<HourPicker
        disable={[moment('2018-08-12 12:00'), moment('2018-08-12 14:00')]}
        initializeWith={date} />);

      assert(_.isArray(wrapper.instance().getDisabledPositions()), 'return array of numbers');
      assert.equal(wrapper.instance().getDisabledPositions().length, 2, 'return array of length 2');
      wrapper.instance().getDisabledPositions().forEach((hour) => {
        assert(_.isNumber(hour), 'contains numbers');
      });
      assert(_.includes(wrapper.instance().getDisabledPositions(), 12), 'contains correct hour positions');
      assert(_.includes(wrapper.instance().getDisabledPositions(), 14), 'contains correct hour positions');
    });
  });

  describe('return disabled hour positions based on `maxDate` prop', () => {
    it('return disabled hour positions position numbers', () => {
      const wrapper = mount(<HourPicker
        maxDate={moment('2018-08-12 15:00')}
        initializeWith={date} />);
      const shouldReturn = [
        16, 17, 18, 19, 20, 21, 22, 23,
      ]; //disabled hours position numbers
      assert(_.isArray(wrapper.instance().getDisabledPositions()), 'return array of numbers');
      assert.equal(wrapper.instance().getDisabledPositions().length, 8, 'return array of length 8');
      wrapper.instance().getDisabledPositions().forEach((hourPos) => {
        assert(_.isNumber(hourPos), 'contains numbers');
      });
      const producedHourPositions = wrapper.instance().getDisabledPositions();
      shouldReturn.forEach((expectedPosition) => {
        assert(_.includes(producedHourPositions, expectedPosition), 'contains correct posiotion numbers');
      });
    });
  });

  describe('return disabled hour positions based on `minDate` prop', () => {
    it('return disabled hour positions position numbers', () => {
      const wrapper = mount(<HourPicker
        minDate={moment('2018-08-12 03:00')}
        initializeWith={date} />);

      const shouldReturn = [
        0, 1, 2,
      ]; //disabled hours position numbers
      assert(_.isArray(wrapper.instance().getDisabledPositions()), 'return array of numbers');
      assert.equal(wrapper.instance().getDisabledPositions().length, 3, 'return array of length 3');
      wrapper.instance().getDisabledPositions().forEach((hourPos) => {
        assert(_.isNumber(hourPos), 'contains numbers');
      });
      const producedHourPositions = wrapper.instance().getDisabledPositions();
      shouldReturn.forEach((expectedHourPos) => {
        assert(_.includes(producedHourPositions, expectedHourPos), 'contains correct posiotion numbers');
      });
    });
  });

  describe('return disabled hour positions based on `minDate`, `maxDate`, `disable` props', () => {
    it('return disabled hour positions position numbers', () => {
      const wrapper = mount(<HourPicker
        minDate={moment('2018-08-12 03:00')}
        maxDate={moment('2018-08-12 19:00')}
        disable={[moment('2018-08-12 12:00'), moment('2018-08-12 14:00')]}
        initializeWith={date} />);
      const shouldReturn = [
        0, 1, 2,
        12, 14,
        20, 21, 22, 23,
      ]; //disabled hours position numbers
      assert(_.isArray(wrapper.instance().getDisabledPositions()), 'return array of numbers');
      assert.equal(wrapper.instance().getDisabledPositions().length, 9, 'return array of length 9');
      wrapper.instance().getDisabledPositions().forEach((hourPos) => {
        assert(_.isNumber(hourPos), 'contains numbers');
      });
      const producedHourPositions = wrapper.instance().getDisabledPositions();
      shouldReturn.forEach((expectedHourPos) => {
        assert(_.includes(producedHourPositions, expectedHourPos), 'contains correct posiotion numbers');
      });
    });
  });

  describe('return disabled hour positions when none of `minDate`, `maxDate`, `disable` props provided', () => {
    it('return disabled hour positions position numbers', () => {
      const wrapper = mount(<HourPicker
        initializeWith={date} />);

      assert(_.isUndefined(wrapper.instance().getDisabledPositions()), 'return undefined');
    });
  });
});

describe('<HourPicker />: isNextPageAvailable', () => {
  const date = moment('2018-08-12');

  describe('is not available by maxDate', () => {
    it('return false', () => {
      const wrapper = mount(<HourPicker
        maxDate={moment('2018-08-12')}
        initializeWith={date} />);

      assert(_.isBoolean(wrapper.instance().isNextPageAvailable()), 'return boolean');
      assert.isFalse(wrapper.instance().isNextPageAvailable(), 'return false');
    });
  });

  describe('available by maxDate', () => {
    it('return true', () => {
      const wrapper = mount(<HourPicker
        maxDate={moment('2018-08-13')}
        initializeWith={date} />);

      assert(_.isBoolean(wrapper.instance().isNextPageAvailable()), 'return boolean');
      assert.isTrue(wrapper.instance().isNextPageAvailable(), 'return true');
    });
  });
});

describe('<HourPicker />: isPrevPageAvailable', () => {
  const date = moment('2018-08-12');

  describe('is not available by minDate', () => {
    it('return false', () => {
      const wrapper = mount(<HourPicker
        minDate={moment('2018-08-12')}
        initializeWith={date} />);

      assert(_.isBoolean(wrapper.instance().isPrevPageAvailable()), 'return boolean');
      assert.isFalse(wrapper.instance().isPrevPageAvailable(), 'return false');
    });
  });

  describe('available by minDate', () => {
    it('return true', () => {
      const wrapper = mount(<HourPicker
        minDate={moment('2018-07-11')}
        initializeWith={date} />);

      assert(_.isBoolean(wrapper.instance().isPrevPageAvailable()), 'return boolean');
      assert.isTrue(wrapper.instance().isPrevPageAvailable(), 'return true');
    });
  });
});

describe('<HourPicker />: getCurrentDate', () => {
  const date = moment('2018-08-12');

  it('return string in format `MMMM DD, YYYY`', () => {
    const wrapper = mount(<HourPicker
      initializeWith={date} />);

    assert(_.isString(wrapper.instance().getCurrentDate()), 'return string');
    assert.equal(wrapper.instance().getCurrentDate(), date.format('MMMM DD, YYYY'), 'return proper value');
  });
});

describe('<HourPicker />: handleChange', () => {
  const date = moment('2018-08-12');

  it('call onChangeFake with { year: number, month: number, date: number, hour: number }', () => {
    const onChangeFake = sinon.fake();
    const wrapper = mount(<HourPicker
      onChange={onChangeFake}
      initializeWith={date} />);
    const possibleValues = wrapper.instance().buildCalendarValues();
    wrapper.instance().handleChange('click', { value: possibleValues[15]});
    const calledWithArgs = onChangeFake.args[0];

    assert(onChangeFake.calledOnce, 'onChangeFake called once');
    assert.equal(calledWithArgs[0], 'click', 'correct first argument');
    assert.equal(calledWithArgs[1].value.year, 2018, 'correct year');
    assert.equal(calledWithArgs[1].value.month, 7, 'correct month');
    assert.equal(calledWithArgs[1].value.date, 12, 'correct date');
    assert.equal(calledWithArgs[1].value.hour, 15, 'correct hour');
  });
});

describe('<HourPicker />: switchToNextPage', () => {
  const date = moment('2018-08-12');

  it('shift `date` state field one day forward', () => {
    const wrapper = mount(<HourPicker
      initializeWith={date} />);

    assert.equal(wrapper.state('date').date(), 12, 'date not changed yet');
    wrapper.instance().switchToNextPage();
    assert.equal(wrapper.state('date').date(), 12 + 1, 'date shifted one day forward');
  });
});

describe('<HourPicker />: switchToPrevPage', () => {
  const date = moment('2018-08-12');

  it('shift `date` state field one day backward', () => {
    const wrapper = mount(<HourPicker
      initializeWith={date} />);

    assert.equal(wrapper.state('date').date(), 12, 'date not changed yet');
    wrapper.instance().switchToPrevPage();
    assert.equal(wrapper.state('date').date(), 12 - 1, 'date shifted one day backward');
  });
});

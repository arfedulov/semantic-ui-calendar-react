import { assert } from 'chai';
import {
  mount,
} from 'enzyme';
import * as React from 'react';

import {
    Table,
} from 'semantic-ui-react';

import Calendar from '../../src/views/Calendar';
import { findHTMLElement } from '../../src/lib';

describe('<Calendar />', () => {
    describe('We can pass ``ref`` to Calendar (<Calendar ref = { func } />)', () => {
        it('findHTMLElement(calendarRef) returns Calendar\'s DOM node', () => {
            const calendarProps = {
                outlineOnFocus: false,
            };
            let calendarNode;

            mount(
                <Calendar ref={ (e) => calendarNode = e } { ...calendarProps }>
                    <div id='calendarChildren' />
                </Calendar>
            );

            const calendar = findHTMLElement(calendarNode);
            const calendarInnerHtml = calendar && calendar.innerHTML;

            assert.equal(calendarInnerHtml, '<div id="calendarChildren"></div>');
        });
    });

    describe('``outlineOnFocus`` used for preventing calendar be outlined when in focus', () => {
        it('calendar\'s html has style attribute with ``outline: none`` when ``outlineOnFocus`` === false', () => {
            const calendarProps = {
                outlineOnFocus: false,
            };

            const wrapper = mount(
                <Calendar { ...calendarProps }>
                    <div id='calendarChildren' />
                </Calendar>
            );

            const hasOutlineNone = wrapper.find(Table).html().indexOf('outline: none') >= 0;

            assert(hasOutlineNone, 'set outline="none" manually therefore prevent browser outlining element on focus');
        });

        it('calendar\'s html does not contain outline when ``outlineOnFocus`` === true', () => {
            const calendarProps = {
                outlineOnFocus: true,
            };

            const wrapper = mount(
                <Calendar { ...calendarProps }>
                    <div id='calendarChildren' />
                </Calendar>
            );

            const doesntHaveOutline = wrapper.find(Table).html().indexOf('outline') === -1;

            assert(doesntHaveOutline, 'do not set outline manually therefore allow browser outline element on focus');
        });
    });
});

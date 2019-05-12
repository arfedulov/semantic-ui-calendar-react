import { assert } from 'chai';
import {
  shallow,
  mount,
} from 'enzyme';
import * as sinon from 'sinon';
import * as React from 'react';
import {
  Table,
} from 'semantic-ui-react';
import * as _ from 'lodash';

import Body from '../../src/views/CalendarBody/Body';
import Cell from '../../src/views/CalendarBody/Cell';

describe('<Body>', () => {
    describe('minimal config', () => {

        it('contains expected content (has heigh 6 width 7)', () => {
            const w = 7;
            const h = 6;

            const bodyProps = {
                width: w,
                data: _.fill(new Array(h * w), 'cell content'),
                onCellClick: () => {},
                onCellHover: () => {},
            };
            const wrapper = shallow(<Body { ...bodyProps } />);

            assert.equal(wrapper.find(Table.Body).getElements().length, 1, 'consists of one body');
            assert.equal(wrapper.find(Table.Body).find(Table.Row).getElements().length, h, `consists of ${h} rows`);
            wrapper.find(Table.Body).find(Table.Row).forEach((row) => {
                assert.equal(row.find(Cell).getElements().length, w, `each row contains ${w} cells`);
            });
        });

        it('has height 6 width 4', () => {
            const w = 4;
            const h = 6;

            const bodyProps = {
                width: w,
                data: _.fill(new Array(h * w), 'cell content'),
                onCellClick: () => {},
                onCellHover: () => {},
            };
            const wrapper = shallow(<Body { ...bodyProps } />);

            assert.equal(wrapper.find(Table.Body).getElements().length, 1, 'consists of one body');
            assert.equal(wrapper.find(Table.Body).find(Table.Row).getElements().length, h, `consists of ${h} rows`);
            wrapper.find(Table.Body).find(Table.Row).forEach((row) => {
                assert.equal(row.find(Cell).getElements().length, w, `each row contains ${w} cells`);
            });
        });

        it('has height 4 width 3', () => {
            const w = 3;
            const h = 4;

            const bodyProps = {
                width: w,
                data: _.fill(new Array(h * w), 'cell content'),
                onCellClick: () => {},
                onCellHover: () => {},
            };
            const wrapper = shallow(<Body { ...bodyProps } />);

            assert.equal(wrapper.find(Table.Body).getElements().length, 1, 'consists of one body');
            assert.equal(wrapper.find(Table.Body).find(Table.Row).getElements().length, h, `consists of ${h} rows`);
            wrapper.find(Table.Body).find(Table.Row).forEach((row) => {
                assert.equal(row.find(Cell).getElements().length, w, `each row contains ${w} cells`);
            });
        });

        it('invokes onCellClick callback with expected args after clicking on cell', () => {
            const onCellClickCallback = sinon.fake();
            const data = _.range(0, 6 * 7).map((el) => `cell ${el}`);

            const bodyProps = {
                width: 7,
                data,
                onCellClick: onCellClickCallback,
                onCellHover: () => {},
            };
            const wrapper = mount(<Body { ...bodyProps } />);
            wrapper.find(Cell).at(6).simulate('click');
            assert.isTrue(onCellClickCallback.calledOnce, 'onClick callback called once');

            assert.equal(onCellClickCallback.lastCall.args[1].itemPosition, 6, 'clicked 6th cell');
            assert.equal(onCellClickCallback.lastCall.args[1].value, 'cell 6', 'contains 6th cell\'s content');
        });

        it('invokes onCellHover callback with expected args', () => {
            const onHoverCallback = sinon.fake();
            const data = _.range(0, 6 * 7).map((el) => `cell ${el}`);

            const bodyProps = {
                width: 7,
                data,
                onCellClick: () => {},
                onCellHover: onHoverCallback,
            };
            const wrapper = mount(<Body { ...bodyProps } />);
            wrapper.find(Cell).at(6).simulate('mouseover');
            assert.isTrue(onHoverCallback.calledOnce, 'onClick callback called once');

            assert.equal(onHoverCallback.lastCall.args[1].itemPosition, 6, 'clicked 6th cell');
        });
    });
});

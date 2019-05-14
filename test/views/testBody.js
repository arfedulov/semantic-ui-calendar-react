import { assert } from 'chai';
import {
  shallow,
  mount,
} from 'enzyme';
import * as sinon from 'sinon';
import * as React from 'react';
import {
  Table,
  Label,
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

    describe('<Body ... hovered = { n } />', () => {
        const outlineRegEx = /style=".*outline/;
        it('only n-th cell has ``outline`` in its ``style`` attribute', () => {
            const n = 12;
            const width = 7;
            const height = 6;

            const bodyProps = {
                width: width,
                data: _.fill(new Array(height * width), 'cell content'),
                onCellClick: () => {},
                onCellHover: () => {},
                hovered: n,
            };
            const wrapper = shallow(<Body { ...bodyProps } />);

            wrapper.find(Table.Body).find(Table.Row).forEach((row, rowIndex) => {
                row.find(Cell).forEach((cell, cellIndex) => {
                    const match = ( rowIndex * width + cellIndex ) === n;
                    if (match) {
                        assert(
                            cell.html().search(outlineRegEx),
                            `${n}-th cell has "outline" in its "style" attribute`,
                        );
                    } else {
                        assert(
                            cell.html().search(outlineRegEx) === -1,
                            `other cells dont have "outline" in its "style" attribute`,
                        );
                    }
                });
            });
        });
    });

    describe('<Body ... active = { n } />', () => {
        it('only n-th cell has "active" prop', () => {
            const n = 12;
            const width = 7;
            const height = 6;

            const bodyProps = {
                width: width,
                data: _.fill(new Array(height * width), 'cell content'),
                onCellClick: () => {},
                onCellHover: () => {},
                active: n,
            };
            const wrapper = shallow(<Body { ...bodyProps } />);

            wrapper.find(Table.Body).find(Table.Row).forEach((row, rowIndex) => {
                row.find(Cell).forEach((cell, cellIndex) => {
                    const match = ( rowIndex * width + cellIndex ) === n;
                    if (match) {
                        assert(
                            cell.prop('active'),
                            `${n}-th cell has "active" prop`,
                        );
                    } else {
                        assert.isFalse(
                            cell.prop('active'),
                            `other cells dont have "active" prop`,
                        );
                    }
                });
            });
        });
    });

    describe('<Body ... active = { [ ...numbers ] } />', () => {
        it('only cells with provided indexes has "active" prop', () => {
            const numbers = [ 2, 5, 14, 15, 16 ];
            const width = 7;
            const height = 6;

            const bodyProps = {
                width: width,
                data: _.fill(new Array(height * width), 'cell content'),
                onCellClick: () => {},
                onCellHover: () => {},
                active: numbers,
            };
            const wrapper = shallow(<Body { ...bodyProps } />);

            wrapper.find(Table.Body).find(Table.Row).forEach((row, rowIndex) => {
                row.find(Cell).forEach((cell, cellIndex) => {
                    const match = numbers.indexOf( rowIndex * width + cellIndex ) >= 0;
                    if (match) {
                        assert(
                            cell.prop('active'),
                            `${ rowIndex * width + cellIndex }-th cell has "active" prop`,
                        );
                    } else {
                        assert.isFalse(
                            cell.prop('active'),
                            `other cells dont have "active" prop`,
                        );
                    }
                });
            });
        });
    });

    describe('<Body ... disabled = { [ ...numbers ] } />', () => {
        it('only cells with provided indexes has "disabled" prop', () => {
            const numbers = [ 0, 1, 2, 3, 10, 15 ];
            const width = 7;
            const height = 6;

            const bodyProps = {
                width: width,
                data: _.fill(new Array(height * width), 'cell content'),
                onCellClick: () => {},
                onCellHover: () => {},
                disabled: numbers,
            };
            const wrapper = shallow(<Body { ...bodyProps } />);

            wrapper.find(Table.Body).find(Table.Row).forEach((row, rowIndex) => {
                row.find(Cell).forEach((cell, cellIndex) => {
                    const match = numbers.indexOf( rowIndex * width + cellIndex ) >= 0;
                    if (match) {
                        assert(
                            cell.prop('disabled'),
                            `${ rowIndex * width + cellIndex }-th cell has "disabled" prop`,
                        );
                    } else {
                        assert.isFalse(
                            cell.prop('disabled'),
                            `other cells dont have "disabled" prop`,
                        );
                    }
                });
            });
        });
    });

    describe('<Body ... marked = { [ ...numbers ] } markColor = { string } />', () => {
        it('only cells with provided indexes has element with "label" class inside', () => {
            const labelRegEx = /class=".*label/;

            const numbers = [ 9, 12, 14 ];
            const width = 7;
            const height = 6;

            const bodyProps = {
                width: width,
                data: _.fill(new Array(height * width), 'cell content'),
                onCellClick: () => {},
                onCellHover: () => {},
                marked: numbers,
            };
            const wrapper = shallow(<Body { ...bodyProps } />);

            wrapper.find(Table.Body).find(Table.Row).forEach((row, rowIndex) => {
                row.find(Cell).forEach((cell, cellIndex) => {
                    const match = numbers.indexOf( rowIndex * width + cellIndex ) >= 0;
                    if (match) {
                        assert(
                            cell.html().search(labelRegEx),
                            `${ rowIndex * width + cellIndex }-th cell has node with "label" class inside`,
                        );
                    } else {
                        assert(
                            cell.html().search(labelRegEx) === -1,
                            `other cells dont have node with "label" class inside`,
                        );
                    }
                });
            });
        });

        it('each node with "label" class has also "green" class', () => {
            const labelRegEx = /class=".*label/;
            const colorRegEx = /class=".*green/;

            const numbers = [ 9, 12, 14 ];
            const width = 7;
            const height = 6;
            const color = 'green';

            const bodyProps = {
                width: width,
                data: _.fill(new Array(height * width), 'cell content'),
                onCellClick: () => {},
                onCellHover: () => {},
                marked: numbers,
                markColor: color,
            };
            const wrapper = shallow(<Body { ...bodyProps } />);

            wrapper.find(Table.Body).find(Table.Row).forEach((row, rowIndex) => {
                row.find(Cell).forEach((cell, cellIndex) => {
                    const match = numbers.indexOf( rowIndex * width + cellIndex ) >= 0;
                    if (match) {
                        assert(
                            cell.html().search(labelRegEx) && cell.html().search(colorRegEx),
                            `${ rowIndex * width + cellIndex }-th cell has node with "${ color }" class inside`,
                        );
                    } else {
                        assert(
                            (cell.html().search(labelRegEx) === -1) && (cell.html().search(colorRegEx) === -1),
                            `other cells dont have node with "${ color }" class inside`,
                        );
                    }
                });
            });
        });
    });
});

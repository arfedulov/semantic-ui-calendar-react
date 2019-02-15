import { JSDOM } from 'jsdom';
import * as moment from 'moment';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

moment.locale('en');

const { window } = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'https://example.com',
});

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .reduce((result, prop) => ({
      ...result,
      [prop]: Object.getOwnPropertyDescriptor(src, prop),
    }), {});
  Object.defineProperties(target, props);
}

global.window = window;
global.document = window.document;
copyProps(window, global);

import React from 'react';
import ReactDOM from 'react-dom';
import { Calendar } from '../src';
import moment from 'moment';

moment.locale('en');

function App(props) {
  return (
    <div className="tmp-calendar-container">
      <Calendar />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
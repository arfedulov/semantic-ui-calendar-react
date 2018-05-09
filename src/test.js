import React from 'react';
import ReactDOM from 'react-dom';
import { CalendarContainer } from './components';
import moment from 'moment';

moment.locale('en');

function App(props) {
  return (
    <div className="tmp-calendar-container">
      <CalendarContainer />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
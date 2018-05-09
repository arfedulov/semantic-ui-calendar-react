import React from 'react';
import ReactDOM from 'react-dom';
import { Calendar } from './components/Calendar.js';
import moment from 'moment';

moment.locale('ru');

function App(props) {
  return (
    <div className="tmp-calendar-container">
      <Calendar
        onDateClick={(date) => console.log(date)}
        onNextBtnClick={() => console.log('next btn clicked')}
        onPrevBtnClick={() => console.log('prev btn clicked')}
        activeDate={moment()} />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
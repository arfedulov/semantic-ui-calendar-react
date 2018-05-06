import React from 'react';
import ReactDOM from 'react-dom';
import { css, StyleSheet } from 'aphrodite';
import { Calendar } from './components/Calendar.js';
import { getArrayOfWeeks } from './utils.js';
import moment from 'moment';

moment.locale('ru');

const tmpData = getArrayOfWeeks();

const styles = StyleSheet.create({
  container: {
    padding: '100px'
  }
});

function App(props) {
  return (
    <div className={css(styles.container)}>
      <Calendar data={tmpData} />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
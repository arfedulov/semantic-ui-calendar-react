import React from 'react';
import { Table } from 'semantic-ui-react';
import moment from 'moment';

/** Return array of week day names.
 * 
 * getWeekDays() --> ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Su']
 */
const getWeekDays = (long = false) => {
  const weekDays = [];
  let day = moment().startOf('week');
  for (let i = 0; i < 7; i++) {
    weekDays[i] = day.format(long? 'dddd' : 'dd');
    day.add(1, 'd');
  }
  return weekDays;
};

const cellStyle = { 
  border: 'none',
  borderBottom: '1px solid rgba(34,36,38,.1)'
};

const weekDayCells = getWeekDays().map((weekDay) => (
  <Table.HeaderCell
    key={weekDay}
    style={cellStyle}
    colSpan="1">
    {weekDay}
  </Table.HeaderCell>
));

function HeaderWeeks() {
  return (
    <Table.Row>
      { weekDayCells }
    </Table.Row>
  );
}

export default HeaderWeeks;

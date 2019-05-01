import moment from 'moment';
import * as React from 'react';
import { Table } from 'semantic-ui-react';

/** Return array of week day names.
 *
 * getWeekDays() --> ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Su']
 */
const getWeekDays = (m, localization) => {
  const weekDays = [];
  const day = localization ? m().locale(localization).startOf('week') : m().startOf('week');
  for (let i = 0; i < 7; i++) {
    weekDays[i] = day.format('dd');
    day.add(1, 'd');
  }

  return weekDays;
};

const cellStyle = {
  border: 'none',
  borderBottom: '1px solid rgba(34,36,38,.1)',
};

const getWeekDayCells = (m, localization) => getWeekDays(m, localization).map((weekDay) => (
  <Table.HeaderCell
    key={weekDay}
    style={cellStyle}
    colSpan='1'>
    {weekDay}
  </Table.HeaderCell>
));

export interface HeaderWeeksProps {
  /** Moment date localization */
  localization?: string;
}

function HeaderWeeks(props: HeaderWeeksProps) {
  const {
    localization,
  } = props;

  return (
    <Table.Row>
      { getWeekDayCells(moment, localization) }
    </Table.Row>
  );
}

export default HeaderWeeks;

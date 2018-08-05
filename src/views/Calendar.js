import React from 'react';
import { Table } from 'semantic-ui-react';

import { Header } from './CalendarHeader/Header';
import { Body } from './CalendarBody/Body';

function Calendar(props) {
  return (
    <Table
      unstackable
      celled
      textAlign="center">
      <Header />
      <Body />
    </Table>
  );
}

export default Calendar;

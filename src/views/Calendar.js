import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';

function Calendar(props) {
  return (
    <Table
      unstackable
      celled
      textAlign="center">
      { props.children }
    </Table>
  );
}

Calendar.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Calendar;

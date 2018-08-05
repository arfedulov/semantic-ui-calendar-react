import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const cellStyle = {
  border: 'none',
};

function HeaderRange(props) {
  const {
    content,
  } = props;
  return (
    <Table.Row>
      <Table.HeaderCell style={cellStyle} colSpan="7">
        { content }
      </Table.HeaderCell>
    </Table.Row>
  );
}

HeaderRange.propTypes = {
  /** Selected dates range. */
  content: PropTypes.string.isRequired
};

export default HeaderRange;

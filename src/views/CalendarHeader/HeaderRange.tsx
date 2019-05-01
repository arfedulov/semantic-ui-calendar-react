import * as React from 'react';
import { Table } from 'semantic-ui-react';

const cellStyle = {
  border: 'none',
};

interface HeaderRangeProps {
  /** Selected dates range. */
  content: string;
}

function HeaderRange(props: HeaderRangeProps) {
  const {
    content,
  } = props;

  return (
    <Table.Row>
      <Table.HeaderCell style={cellStyle} colSpan='7'>
        { content }
      </Table.HeaderCell>
    </Table.Row>
  );
}

export default HeaderRange;

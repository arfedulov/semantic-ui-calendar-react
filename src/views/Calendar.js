import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class Calendar extends React.Component {
  render() {
    const {
      children,
      ...rest
    } = this.props;
    return (
      <Table
        unstackable
        celled
        {...rest}
        textAlign="center">
        { children }
      </Table>
    );
  }
}

Calendar.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Calendar;

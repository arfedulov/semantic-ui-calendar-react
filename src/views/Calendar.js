import * as React from 'react';
import { Table } from 'semantic-ui-react';
import * as PropTypes from 'prop-types';

class Calendar extends React.Component {
  render() {
    const {
      children,
      inline,
      ...rest
    } = this.props;
    const style = {
      // Prevent poped up picker from beeing outlined on focus.
      // Inline picker should be outlined when in focus.
      outline: inline ? undefined : 'none',
    };
    return (
      <Table
        style={style}
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

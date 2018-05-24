import React from 'react';
import { MonthPickerComponent } from '../components';
import { Table } from 'semantic-ui-react';
import { getUnhandledProps, emptyFunction } from '../utils.js';
import PropTypes from 'prop-types';

class MonthPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeMonth: ''
    };
  }

  onMonthClick = (event, data) => {
    this.setState({ activeMonth: data.value });
    this.props.onMonthChange(event, data);
  }

  render() {
    const rest = getUnhandledProps(MonthPicker, this.props);

    return (
      <Table
        { ...rest }
        unstackable
        celled
        textAlign="center">
        <MonthPickerComponent
          onMonthClick={this.onMonthClick}
          activeMonth={this.state.activeMonth} />
      </Table>
    );
  }
}

MonthPicker.propTypes = {
  /** (event, data) => {} */
  onMonthChange: PropTypes.func
};

MonthPicker.defaultProps = {
  onMonthChange: emptyFunction
};

export default MonthPicker;
export {
  MonthPicker
};
import React from 'react';
import { Table } from 'semantic-ui-react';
import { TimePickerComponent } from '../components';
import { getUnhandledProps, emptyFunction, cloneReplaceValue } from '../utils.js';
import PropTypes from 'prop-types';

class TimePicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeHour: '',
      activeMinute: ''
    };
  }

  onHourClick = (event, data) => {
    this.setState(prevState => {
      const newData = cloneReplaceValue(data, this.getTime({
        hour: data.value,
        minute: ''
      }));
      this.props.onTimeChange(event, newData);
      return {
        activeHour: data.value
      };
    });
  }

  getTime = ({hour = '', minute = ''}) => {
    return `${hour}:${minute}`;
  }

  onMinuteClick = (event, data) => {
    this.setState(prevState => {
      const newData = cloneReplaceValue(data, this.getTime({
        hour: prevState.activeHour,
        minute: data.value
      }));
      this.props.onTimeChange(event, newData);
      return {
        activeMinute: data.value
      };
    });
  }

  render() {
    const rest = getUnhandledProps(TimePicker, this.props);
    return (
      <Table
        { ...rest }
        unstackable
        celled
        textAlign="center">
        <TimePickerComponent
          activeHour={this.state.activeHour}
          activeMinute={this.state.activeMinute}
          onHourClick={this.onHourClick}
          onMinuteClick={this.onMinuteClick} />
      </Table>
    );
  }
}

TimePicker.propTypes = {
  /** (event, data) => {} */
  onTimeChange: PropTypes.func
};

TimePicker.defaultProps = {
  onTimeChange: emptyFunction
};

export default TimePicker;
export {
  TimePicker
};
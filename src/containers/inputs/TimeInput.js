import React from 'react';
import { Table, Input } from 'semantic-ui-react';
import { CustomPopup as Popup } from '../';
import PropTypes from 'prop-types';
import { getUnhandledProps, tick } from '../../lib';
import {
  TIME_INPUT
} from '../../lib/COMPONENT_TYPES.js';
import { TimePickerComponent } from '../../components';
import _ from 'lodash';
import moment from 'moment';

const parseTime = (value, outFormat = 'HH:mm') => {
  if (value) return moment(value, 'HH:mm').format(outFormat);
  return '00';
};

class TimeInput extends React.Component {
  static META = {
    type: TIME_INPUT,
    name: 'TimeInput'
  };

  constructor(props) {
    super(props);

    this.state = {
      mode: 'hour'
    };
  }

  onPopupClose = () => {
    this.setState({ mode: 'hour' });
  }

  onTimeUpdate = (event, data) => {
    _.invoke(this.props, 'onChange', event, { ...this.props, value: data.value });
  };

  onHourClick = (event, data) => {
    tick(() => {
      const newValue = parseTime(data.value);

      this.setState(() => {
        this.onTimeUpdate(event, { value: newValue });
        return {
          mode: 'minute'
        };
      });
    });
  }

  onMinuteClick = (event, data) => {
    const newValue = `${parseTime(this.props.value, 'HH')}:${data.value}`;
    this.setState(() => {
      this.onTimeUpdate(event, { value: newValue });
      return {
        mode: 'minute'
      };
    });
  }

  getPicker() {
    const [activeHour, activeMinute] = [parseTime(this.props.value, 'HH'), parseTime(this.props.value, 'mm')];
    const rest = getUnhandledProps(TimeInput, this.props);
    return (
      <Table
        { ...rest }
        unstackable
        celled
        textAlign="center">
        <TimePickerComponent
          mode={this.state.mode}
          activeHour={activeHour}
          activeMinute={activeMinute}
          onHourClick={this.onHourClick}
          onMinuteClick={this.onMinuteClick} />
      </Table>
    );
  }

  render() {
    const {
      onChange,
      icon,
      popupPosition,
      inline,
      value
    } = this.props;
    const rest = getUnhandledProps(TimeInput, this.props);
  
    const inputElement = (
      <Input
        { ...rest }
        value={value}
        icon={icon}
        onChange={onChange} />
    );
    if (inline) {
      return this.getPicker();
    }
    return (
      <Popup
        onClose={this.onPopupClose}
        position={popupPosition}
        trigger={inputElement}>
        { this.getPicker() }
      </Popup>
    );
  }
}

TimeInput.propTypes = {
  /** Called on change.
   * @param {SyntheticEvent} event React's original SyntheticEvent.
   * @param {object} data All props and proposed value.
  */
  onChange: PropTypes.func,
  /** Same as semantic-ui-react Input's ``icon`` prop. */
  icon: PropTypes.any,
  popupPosition: PropTypes.oneOf([
    'top left',
    'top right',
    'bottom left',
    'bottom right',
    'right center',
    'left center',
    'top center',
    'bottom center'
  ]),
  inline: PropTypes.bool
};

TimeInput.defaultProps = {
  icon: 'time',
  inline: false
};

export default TimeInput;
export {
  TimeInput
};
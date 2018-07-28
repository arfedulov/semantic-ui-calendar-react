import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';
import { Table } from 'semantic-ui-react';

import {
  CustomPopup as Popup,
  CustomInput as Input,
} from '..';
import { tick, getUnhandledProps } from '../../lib';
import {
  TIME_INPUT
} from '../../lib/COMPONENT_TYPES';
import { TimePickerComponent } from '../../components';
import { CustomPropTypes } from '../../lib/customPropTypes';


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

  componentDidMount() {
    this.inputNode = ReactDOM.findDOMNode(this).querySelector('input');
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
    // close popup if closable
    if (this.props.closable) this.inputNode.click();
  }

  getPicker() {
    const [activeHour, activeMinute] = [parseTime(this.props.value, 'HH'), parseTime(this.props.value, 'mm')];
    return (
      <TimePickerComponent
        mode={this.state.mode}
        activeHour={activeHour}
        activeMinute={activeMinute}
        onHourClick={this.onHourClick}
        onMinuteClick={this.onMinuteClick} />
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
  popupPosition: CustomPropTypes.popupPosition,
  inline: PropTypes.bool,
  value: PropTypes.string,
  /* If true, popup closes after selecting a date/time */
  closable: PropTypes.bool
};

TimeInput.defaultProps = {
  icon: 'time',
  inline: false,
  value: '',
  closable: false
};

export default TimeInput;
export {
  TimeInput
};
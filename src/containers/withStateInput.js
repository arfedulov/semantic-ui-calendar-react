import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import _ from 'lodash';

import {
  monthIndex,
  tick,
  getUnhandledProps
} from '../lib';
import {
  DATE_TIME_INPUT
} from '../lib/COMPONENT_TYPES';
import { EVENTS, dispatchDateChange } from '../lib/events';

const getPrevMode = (mode, lastMode) => {
  if (mode === 'minute') return 'hour';
  if (mode === 'hour') return 'day';
  if (mode === 'day') return 'month';
  if (mode === 'month') return 'year';
  return lastMode;
};

const getNextMode = (mode, lastMode) => {
  if (mode === lastMode) return lastMode;
  if (mode === 'year') return 'month';
  if (mode === 'month') return 'day';
  if (mode === 'day') return 'hour';
  if (mode === 'hour') return 'minute';
  return lastMode;
};

const getTime = ({hour = '00', minute = '00'}) => {
  return `${hour}:${minute}`;
};

const parseDate = (value, format) => {
  const date = moment(value, format);
  return date.isValid()? date : moment();
};

function withStateInput(WrappedComponent) {
  return class WithStateInput extends React.PureComponent {

    static get name() {
      const wrappedComponentName = WrappedComponent.META && WrappedComponent.META.name;
      return wrappedComponentName? wrappedComponentName : 'WithStateInput';
    }

    static propTypes = {
      /** Called on change.
       * @param {SyntheticEvent} event React's original SyntheticEvent.
       * @param {object} data All props and proposed value.
      */
      onChange: PropTypes.func,
      /* Initial display mode for ``DatePicker`` and ``DateTimePicker``. */
      startMode: PropTypes.oneOf(['year', 'month', 'day']),
      /* Selected value. */
      value: PropTypes.string,
      /** Date formatting string.
       * Anything that that can be passed to ``moment().format``.
       */
      dateFormat: PropTypes.string,
      /* Characters that separate date and time values. */
      divider: PropTypes.string
    }

    static defaultProps = {
      startMode: 'day',
      dateFormat: 'DD-MM-YYYY',
      divider: ' '
    }

    constructor(props) {
      super(props);
  
      const {
        value,
        dateFormat,
        startMode
      } = props;
      const initialDate = value? moment(value, dateFormat) : moment().startOf('month');
      this.state = {
        dateToShow: initialDate, // moment
        month: '', // str
        year: '', // str
        activeHour: '', // str
        activeMinute: '', // str
        mode: startMode, // str
        datesRange: { start: null, end: null } // { start: moment, end: moment }
      };
    }

    componentDidMount() {
      window.addEventListener(EVENTS.DATE_CHANGE, this.updateDateToShow);
    }

    componentWillUnmount() {
      window.removeEventListener(EVENTS.DATE_CHANGE, this.updateDateToShow);
    }

    updateDateToShow = () => {
      if (this.props.value) {
        this.setState({ dateToShow: parseDate(this.props.value, this.props.dateFormat) });
      }
    }
    
    setDatesRange = (event, data) => {
      const { onDatesRangeChange } = this;
      this.setState(({ datesRange }) => {
        let newState;
        // reset dates range if it's already selected
        if (datesRange.start && datesRange.end) {
          newState = {
            datesRange: { start: null, end: null }
          };
          onDatesRangeChange(event, { ...this.props, value: this.getDatesRange() });
        } else if (datesRange.start && datesRange.start.isAfter(data.value)) {
          // reset dates range on invalid input
          newState = {
            datesRange: { start: null, end: null }
          };
          onDatesRangeChange(event, { ...this.props, value: this.getDatesRange() });
        } else if (datesRange.start) {
          // set dates range end
          newState = {
            datesRange: { start: datesRange.start, end: data.value }
          };
          const newRange = this.getDatesRange({
            start: datesRange.start,
            end: data.value
          });
          onDatesRangeChange(event, { ...this.props, value: newRange });
        } else {
          // set dates range start
          newState = {
            datesRange: { start: data.value, end: datesRange.end }
          };
          const newRange = this.getDatesRange({
            start: data.value,
            end: datesRange.end
          });
          onDatesRangeChange(event, { ...this.props, value: newRange });
        }
        return newState;
      });
    }
  
    getDatesRange = (range) => {
      const { dateFormat } = this.props;
      const { start, end } = range? range : { start: null, end: null };
      const startStr = start && start.format? start.format(dateFormat) : '';
      const endStr = end && end.format? end.format(dateFormat) : '';
      if (startStr) return `${startStr} - ${endStr}`;
      return '';
    }
  
    switchToPrevMode = (lastMode = 'day') => {
      this.setState({ mode: getPrevMode(this.state.mode, lastMode) });
    }
  
    switchToNextMode = (lastMode = 'day') => {
      this.setState({ mode: getNextMode(this.state.mode, lastMode) });
    }
  
    showNextYear = () => {
      this.setState(({ dateToShow }) => {
        let nextYear = dateToShow.clone();
        nextYear.add(1, 'Y');
        return {
          dateToShow: nextYear,
          year: nextYear.format('YYYY')
        };
      });
    }
  
    showPrevYear = () => {
      this.setState(({ dateToShow }) => {
        let prevYear = dateToShow.clone();
        prevYear.add(-1, 'Y');
        return {
          dateToShow: prevYear,
          year: prevYear.format('YYYY')
        };
      });
    }
  
    showNextMonth = () => {
      this.setState(({ dateToShow }) => {
        let nextMonth = dateToShow.clone();
        nextMonth.add(1, 'M');
        return { dateToShow: nextMonth };
      });
    }
  
    showPrevMonth = () => {
      this.setState(({ dateToShow }) => {
        let prevMonth = dateToShow.clone();
        prevMonth.add(-1, 'M');
        return { dateToShow: prevMonth };
      });
    }
  
    showNextDay = () => {
      if (WrappedComponent.META.type === DATE_TIME_INPUT) this.resetMinutes();
      this.setState(({ dateToShow }) => {
        let nextDay = dateToShow.clone();
        nextDay.add(1, 'd');
        this.onDateChange(null, {value: nextDay});
        return { dateToShow: nextDay };
      });
    }
  
    showPrevDay = () => {
      if (WrappedComponent.META.type === DATE_TIME_INPUT) this.resetMinutes();
      this.setState(({ dateToShow }) => {
        let prevDay = dateToShow.clone();
        prevDay.add(-1, 'd');
        this.onDateChange(null, {value: prevDay});
        return { dateToShow: prevDay };
      });
    }
  
    onDateClick = (event, data) => {
      tick(() => {
        this.onDateChange(event, data);
        this.switchToNextMode(WrappedComponent.META.type === DATE_TIME_INPUT? 'minute' : 'day');
        if (WrappedComponent.META.type === DATE_TIME_INPUT) dispatchDateChange();
      });
    }
  
    onHourClick = (event, data) => {
      tick(() => {
        this.setState(() => {
          return {
            activeHour: data.value
          };
        });
        this.switchToNextMode('minute');
      });
    }
  
    onMinuteClick = (event, data) => {
      this.setState(prevState => {
        const newValue = getTime({
          hour: prevState.activeHour,
          minute: data.value
        });
        this.onTimeChange(event, { value: newValue });
        return {
          activeMinute: data.value
        };
      });
    }
  
    onYearChange = (event, data) => {
      this.setState({
        dateToShow: moment({ year: data.value }),
        year: data.value
      });
      this.switchToNextMode();
    }
  
    onMonthChange = (event, data) => {
      const date = {
        year: this.state.dateToShow.year(),
        month: monthIndex(data.value)
      };
      this.setState({
        dateToShow: moment(date),
        month: data.value
      });
      this.switchToNextMode();
    }
  
    handleHeaderDateClick = () => {
      this.switchToPrevMode();
    }
  
    handleHeaderTimeClick = () => {
      this.switchToPrevMode('minute');
      this.resetMinutes();
      this.resetHours();
    }
  
    resetMinutes = () => {
      this.setState({ activeMinute: ''});
    }
  
    resetHours = () => {
      this.setState({ activeHour: ''});
    }

    onDateChange = (event, data) => {
      let newValue = data.value;
      if (newValue.format) {
        newValue = newValue.format(this.props.dateFormat);
      }
      _.invoke(this.props, 'onChange', event, { ...this.props, value: newValue });
    };
  
    onTimeChange = (event, data) => {
      const { value, dateFormat, divider } = this.props;
      const newValue = `${moment(value, dateFormat).format(dateFormat)}${divider}${data.value}`;
      _.invoke(this.props, 'onChange', event, { ...this.props, value: newValue });
    }

    onDatesRangeChange = (event, data) => {
      _.invoke(this.props, 'onChange', event, { ...this.props, value: data.value });
    }
  
    render() {
      const activeDate = parseDate(this.props.value, this.props.dateFormat);
      const wrapperState = {
        ...this.state,
        activeDate: activeDate,
        setDatesRange: this.setDatesRange,
        getDatesRange: this.setDatesRange,
        switchToPrevMode: this.switchToPrevMode,
        switchToNextMode: this.switchToNextMode,
        showNextYear: this.showNextYear,
        showPrevYear: this.showPrevYear,
        showNextMonth: this.showNextMonth,
        showPrevMonth: this.showPrevMonth,
        showNextDay: this.showNextDay,
        showPrevDay: this.showPrevDay,
        onDateClick: this.onDateClick,
        onHourClick: this.onHourClick,
        onMinuteClick: this.onMinuteClick,
        onYearChange: this.onYearChange,
        onMonthChange: this.onMonthChange,
        handleHeaderDateClick: this.handleHeaderDateClick,
        handleHeaderTimeClick: this.handleHeaderTimeClick,
        onDateChange: this.onDateChange,
        onTimeChange: this.onTimeChange,
        onDatesRangeChange: this.onDatesRangeChange
      };
      const rest = getUnhandledProps(WithStateInput, this.props);
      return (
        <WrappedComponent
          {  ...rest }
          onChange={ this.props.onChange }
          value={ this.props.value }
          wrapperState={ wrapperState } />
      );
    }
  };
}

export default withStateInput;
export {
  withStateInput
};
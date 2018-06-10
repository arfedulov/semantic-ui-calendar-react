import React from 'react';
import { Table } from 'semantic-ui-react';
import {
  monthIndex,
  cloneReplaceValue,
  emptyFunction,
  getUnhandledProps,
  tick
} from '../lib';
import {
  PickerHeader,
  DatePickerComponent,
  MonthPickerComponent,
  TimePickerComponent
} from '../components';
import moment from 'moment';
import PropTypes from 'prop-types';
import { DayMode } from '../components/pickerModes/DayMode.js';
import { MonthMode } from '../components/pickerModes/MonthMode.js';
import { DatePickerContent } from '../components/pickerContent/DatePickerContent.js';
import { DateTimePickerContent } from '../components/pickerContent/DateTimePickerContent.js';
import _ from 'lodash';
import {
  DATE_INPUT,
  DATE_TIME_INPUT
} from '../lib/COMPONENT_TYPES.js';
import { EVENTS, dispatchDateChange } from '../lib/events.js';

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
  return class WithStateInput extends React.Component {

    static get name() {
      const wrappedComponentName = WrappedComponent.META && WrappedComponent.META.name;
      return wrappedComponentName? wrappedComponentName : 'WithStateInput';
    }

    static propTypes = {
      /** (event, data) => {} */
      onDateChange: PropTypes.func,
      /** (event, data) => {} */
      onTimeChange: PropTypes.func,
      onDatesRangeChange: PropTypes.func,
      startMode: PropTypes.oneOf(['year', 'month', 'day']),
      value: PropTypes.string,
      dateFormat: PropTypes.string,
      pickDate: PropTypes.bool,
      pickDateTime: PropTypes.bool,
      pickDatesRange: PropTypes.bool,
      divider: PropTypes.string
    }

    static defaultProps = {
      onDateChange: emptyFunction,
      onTimeChange: emptyFunction,
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
        dateToShow: initialDate,
        activeHour: '',
        activeMinute: '',
        mode: startMode,
        datesRange: { start: null, end: null }
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
  
    shouldComponentUpdate(nextProps, nextState) {
      const {
        dateToShow,
        year,
        month,
        activeHour,
        activeMinute,
        mode,
        datesRange
      } = this.state;
      // for some reason when input value changes `Picker` updates twice (becouse of his parents updating)
      // but the second update is unnecessery because in second update `Picker` receives
      // `value` the same as previous `value`
      // seems like it it happens because `onDateClick` uses 0 timeout when setting state
      return nextProps.value !== this.props.value
        || dateToShow !== nextState.dateToShow
        || year !== nextState.year
        || month !== nextState.month
        || activeHour !== nextState.activeHour
        || activeMinute !== nextState.activeMinute
        || mode !== nextState.mode
        || datesRange.start !== nextState.datesRange.start
        || datesRange.end !== nextState.datesRange.end;
    }
  
    setDatesRange = (event, data) => {
      const { onDatesRangeChange } = this;
      this.setState(({ datesRange }) => {
        let newState;
        if (datesRange.start && datesRange.end) {
          newState = {
            datesRange: { start: null, end: null }
          };
          onDatesRangeChange(event, cloneReplaceValue(data, this.getDatesRange()));
        } else if (datesRange.start && datesRange.start.isAfter(data.value)) {
          newState = {
            datesRange: { start: null, end: null }
          };
          onDatesRangeChange(event, cloneReplaceValue(data, this.getDatesRange()));
        } else if (datesRange.start) {
          newState = {
            datesRange: { start: datesRange.start, end: data.value }
          };
          onDatesRangeChange(event, cloneReplaceValue(data, this.getDatesRange({
            start: datesRange.start,
            end: data.value
          })));
        } else {
          newState = {
            datesRange: { start: data.value, end: datesRange.end }
          };
          onDatesRangeChange(event, cloneReplaceValue(data, this.getDatesRange({
            start: data.value,
            end: datesRange.end
          })));
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
      if (this.props.pickDateTime) this.resetMinutes();
      this.setState(({ dateToShow }) => {
        let nextDay = dateToShow.clone();
        nextDay.add(1, 'd');
        this.onDateChange(null, {value: nextDay});
        return { dateToShow: nextDay };
      });
    }
  
    showPrevDay = () => {
      if (this.props.pickDateTime) this.resetMinutes();
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
        this.setState(prevState => {
          const newData = cloneReplaceValue(data, getTime({
            hour: data.value,
            minute: '00'
          }));
          return {
            activeHour: data.value
          };
        });
        this.switchToNextMode('minute');
      });
    }
  
    onMinuteClick = (event, data) => {
      this.setState(prevState => {
        const newData = cloneReplaceValue(data, getTime({
          hour: prevState.activeHour,
          minute: data.value
        }));
        this.onTimeChange(event, newData);
        return {
          activeMinute: data.value
        };
      });
    }
  
    onYearChange = (event, data) => {
      const date = {
        year: data.value
      };
      this.setState({
        dateToShow: moment(date),
        year: data.value
      });
      this.switchToNextMode();
    }
  
    onMonthChange = (event, data) => {
      const date = {
        year: this.state.year,
        month: monthIndex(data.value)
      };
      this.setState({
        dateToShow: moment(date),
        month: data.value
      });
      this.switchToNextMode();
    }
  
    handleHeaderDateClick = (event, data) => {
      this.switchToPrevMode();
    }
  
    handleHeaderTimeClick = (event, data) => {
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
      if (WrappedComponent.META.type === DATE_INPUT) {
        let newValue = data.value;
        if (data.value.format) {
          newValue = data.value.format(this.props.dateFormat);
        }
        _.invoke(this.props, 'onChange', event, { ...this.props, value: newValue });
      } else if (WrappedComponent.META.type === DATE_TIME_INPUT) {
        const newValue = data.value.format(this.props.dateFormat);
        _.invoke(this.props, 'onChange', event, { ...this.props, value: newValue });
      }
    };
  
    onTimeChange = (event, data) => {
      if (WrappedComponent.META.type === DATE_TIME_INPUT) {
        const { value, dateFormat, divider } = this.props;
        const newValue = `${moment(value, dateFormat).format(dateFormat)}${divider}${data.value}`;
        _.invoke(this.props, 'onChange', event, { ...this.props, value: newValue });
      }
    }

    onDatesRangeChange = (event, data) => {
      _.invoke(this.props, 'onChange', event, { ...this.props, value: data.value });
    }
  
    render() {
      const activeDate = parseDate(this.props.value, this.props.dateFormat);
      return (
        <WrappedComponent
          {  ...this.props }
          { ...this.state }
          activeDate={activeDate}
          setDatesRange={this.setDatesRange}
          getDatesRange={this.setDatesRange}
          switchToPrevMode={this.switchToPrevMode}
          switchToNextMode={this.switchToNextMode}
          showNextYear={this.showNextYear}
          showPrevYear={this.showPrevYear}
          showNextMonth={this.showNextMonth}
          showPrevMonth={this.showPrevMonth}
          showNextDay={this.showNextDay}
          showPrevDay={this.showPrevDay}
          onDateClick={this.onDateClick}
          onHourClick={this.onHourClick}
          onMinuteClick={this.onMinuteClick}
          onYearChange={this.onYearChange}
          onMonthChange={this.onMonthChange}
          handleHeaderDateClick={this.handleHeaderDateClick}
          handleHeaderTimeClick={this.handleHeaderTimeClick}
          resetMinutes={this.resetMinutes}
          resetHours={this.resetHours}
          onDateChange={this.onDateChange}
          onTimeChange={this.onTimeChange}
          onDatesRangeChange={this.onDatesRangeChange} />
      );
    }
  };
}

export default withStateInput;
export {
  withStateInput
};
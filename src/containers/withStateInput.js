import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import PropTypes from 'prop-types';
import _ from 'lodash';

import {
  monthIndex,
  tick,
  getUnhandledProps
} from '../lib';
import {
  DATE_TIME_INPUT,
  DATE_INPUT,
  DATES_RANGE_INPUT
} from '../lib/COMPONENT_TYPES';
import { EVENTS, dispatchDateChange } from '../lib/events';

const disableDateValidators = {
  disable: (disable /* moment|moment[] */, date, dateFormat) => {
    if (!disable) return false;
    if (_.isString(date)) {
      if (date.length !== dateFormat.length) return false;
      date = moment(date, dateFormat);
    }
    if (_.isArray(disable)) {
      return _.some(disable, disabledDate => disabledDate.isSame(date));
    }
    return disable.isSame(date);
  },
  minDate: (minDate /* moment */, date, dateFormat) => {
    if (!minDate) return false;
    if (_.isString(date)) {
      if (date.length !== dateFormat.length) return false;
      date = moment(date, dateFormat);
    }
    return minDate.isAfter(date);
  },
  maxDate: (maxDate /* moment */, date, dateFormat) => {
    if (!maxDate) return false;
    if (_.isString(date)) {
      if (date.length !== dateFormat.length) return false;
      date = moment(date, dateFormat);
    }
    return maxDate.isBefore(date);
  },
};

const disableMonthValidators = {
  minDate: (minDate, curDate, month /* number */) => {
    if (!minDate) return false;
    if (curDate.year() < minDate.year()) return true;
    if (curDate.year() === minDate.year()) {
      return month < minDate.month();
    }
    return false;
  },
  maxDate: (maxDate, curDate, month /* number */) => {
    if (!maxDate) return false;
    if (curDate.year() > maxDate.year()) return true;
    if (curDate.year() === maxDate.year()) {
      return month > maxDate.month();
    }
    return false;
  },
};

const disableYearValidators = {
  minDate: (minDate, year /* number */) => {
    if (!minDate) return false;
    return year < minDate.year();
  },
  maxDate: (maxDate, year /* number */) => {
    if (!maxDate) return false;
    return year > maxDate.year();
  },
};

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

const parseDate = (value, format, defaultVal) => {
  let date = moment(value, format);
  if (date.isValid()) {
    return date;
  } else if (defaultVal) {
    date = moment(defaultVal, format);
    if (date.isValid()) {
      return date;
    }
  }
  return moment();
};

const propToMoment = (val, dateFormat) => {
  if (!val) return;
  if (_.isArray(val)) {
    return val.map(disabledDate => moment(disabledDate, dateFormat));
  }
  if (!moment.isMoment(val)) return moment(val, dateFormat);
  return val;
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
      divider: PropTypes.string,
      /* If true, popup closes after selecting a date/time */
      closable: PropTypes.bool,
      /* Date to display initially when no date is selected */
      initialDate: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(moment),
        PropTypes.instanceOf(Date)
      ]),
      /* Minimum date that can be selected */
      minDate: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(moment)
      ]),
      /* Maximum date that can be selected */
      maxDate: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(moment)
      ]),
      /* Date or list of dates that are displayed as disabled */
      disable: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(moment),
        PropTypes.arrayOf(PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.instanceOf(moment),
        ])),
      ]),
    }

    static defaultProps = {
      startMode: 'day',
      dateFormat: 'DD-MM-YYYY',
      divider: ' ',
      closable: false
    }

    constructor(props) {
      super(props);
  
      const {
        value,
        dateFormat,
        startMode,
        initialDate,
        minDate,
        maxDate,
        disable,
      } = props;
      const _initialDate = value?
        moment(value, dateFormat) : initialDate?
          moment(initialDate, dateFormat) : moment().startOf('month');
      this.state = {
        dateToShow: _initialDate, // moment
        month: '', // str
        year: '', // str
        activeHour: '', // str
        activeMinute: '', // str
        mode: startMode, // str
        datesRange: { start: null, end: null } // { start: moment, end: moment }
      };
      this.minDate = propToMoment(minDate, dateFormat);
      this.maxDate = propToMoment(maxDate, dateFormat);
      this.disable = propToMoment(disable, dateFormat);
    }

    componentDidMount() {
      window.addEventListener(EVENTS.DATE_CHANGE, this.updateDateToShow);
      this.inputNode = ReactDOM.findDOMNode(this).querySelector('input');
    }

    componentWillUnmount() {
      window.removeEventListener(EVENTS.DATE_CHANGE, this.updateDateToShow);
    }

    updateDateToShow = () => {
      if (this.props.value) {
        this.setState({ dateToShow: parseDate(this.props.value, this.props.dateFormat) });
      }
      if (_.get(WrappedComponent, 'META.name') === DATES_RANGE_INPUT) {
        if (!this.props.value) {
          this.setState({
            datesRange: { start: null, end: null }
          });
        }
      }
    }

    closePopup = () => {
      this.inputNode.click();
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
        if (WrappedComponent.META.type === DATE_INPUT && this.props.closable) this.closePopup();
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
      if (WrappedComponent.META.type === DATE_TIME_INPUT && this.props.closable) this.closePopup();
      _.invoke(this.props, 'onChange', event, { ...this.props, value: newValue });
    }

    onDatesRangeChange = (event, data) => {
      if (WrappedComponent.META.type === DATES_RANGE_INPUT
        && this.state.datesRange.start
        && !this.state.datesRange.end
        && this.props.closable) this.closePopup();
      _.invoke(this.props, 'onChange', event, { ...this.props, value: data.value });
    }

    isDateDisabled = (date/* moment|string|number */) => {
      const { dateFormat } = this.props;

      /* handle 'day' mode and text input */
      if (moment.isMoment(date) || _.isString(date)) {
        return _.some([
          disableDateValidators.disable(this.disable, date, dateFormat),
          disableDateValidators.minDate(this.minDate, date, dateFormat),
          disableDateValidators.maxDate(this.maxDate, date, dateFormat),
        ]);
      }
      /* handle 'month' mode */
      if (!_.isNil(date) && _.isNumber(date.month)) {
        const { dateToShow } = this.state;
        return _.some([
          disableMonthValidators.minDate(this.minDate, dateToShow, date.month),
          disableMonthValidators.maxDate(this.maxDate, dateToShow, date.month),
        ]);
      }
      /* handle 'year' mode */
      if (!_.isNil(date) && _.isNumber(date.year)) {
        return _.some([
          disableYearValidators.minDate(this.minDate, date.year),
          disableYearValidators.maxDate(this.maxDate, date.year),
        ]);
      }
    }

    nextDisabled = (mode/* 'year'|'month'|'day' */, yearsStart) => {
      const { dateFormat } = this.props;
      if (mode === 'day') {
        const nextMonth = this.state.dateToShow.clone();
        nextMonth.add(1, 'M').startOf('month');
        return disableDateValidators.maxDate(this.maxDate, nextMonth, dateFormat);
      }
      if (mode === 'month') {
        const nextYear = this.state.dateToShow.clone();
        nextYear.add(1, 'y').startOf('year');
        return disableDateValidators.maxDate(this.maxDate, nextYear, dateFormat);
      }
      if (mode === 'year' && yearsStart) {
        const yearsOffset = 12 - (this.state.dateToShow.year() - yearsStart);
        const next12Years = this.state.dateToShow.clone();
        next12Years.add(yearsOffset, 'y').startOf('year');
        return this.isDateDisabled(next12Years);
      }
      return false;
    }

    prevDisabled = (mode/* 'year'|'month'|'day' */, yearsStart) => {
      const { dateFormat } = this.props;
      if (mode === 'day') {
        const prevMonth = this.state.dateToShow.clone();
        prevMonth.add(-1, 'M').endOf('month');
        return disableDateValidators.minDate(this.minDate, prevMonth, dateFormat);
      }
      if (mode === 'month') {
        const prevYear = this.state.dateToShow.clone();
        prevYear.add(-1, 'y').endOf('year');
        return disableDateValidators.minDate(this.minDate, prevYear, dateFormat);
      }
      if (mode === 'year') {
        const yearsOffset = -(this.state.dateToShow.year() - yearsStart);
        const prev12Years = this.state.dateToShow.clone();
        prev12Years.add(yearsOffset, 'y').startOf('year');
        return this.isDateDisabled(prev12Years);
      }
      return false;
    }
  
    render() {
      const activeDate = parseDate(this.props.value, this.props.dateFormat, this.props.initialDate);
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
        onDatesRangeChange: this.onDatesRangeChange,
        isDateDisabled: this.isDateDisabled,
        nextDisabled: this.nextDisabled,
        prevDisabled: this.prevDisabled,
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
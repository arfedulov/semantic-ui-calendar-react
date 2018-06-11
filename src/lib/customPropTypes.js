import PropTypes from 'prop-types';
import moment from 'moment';

const momentInstance = PropTypes.instanceOf(moment);
const datesRange = PropTypes.shape({
  start: momentInstance,
  end: momentInstance
});

export const CustomPropTypes = {
  datesRange: datesRange,
  dateToShow: momentInstance,
  activeDate: momentInstance,
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
  yearsRange: PropTypes.shape({
    start: PropTypes.number,
    end: PropTypes.number
  }),
  wrapperState: PropTypes.shape({
    dateToShow: momentInstance,
    month: PropTypes.string,
    year: PropTypes.string,
    activeHour: PropTypes.string,
    activeMinute: PropTypes.string,
    mode: PropTypes.string,
    datesRange: datesRange,
    activeDate: momentInstance,
    setDatesRange: PropTypes.func,
    getDatesRange: PropTypes.func,
    switchToPrevMode: PropTypes.func,
    switchToNextMode: PropTypes.func,
    showNextYear: PropTypes.func,
    showPrevYear: PropTypes.func,
    showNextMonth: PropTypes.func,
    showPrevMonth: PropTypes.func,
    showNextDay: PropTypes.func,
    showPrevDay: PropTypes.func,
    onDateClick: PropTypes.func,
    onHourClick: PropTypes.func,
    onMinuteClick: PropTypes.func,
    onYearChange: PropTypes.func,
    onMonthChange: PropTypes.func,
    handleHeaderDateClick: PropTypes.func,
    handleHeaderTimeClick: PropTypes.func,
    onDateChange: PropTypes.func,
    onTimeChange: PropTypes.func,
    onDatesRangeChange: PropTypes.func
  })
};

export default CustomPropTypes;
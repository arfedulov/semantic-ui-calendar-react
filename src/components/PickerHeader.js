import React from 'react';
import { Table, Icon } from 'semantic-ui-react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getWeekDays, getUnhandledProps } from '../utils.js';

function PickerHeader(props) {
  const {
    onNextBtnClick,
    onPrevBtnClick,
    activeDate,
    activeDatesRange,
    activeYears,
    activeYear,
    includeDay,
    showWeeks,
    width
  } = props;
  const rest = getUnhandledProps(PickerHeader, props);

  const _getWeekDayHeaders = () => {
    return getWeekDays().map((weekDay) => (
      <Table.HeaderCell
        key={weekDay}
        className="suir-calendar week-day"
        colSpan="1">
        {weekDay}
      </Table.HeaderCell>
    ));
  };

  const cellClasses = ClassNames(
    'suir-calendar',
    'cell',
    showWeeks? '' : 'time-picker-header'
  );
  
  const buttonClasses = ClassNames(
    'suir-calendar',
    'button'
  );

  const getRangeRow = () => {
    const getContent = () => {
      const { start, end } = activeDatesRange;
      if (start && end) {
        return start.format('MMM DD, YYYY') + ' - ' + end.format('MMM DD, YYYY');
      }
      if (start) {
        return start.format('MMMM DD, YYYY') + ' - ' + '. . .';
      }
      return '. . . - . . .';
    };
    return (
      <Table.Row>
        <Table.HeaderCell className="suir-calendar cell" colSpan="7">
          { getContent() }
        </Table.HeaderCell>
      </Table.Row>
    );
  };

  const getContent = () => {
    if (activeYears) {
      return `${activeYears.start} - ${activeYears.end}`;
    }

    if (activeYear) {
      return activeYear;
    }

    if (activeDate) {
      return includeDay? activeDate.format('MMMM DD, YYYY') : activeDate.format('MMMM YYYY');
    }
  };

  return (
    <Table.Header { ...rest }>
      { activeDatesRange && getRangeRow() }
      <Table.Row>
        <Table.HeaderCell className={cellClasses} colSpan="1">
          <Icon
            className={buttonClasses}
            onClick={onPrevBtnClick}
            name="chevron left" />
        </Table.HeaderCell>
        <Table.HeaderCell className={cellClasses} colSpan={(parseInt(width) - 2).toString()}>
          { getContent() }
        </Table.HeaderCell>
        <Table.HeaderCell className={cellClasses} colSpan="1">
          <Icon
            className={buttonClasses}
            onClick={onNextBtnClick}
            name="chevron right" />
        </Table.HeaderCell>
      </Table.Row>
      { showWeeks && <Table.Row>{ _getWeekDayHeaders() }</Table.Row> }
    </Table.Header>
  );
}

PickerHeader.propTypes = {
  onNextBtnClick: PropTypes.func.isRequired,
  onPrevBtnClick: PropTypes.func.isRequired,
  /** Header's width in table columns */
  width: PropTypes.string.isRequired,
  /** calendar shows date of this `moment` */
  activeDate: PropTypes.instanceOf(moment),
  activeYear: PropTypes.string,
  activeYears: PropTypes.shape({
    start: PropTypes.number,
    end: PropTypes.number
  }),
  activeDatesRange: PropTypes.shape({
    start: PropTypes.instanceOf(moment),
    end: PropTypes.instanceOf(moment)
  }),
  includeDay: PropTypes.bool,
  showWeeks: PropTypes.bool,
  className: PropTypes.string
};

PickerHeader.defaultProps = {
  includeDay: false,
  showWeeks: false
};

export default PickerHeader;
export {
  PickerHeader
};
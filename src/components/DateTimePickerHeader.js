import React from 'react';
import { Table, Icon } from 'semantic-ui-react';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getWeekDays, getUnhandledProps } from '../utils.js';

function DateTimePickerHeader(props) {
  const {
    onNextBtnClick,
    onPrevBtnClick,
    showedDate,
    showDate,
    showWeeks,
    width
  } = props;
  const rest = getUnhandledProps(DateTimePickerHeader, props);

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
  return (
    <Table.Header { ...rest }>
      <Table.Row>
        <Table.HeaderCell className={cellClasses} colSpan="1">
          <Icon
            className={buttonClasses}
            onClick={onPrevBtnClick}
            name="chevron left" />
        </Table.HeaderCell>
        <Table.HeaderCell className={cellClasses} colSpan={(parseInt(width) - 2).toString()}>
          {showDate? showedDate.format('MMMM DD, YYYY') : showedDate.format('MMMM YYYY')}
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

DateTimePickerHeader.propTypes = {
  onNextBtnClick: PropTypes.func.isRequired,
  onPrevBtnClick: PropTypes.func.isRequired,
  /** calendar shows date of this `moment` */
  showedDate: PropTypes.instanceOf(moment).isRequired,
  /** Header's width in table columns */
  width: PropTypes.string.isRequired,
  showDate: PropTypes.bool,
  showWeeks: PropTypes.bool,
  className: PropTypes.string
};

DateTimePickerHeader.defaultProps = {
  showDate: false,
  showWeeks: true
};

export default DateTimePickerHeader;
export {
  DateTimePickerHeader
};
import React from 'react';
import { Table, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import moment from 'moment';
import _ from 'lodash';

import { getWeekDays, getUnhandledProps } from '../lib';

const cellStyles = bottomBorder => ({
  border: 'none',
  borderBottom: bottomBorder? '1px solid rgba(34,36,38,.1)' : 'none',
});

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
    width,
    onDateClick,
    nextDisabled,
    prevDisabled,
  } = props;
  const rest = getUnhandledProps(PickerHeader, props);

  const _getWeekDayHeaders = () => {
    return getWeekDays().map((weekDay) => (
      <Table.HeaderCell
        key={weekDay}
        style={cellStyles(true)}
        colSpan="1">
        {weekDay}
      </Table.HeaderCell>
    ));
  };

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
        <Table.HeaderCell style={cellStyles()} colSpan="7">
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

  const headerCellStyle = { cursor: 'pointer '};
  const nextBtnDisabled = _.isFunction(nextDisabled) && nextDisabled();
  const prevBtnDisabled = _.isFunction(prevDisabled) && prevDisabled();
  const cursorStylePrev = {
    cursor: prevBtnDisabled? 'auto' : 'pointer',
  };
  const cursorStyleNext = {
    cursor: nextBtnDisabled? 'auto' : 'pointer',
  };

  return (
    <Table.Header { ...rest }>
      { activeDatesRange && getRangeRow() }
      <Table.Row>
        <Table.HeaderCell style={cellStyles(!showWeeks)} colSpan="1">
          <Icon
            fitted
            style={cursorStylePrev}
            disabled={prevBtnDisabled}
            onClick={prevBtnDisabled ? undefined : onPrevBtnClick}
            name="chevron left" />
        </Table.HeaderCell>
        <Table.HeaderCell
          onClick={onDateClick}
          style={cellStyles(!showWeeks)}
          colSpan={(parseInt(width) - 2).toString()}>
          <span style={headerCellStyle}>{ getContent() }</span>
        </Table.HeaderCell>
        <Table.HeaderCell style={cellStyles(!showWeeks)} colSpan="1">
          <Icon
            fitted
            style={cursorStyleNext}
            disabled={nextBtnDisabled}
            onClick={nextBtnDisabled ? undefined : onNextBtnClick}
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
  className: PropTypes.string,
  onDateClick: PropTypes.func,
  nextDisabled: PropTypes.func,
  prevDisabled: PropTypes.func,
};

PickerHeader.defaultProps = {
  includeDay: false,
  showWeeks: false
};

export default PickerHeader;
export {
  PickerHeader
};
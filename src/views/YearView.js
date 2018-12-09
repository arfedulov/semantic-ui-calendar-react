import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as PropTypes from 'prop-types';
import * as _ from 'lodash';

import Calendar from './Calendar';
import Header from './CalendarHeader/Header';
import Body from './CalendarBody/Body';
import BaseView from './BaseView';

const YEAR_CALENDAR_ROW_WIDTH = '3';

class YearView extends BaseView {
  render() {
    const {
      years,
      onNextPageBtnClick,
      onPrevPageBtnClick,
      onYearClick,
      hasNextPage,
      hasPrevPage,
      onHeaderClick,
      disabled,
      active,
      hovered,
      onCellHover,
      onMount,
      ...rest
    } = this.props;
    const headerTitle = `${_.first(years)} - ${_.last(years)}`;
    return (
      <Calendar ref={e => this.calendarNode = ReactDOM.findDOMNode(e)} {...rest}>
        <Header
          title={headerTitle}
          onNextPageBtnClick={onNextPageBtnClick}
          onPrevPageBtnClick={onPrevPageBtnClick}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          onHeaderClick={onHeaderClick}
          width={YEAR_CALENDAR_ROW_WIDTH}
          displayWeeks={false} />
        <Body
          width={YEAR_CALENDAR_ROW_WIDTH}
          data={years}
          hovered={hovered}
          onCellHover={onCellHover}
          onCellClick={onYearClick}
          active={active}
          disabled={disabled} />
      </Calendar>
    );
  }
}

YearView.propTypes = {
  /** An array of years to fill a calendar with. */
  years: PropTypes.arrayOf(PropTypes.string).isRequired,
  /** Called after click on next page button. */
  onNextPageBtnClick: PropTypes.func.isRequired,
  /** Called after click on previous page button. */
  onPrevPageBtnClick: PropTypes.func.isRequired,
  /** Called after click on year. */
  onYearClick: PropTypes.func.isRequired,
  /** Whether to display previous page button as active or disabled. */
  hasPrevPage: PropTypes.bool.isRequired,
  /** Whether to display next page button as active or disabled. */
  hasNextPage: PropTypes.bool.isRequired,
  /** Called on calendar cell hover. */
  onCellHover: PropTypes.func,
  /** Index of a cell that should be displayed as hovered. */
  hovered: PropTypes.number,
  /** Called after click on calendar header. */
  onHeaderClick: PropTypes.func,
  /** An array of numbers that represent indexes of years in `years` array that should be displayed as disabled. */
  disabled: PropTypes.arrayOf(PropTypes.number),
  /** Index of a year in `years` array that should be displayed as active. */
  active: PropTypes.number,
  onMount: PropTypes.func,
};

export default YearView;

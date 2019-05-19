import { Moment } from 'moment';
import * as React from 'react';

import {
  YearView,
  MonthView,
  DayView,
  HourView,
  MinuteView,
  DatesRangeView,
  MonthRangeView,
} from '../views';

/**
 * Filter out all moments that don't have
 * all dates in month disabled.
 * @param {*} moments
 * @return An array of moments; each of these moments
 * doesn't have any selectable date in month.
 */
export function getDisabledMonths(moments: Moment[]): Moment[] {
  if (!moments) {
    return;
  }
  const disabledMonths = [];
  const checkedMonths = [];
  for (const m of moments) {
    if (checkedMonths.indexOf(m.month()) < 0) {
      const momentsForMonth = moments.filter((mForMonth) => mForMonth.month() === m.month());
      const momentsForMonthUniq = [];
      for (const mForMonth of momentsForMonth) {
        if (momentsForMonthUniq.indexOf(mForMonth) < 0) {
          momentsForMonthUniq.push(mForMonth);
        }
      }
      if (momentsForMonthUniq.length === m.daysInMonth()) {
        disabledMonths.push(m);
      }
      checkedMonths.push(m);
    }
  }

  return disabledMonths;
}

/**
 * Filter out all moments that don't have
 * all months in year disabled.
 * @param {*} moments
 * @return An array of moments; each of these moments
 * doesn't have any selectable month in year.
 */
export function getDisabledYears(moments: Moment[]): Moment[] {
  if (!moments) {
    return;
  }
  const disabledYears = [];
  const checkedYears = [];
  for (const y of moments) {
    if (checkedYears.indexOf(y.year()) < 0) {
      const momentsForYear = getDisabledMonths(moments.filter((mForYear) => mForYear.year() === y.year()));
      const momentsForYearUniq = [];
      for (const mForYear of momentsForYear) {
        if (momentsForYearUniq.indexOf(mForYear) < 0) {
          momentsForYearUniq.push(mForYear);
        }
      }
      if (momentsForYearUniq.length === 12) {
        disabledYears.push(y);
      }
      checkedYears.push(y);
    }
  }

  return disabledYears;
}

export function getYearView(yearViewProps): React.ReactElement {
  const {
    inline,
    localization,
  } = this.props;

  return (
    <YearView
      { ...this.getUnusedProps() }
      { ...yearViewProps }
      inline={ inline }
      onMount={ this.onCalendarViewMount }
      localization={ localization } />
  );
}

export function getMonthView(monthViewProps): React.ReactElement {
  const {
    inline,
  } = this.props;

  return (
    <MonthView
      { ...this.getUnusedProps() }
      { ...monthViewProps }
      inline={inline}
      onMount={ this.onCalendarViewMount }
      localization={this.props.localization} />
  );
}

export function getDayView(dayViewProps): React.ReactElement {
  const {
    inline,
  } = this.props;

  return (
    <DayView
      { ...this.getUnusedProps() }
      { ...dayViewProps }
      inline={inline}
      onMount={ this.onCalendarViewMount }
      localization={this.props.localization}
    />
  );
}

export function getHourView(hourViewProps): React.ReactElement {
  const {
    inline,
  } = this.props;

  return (
    <HourView
      { ...this.getUnusedProps() }
      { ...hourViewProps }
      inline={ inline }
      onMount={ this.onCalendarViewMount }
      localization={this.props.localization}/>
  );
}

export function getMinuteView(minuteViewProps): React.ReactElement {
  const {
    inline,
  } = this.props;

  return (
    <MinuteView
      { ...this.getUnusedProps() }
      { ...minuteViewProps }
      inline={ inline }
      onMount={ this.onCalendarViewMount }
      localization={this.props.localization}/>
  );
}

export function getDatesRangeView(datesRangeViewProps): React.ReactElement {
  const {
    markColor,
    localization,
    inline,
  } = this.props;

  return (
    <DatesRangeView
      { ...this.getUnusedProps() }
      { ...datesRangeViewProps }
      inline={ inline }
      onMount={ this.onCalendarViewMount }
      markColor={markColor}
      localization={localization}
    />
  );
}

export function getMonthRangeView(monthRangeViewProps): React.ReactElement {
  const {
    inline,
  } = this.props;

  return (
    <MonthRangeView
      { ...this.getUnusedProps() }
      { ...monthRangeViewProps }
      inline={ inline }
      onMount={ this.onCalendarViewMount }
      localization={ this.props.localization }/>
  );
}

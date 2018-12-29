import { Moment } from 'moment';

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

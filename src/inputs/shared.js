
/**
 * Filter out all moments that don't have
 * all dates in month disabled.
 * @param {*} moments
 * @return An array of moments; each of these moments
 * doesn't have any selectable date in month.
 */
export function getDisabledMonths(moments) {
  if (!moments) {
    return;
  }
  const disabledMonths = [];
  const checkedMonths = [];
  for (let m of moments) {
    if (checkedMonths.indexOf(m.month()) < 0) {
      const momentsForMonth = moments.filter(_m => _m.month() === m.month());
      const momentsForMonthUniq = [];
      for (let i =0; i < momentsForMonth.length; i++) {
        if (momentsForMonthUniq.indexOf(momentsForMonth[i]) < 0) {
          momentsForMonthUniq.push(momentsForMonth[i]);
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
export function getDisabledYears(moments) {
  if (!moments) {
    return;
  }
  const disabledYears = [];
  const checkedYears = [];
  for (let y of moments) {
    if (checkedYears.indexOf(y.year()) < 0) {
      const momentsForYear = getDisabledMonths(moments.filter(_y => _y.year() === y.year()));
      const momentsForYearUniq = [];
      for (let i =0; i < momentsForYear.length; i++) {
        if (momentsForYearUniq.indexOf(momentsForYear[i]) < 0) {
          momentsForYearUniq.push(momentsForYear[i]);
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

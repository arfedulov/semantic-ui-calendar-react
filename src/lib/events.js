let dateChangeEvent;

if (typeof Event === 'function') {
  dateChangeEvent = new Event('dateChange', { bubbles: false });
  window.dispatchEvent(dateChangeEvent);
}

export const dispatchDateChange = () => {
  if (dateChangeEvent) window.dispatchEvent(dateChangeEvent);
};

export const EVENTS = {
  DATE_CHANGE: 'dateChange'
};
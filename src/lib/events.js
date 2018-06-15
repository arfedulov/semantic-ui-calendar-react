let dateChangeEvent;

if (typeof document !== 'undefined') {
  if (typeof Event === 'function') {
    dateChangeEvent = new Event('dateChange', { bubbles: false });
  } else {
    dateChangeEvent = document.createEvent('Event');
    dateChangeEvent.initEvent('dateChange', false, false);
  }
}

export const dispatchDateChange = () => {
  if (dateChangeEvent) window.dispatchEvent(dateChangeEvent);
};

export const EVENTS = {
  DATE_CHANGE: 'dateChange'
};
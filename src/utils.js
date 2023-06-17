import flatpickr from 'flatpickr';

import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration.js';

import 'flatpickr/dist/flatpickr.css';

dayjs.extend(durationPlugin);

/**
 * @param {string} startDateTime
 * @param {string} endDateTime
 * @returns {string}
 */
function formatDuration(startDateTime, endDateTime) {
  const milliseconds = dayjs(endDateTime).diff(startDateTime);
  const duration = dayjs.duration(milliseconds);

  if (duration.months()) {
    return duration.format('MM[m] DD[d]  HH[h] mm[m]');
  }
  if (duration.days()) {
    return duration.format('DD[d]  HH[h] mm[m]');
  }
  if (duration.hours()) {
    return duration.format('HH[h] mm[m]');
  }

  return duration.format('mm[m]');
}

/**
 * @param {string | dayjs.Dayjs} dateTime
 * @param {boolean} [narrow]
 * @return {string}
 */
function formatDate(dateTime, narrow) {
  return dayjs(dateTime).format(narrow ? 'D' : 'MMM D');
}

/**
 * @param {string} startDateTime
 * @param {string} endDateTime
 * @returns {string}
 */
function formatDateRange(startDateTime, endDateTime) {
  const start = dayjs(startDateTime);
  const end = dayjs(endDateTime);

  if (start.isSame(end, 'date')) {
    return formatDate(start);
  }

  return [
    formatDate(start),
    formatDate(end, start.isSame(end, 'month')),
  ].join(' — ');
}

/**
 * @param {string} dateTime
 * @returns {string}
 */
function formatTime(dateTime) {
  return dayjs(dateTime).format('HH:mm');
}

/**
 * @param {HTMLInputElement} startDateField
 * @param {HTMLInputElement} endDateField
 * @returns {() => void}
 */
function createDatePickers(startDateField, endDateField) {
  /** @type {FlatpickrOptions} */
  const options = {
    monthSelectorType: 'static',
    dateFormat: 'Z',
    altInput: true,
    enableTime: true,
    'time_24hr': true,
    altFormat: 'd/m/y h:i',
    locale: {
      firstDayOfWeek: 1
    },
  };

  const startDatePicker = flatpickr(startDateField, options);
  const endDatePicker = flatpickr(endDateField, options);

  startDatePicker.set('onChange', (dates) => endDatePicker.set('minDate', dates.at(0)));
  endDatePicker.set('minDate', startDatePicker.selectedDates.at(0));

  return () => {
    startDatePicker.destroy();
    endDatePicker.destroy();
  };
}

export {
  createDatePickers,
  formatDate,
  formatTime,
  formatDuration,
  formatDateRange,
};

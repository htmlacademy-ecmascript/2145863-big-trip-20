import dayjs from 'dayjs';
import {escape as escapeHtml} from 'he';
import durationPlugin from 'dayjs/plugin/duration.js';
dayjs.extend(durationPlugin);

/**
 * @param {string} startDateTime
 * @param {string} endDateTime
 * @returns {string}
 */
function formatDuration(startDateTime, endDateTime) {
  const milliseconds = dayjs(endDateTime).diff(startDateTime);

  return dayjs.duration(milliseconds).format('  HH[h] mm[m]');
}

/**
 * @param {string} dateTime
 * @return {string}
 */
function formatDate(dateTime) {
  return dayjs(dateTime).format('MMM D');
}

/**
 * @param {string} dateTime
 * @returns {string}
 */
function formatTime(dateTime) {
  return dayjs(dateTime).format('HH:mm');
}

class SafeHtml extends String {}

/**
 * @param {TemplateStringsArray} strings
 * @param {...any} values
 * @return {SafeHtml}
 */
function html(strings, ...values) {
  const result = strings.reduce((before, after, index) => {
    const value = values[index - 1];

    if (Array.isArray(value) && value.every((it) => it instanceof SafeHtml)) {
      return before + value.join('') + after;
    }

    if (!(value instanceof SafeHtml)) {
      return before + escapeHtml(String(value)) + after;
    }

    return before + value + after;
  });

  return new SafeHtml(result);
}

export {SafeHtml, html, formatDate, formatTime, formatDuration};

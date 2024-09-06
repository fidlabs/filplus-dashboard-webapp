export function calculateTimestampFromHeight(height) {
  return 1598306400 + 30 * height;
}

export function calculateDateFromHeight(timestamp) {
  return new Date(calculateTimestampFromHeight(timestamp) * 1000).toDateString();
}

export function calculateISODateFromHeight(timestamp) {
  return new Date(calculateTimestampFromHeight(timestamp) * 1000).toISOString();
}

export function calculateHeightFromTimestamp(timestamp) {
  return timestamp > 1598306400
    ? Math.round((timestamp - 1598306400) / 30)
    : null;
}

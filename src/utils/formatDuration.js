export const formatDuration = (value) => {
  if (isNaN(parseInt(value, 10)) || !isFinite(parseInt(value, 10))) {
    return 'N/A';
  }

  if (value < 60) return `${value}s`;
  let duration = parseInt(value);

  const d = Math.trunc(duration / (24 * 3600));

  duration = duration % (24 * 3600);
  const h = Math.trunc(duration / 3600);

  duration %= 3600;
  const m = Math.trunc(duration / 60);

  // duration %= 60;
  // const s = duration;

  return `${d ? `${d}d:` : ''}${h ? `${h}h:` : ''}${m}m`;
};

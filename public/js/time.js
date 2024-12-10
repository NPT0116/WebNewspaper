function formatDateTime(isoString, dateOnly) {
  const date = new Date(isoString);

  // Options for formatting without timezone
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  if (!dateOnly) {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.second = '2-digit';
  }

  return date.toLocaleString('en-US', options);
}

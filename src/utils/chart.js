const ONE_PIB = 1125899906842624;

export const datacapPerDayYAxisTicks = Array.from(
  { length: 22 },
  (x, index) => ONE_PIB * (index + 1)
);

export const setYAxisTicks = (toggle, dataset) => {
  if (toggle === 'tab1') return [0, 25, 50, 75, 100];

  const limits = [0];
  let max = 0;
  dataset.forEach((element) => {
    if (Number(element['totalDeals']) > max) max = element['totalDeals'];
  });

  max = Math.round(max * 1.05);
  limits.push(Math.round(max / 4));
  limits.push(Math.round(max / 2));
  limits.push(Math.round((max * 3) / 4));
  limits.push(max);

  return limits;
};

export const xFormatter = (value) => {
  const date = new Date(value);

  const month = '' + date.toLocaleString('en-US', { month: 'short' });
  const day = '' + date.getDate();
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export const bar1Key = (toggle) => {
  if (toggle == 'tab1') return 'notOkPercent';
  if (toggle == 'tab2') return 'anyTaggedDeals';
  if (toggle == 'tab3') return 'anyTaggedDeals';
};

export const bar2Key = (toggle) => {
  if (toggle == 'tab1') return 'okPercent';
  if (toggle == 'tab2') return 'wellDistributedDeals';
  if (toggle == 'tab3') return 'wellDistributedDeals';
};

export const bar1KeyBySize = (toggle) => {
  if (toggle == 'tab1') return 'notOkPercent';
  if (toggle == 'tab2') return 'anyTaggedDealsSize';
  if (toggle == 'tab3') return 'anyTaggedDealsSize';
};

export const bar2KeyBySize = (toggle) => {
  if (toggle == 'tab1') return 'okPercent';
  if (toggle == 'tab2') return 'wellDistributedDealsSize';
  if (toggle == 'tab3') return 'wellDistributedDealsSize';
};

export const bar1Description = (toggle) => {
  if (toggle == 'tab1') return 'Percent of possible abuse deals';
  if (toggle == 'tab2') return 'Number of possible abuse deals';
  if (toggle == 'tab3') return 'Number of possible abuse deals';
};

export const bar2Description = (toggle) => {
  if (toggle == 'tab1') return 'Percent of well-distributed deals';
  if (toggle == 'tab2') return 'Number of well-distributed deals';
  if (toggle == 'tab3') return 'Number of well-distributed deals';
};

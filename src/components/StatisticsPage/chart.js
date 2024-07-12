import { useEffect, useState } from 'react';

import { convertBytesToIEC } from 'utils/bytes';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

import s from './s.module.css';

const month_names = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const month_names_short = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const renderTooltip = (props) => {
  const data = props?.payload?.[0]?.payload;

  if (!data) return null;

  const { allowance, allowance2, allowance3, allowanceTimestamp } = data;
  return (
    <div className={s.chartTooltip}>
      <div className={s.chartTooltipTitle}>
        {`${
          month_names_short[new Date(allowanceTimestamp * 1).getUTCMonth()]
        } ${new Date(allowanceTimestamp * 1).getUTCFullYear()}`}
      </div>
      <div className={s.chartTooltipData}>{convertBytesToIEC(allowance2)}</div>
      <div className={s.chartTooltipData}>{convertBytesToIEC(allowance)}</div>
    </div>
  );
};

export const Chart = ({
  data = [],
  runningTotalData = [],
  datacapHistoricUsageData = [],
}) => {
  const [aspect, setAspect] = useState(3);
  const dataToNormalize = {};
  for (const dataPoint in data) {
    const timestampKey = new Date(
      data[dataPoint]['allowanceTimestamp']
    ).getTime();
    if (!dataToNormalize[timestampKey]) dataToNormalize[timestampKey] = {};
    dataToNormalize[timestampKey]['allowance'] = data[dataPoint]['allowance'];
  }

  for (const dataPoint in runningTotalData) {
    const timestampKey = new Date(
      runningTotalData[dataPoint]['allowanceTimestamp']
    ).getTime();
    if (!dataToNormalize[timestampKey]) dataToNormalize[timestampKey] = {};
    dataToNormalize[timestampKey]['allowance2'] =
      runningTotalData[dataPoint]['allowance'];
  }

  let normalizedData = [];
  for (const key in dataToNormalize) {
    normalizedData.push({
      allowance: Number(dataToNormalize[key].allowance),
      allowance2: Number(dataToNormalize[key].allowance2),
      allowanceTimestamp: key,
    });
  }

  useEffect(() => {
    const handler = () => {
      setAspect(window.innerWidth > 768 ? 3 : 1.5);
    };

    handler();
    window.addEventListener('resize', handler);

    return () => {
      handler();
      window.removeEventListener('resize', handler);
    };
  }, []);

  return (
    <div className={s.chartWrap}>
      <ResponsiveContainer width="100%" aspect={2}>
        <LineChart
          data={normalizedData}
          margin={{ top: 40, right: 50, left: 20, bottom: 20 }}
        >
          <XAxis
            dataKey="allowanceTimestamp"
            tickFormatter={(value) =>
              `${
                month_names_short[new Date(value * 1).getUTCMonth()]
              } ${new Date(value * 1).getUTCFullYear()}`
            }
            tick={{
              fontSize: 12,
              fontWeight: 500,
              fill: 'var(--theme-text-secondary)',
            }}
          />
          <YAxis
            dataKey="allowance2"
            tickFormatter={(value) => convertBytesToIEC(value)}
            padding={{ left: 20 }}
            tick={{
              fontSize: 12,
              fontWeight: 500,
              fill: 'var(--theme-text-secondary)',
            }}
          />
          <Tooltip content={renderTooltip} />
          <Legend />
          <Line
            name="DataCap allocated to clients per month"
            type="monotone"
            dataKey="allowance"
            stroke="var(--color-dodger-blue)"
          />
          <Line
            name="DataCap allocated to clients per month runing total"
            type="monotone"
            dataKey="allowance2"
            stroke="var(--color-mountain-meadow)"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

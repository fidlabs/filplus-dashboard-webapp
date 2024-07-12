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
import { palette } from 'utils/colors';

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

export const Chart2 = ({
  data = [],
  runningTotalData = [],
  data2 = [],
  runningTotalData2 = [],
  enableData,
  enableRunningTotalData,
  enableData2,
  enableRunningTotalData2,
}) => {
  const [aspect, setAspect] = useState(3);
  const dataToNormalize = {};
  for (const dataPoint in data) {
    const timestampKey = new Date(data[dataPoint]['timestamp']).getTime();
    if (!dataToNormalize[timestampKey]) dataToNormalize[timestampKey] = {};
    dataToNormalize[timestampKey]['allowance'] = data[dataPoint]['usedDatacap'];
  }

  for (const dataPoint in runningTotalData) {
    const timestampKey = new Date(
      runningTotalData[dataPoint]['timestamp']
    ).getTime();
    if (!dataToNormalize[timestampKey]) dataToNormalize[timestampKey] = {};
    dataToNormalize[timestampKey]['allowance2'] =
      runningTotalData[dataPoint]['usedDatacap'];
  }

  for (const dataPoint in data2) {
    const timestampKey = new Date(
      data2[dataPoint]['allowanceTimestamp']
    ).getTime();
    if (!dataToNormalize[timestampKey]) dataToNormalize[timestampKey] = {};
    dataToNormalize[timestampKey]['allowance3'] = data2[dataPoint]['allowance'];
  }

  for (const dataPoint in runningTotalData2) {
    const timestampKey = new Date(
      runningTotalData2[dataPoint]['allowanceTimestamp']
    ).getTime();
    if (!dataToNormalize[timestampKey]) dataToNormalize[timestampKey] = {};
    dataToNormalize[timestampKey]['allowance4'] =
      runningTotalData2[dataPoint]['allowance'];
  }

  let normalizedData = [];
  for (const key in dataToNormalize) {
    normalizedData.push({
      allowance: Number(dataToNormalize[key].allowance),
      allowance2: Number(dataToNormalize[key].allowance2),
      allowance3: Number(dataToNormalize[key].allowance3),
      allowance4: Number(dataToNormalize[key].allowance4),
      allowanceTimestamp: key,
    });
  }
  normalizedData.sort((a, b) => +a.allowanceTimestamp - +b.allowanceTimestamp);
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

  const renderTooltip = (props) => {
    const data = props?.payload?.[0]?.payload;

    if (!data) return null;

    const {
      allowance,
      allowance2,
      allowance3,
      allowance4,
      allowanceTimestamp,
    } = data;
    let values = [];
    if (enableData) values.push(allowance);
    if (enableRunningTotalData) values.push(allowance2);
    if (enableData2) values.push(allowance3);
    if (enableRunningTotalData2) values.push(allowance4);
    values.sort((a, b) => b - a);

    return (
      <div className={s.chartTooltip}>
        <div className={s.chartTooltipTitle}>
          {`${
            month_names_short[new Date(allowanceTimestamp * 1).getUTCMonth()]
          } ${new Date(allowanceTimestamp * 1).getUTCFullYear()}`}
        </div>
        {values.map((v) => (
          <div className={s.chartTooltipData}>{convertBytesToIEC(v)}</div>
        ))}
      </div>
    );
  };

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
            dataKey="allowance4"
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
          {enableData && (
            <Line
              name="DataCap used per month"
              type="monotone"
              dataKey="allowance"
              stroke={palette(8, 1)}
            />
          )}
          {enableRunningTotalData && (
            <Line
              name="DataCap used per month runing total"
              type="monotone"
              dataKey="allowance2"
              stroke={palette(8, 7)}
            />
          )}
          {enableData2 && (
            <Line
              name="DataCap allocated per month"
              type="monotone"
              dataKey="allowance3"
              stroke={palette(8, 6)}
            />
          )}
          {enableRunningTotalData2 && (
            <Line
              name="DataCap allocated per month runing total"
              type="monotone"
              dataKey="allowance4"
              stroke={palette(8, 8)}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

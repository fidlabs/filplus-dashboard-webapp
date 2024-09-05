import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts';
import { palette } from 'utils/colors';
import { convertBytesToIEC } from 'utils/bytes';
import { useFetch } from 'hooks';
import { useMemo } from 'react';
import cn from 'classnames';

export const DataCapAllocationsWoW = () => {
  const fetchUrl = '/get-dc-allocated-to-clients-total-by-week';

  const [data, { loading, loaded }] = useFetch(fetchUrl);

  const parsedData = useMemo(() => {
    let normalData = [];
    if (data) {
      Object.keys(data).forEach((key) => {
        let yearObj = data[key];
        Object.keys(yearObj).forEach((weekKey) => {
          normalData.push({
            name: `w${weekKey} ${key}`,
            value: yearObj[weekKey]
          });
        });
      });
    }
    return normalData;
  });

  return <div className={cn('chartWrap', 'wide')}>
    {!!parsedData.length && <ResponsiveContainer width="100%" aspect={2} debounce={500}>
      <LineChart
        data={parsedData}
        margin={{ top: 40, right: 50, left: 20, bottom: 20 }}
      >
        <XAxis
          dataKey="name"
          tick={{
            fontSize: 12,
            fontWeight: 500,
            fill: 'var(--theme-text-secondary)'
          }}
        />
        <YAxis
          dataKey="value"
          domain={['dataMin', 'dataMax']}
          tickFormatter={(value) => convertBytesToIEC(value)}
          tick={{
            fontSize: 12,
            fontWeight: 500,
            fill: 'var(--theme-text-secondary)'
          }}
        />
        <Tooltip content={(props) => {
            return <div className={'chartTooltip'}>
              <div className={'chartTooltipTitle'}>{props.label}</div>
              <div className={'chartTooltipData'}>{convertBytesToIEC(props?.payload?.[0]?.value)}</div>
            </div>
        }} />
        <Legend />
        <Line
          name="DataCap used per month"
          type="monotone"
          dataKey="value"
          stroke={palette(8, 0)}
        />
      </LineChart>
    </ResponsiveContainer>}
  </div>;

};

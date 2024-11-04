import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { palette } from 'utils/colors';
import cn from 'classnames';
import s from '../s.module.css';
import ChartLoader from './ChartLoader';
import { uniq } from 'lodash/array';
import { useMemo } from 'react';

const AuditHistoryBarGraph = ({ data, scale = 'linear', isLoading, audits }) => {

  if (!data?.length) {
    return null;
  }

  const renderTooltip = (props) => {
    const payload = props?.payload?.[0]?.payload;
    if (!payload) {
      return null;
    }

    return (
      <div className="chartTooltip">
        <div className="chartTooltipTitle">{payload.name}</div>
        <div className="chartTooltipData">{
          dataKeys.map((key, index) => {
            const value = payload[`group${index}`] ?? payload[key];
            if (!value) {
              return null;
            }
            const name = payload[`group${index}Name`] ?? payload[`${key}Name`] ?? key;
            return <div key={key} className="chartTooltipRow">
              <div style={{ color: palette(0, index) }} >{name} - {value} providers</div>
            </div>
          })
        }</div>
      </div>
    );
  };

  const chartData = useMemo(() => {
    const returnData = [];

    data.forEach((item) => {
      const newItem = {
        ...item
      }

      item.auditStatuses.forEach((status, index) => {
        const key = `a${index}`;
        newItem[key] = 1;
        newItem[`${key}Name`] = status;
      })

      returnData.push(newItem);
    });
    return returnData;
  }, [data]);

  const dataKeys = useMemo(() => {
    return Array.from({ length: audits }, (_, i) => `a${i + 1}`);
  }, [audits]);

  if (isLoading) {
    return <div className={'chartWrap'}>
      <div className={s.loaderWrap}>
        <ChartLoader/>
      </div>
    </div>
  }

  return <div className={cn('chartWrap', 'aspect3_2')}>
    <ResponsiveContainer width="100%" aspect={3 / 2} debounce={500}>
      <BarChart
        data={chartData}
        margin={{ bottom: chartData.length > 6 ? 150 : 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip content={renderTooltip} />
        <XAxis dataKey="name" angle={chartData.length > 6 ? 90 : 0} interval={0} minTickGap={0}
               tick={chartData.length > 6 ? <CustomizedAxisTick /> : true} />
        <YAxis/>
        <Tooltip />
        {dataKeys.map((key, index) => <Bar key={key} dataKey={key}
                                          stackId="a" fill={palette(0, index)} />)}
        ))
      </BarChart>
    </ResponsiveContainer>
  </div>
}

const CustomizedAxisTick = (props) => {
  const { x, y, stroke, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dx={-5} dy={5} textAnchor="end" fill="#666" fontSize={15} transform="rotate(-90)">
        {payload.value.substring(0, 25)}{payload.value.length > 25 ? '...' : ''}
      </text>
    </g>
  );
};

export default AuditHistoryBarGraph;

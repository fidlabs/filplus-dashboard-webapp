import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { palette } from 'utils/colors';
import cn from 'classnames';
import s from '../s.module.css';
import ChartLoader from './ChartLoader';
import { uniq } from 'lodash/array';
import { useMemo } from 'react';

const StackedBarGraph = ({ data, scale = 'linear', isLoading, color }) => {

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


  const parseDataMax = (dataMax) => {
    if (dataMax < 150) {
      return Math.ceil(dataMax / 20) * 20;
    }
    if (dataMax > 300) {
      return Math.ceil(dataMax / 100) * 100;
    }
    return Math.ceil(dataMax / 50) * 50;
  };

  const dataKeys = useMemo(() => {
    return uniq(data.flatMap(data => Object.keys(data)).filter(key => !key.toLowerCase().includes('name')));
  }, [data]);

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
        data={data}
        margin={{ bottom: data.length > 6 ? 150 : 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip content={renderTooltip} />
        <XAxis dataKey="name" angle={data.length > 6 ? 90 : 0} interval={0} minTickGap={0}
               tick={data.length > 6 ? <CustomizedAxisTick /> : true} />
        <YAxis domain={[0, parseDataMax]} />
        <Tooltip />
        {dataKeys.map((key, index) => <Bar key={key} dataKey={key}
                                          stackId="a" fill={color ?? palette(0, index)} />)}
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

export default StackedBarGraph;

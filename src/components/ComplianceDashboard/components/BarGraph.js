import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { palette } from '../../../utils/colors';
import cn from 'classnames';
import s from '../s.module.css';
import ChartLoader from './ChartLoader';

const BarGraph = ({ data, scale = 'linear', isLoading }) => {

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
        <div className="chartTooltipData">{payload.value}</div>
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

  if (isLoading) {
    return <div className={s.chartWrap}>
      <div className={s.loaderWrap}>
        <ChartLoader/>
      </div>
    </div>
  }

  return <div className={cn(s.chartWrap, s.square)}>
    <ResponsiveContainer width="100%" aspect={3 / 2} debounce={500}>
      <BarChart
        data={data}
        margin={{ bottom: data.length > 6 ? 150 : 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip content={renderTooltip} />
        <XAxis dataKey="name" angle={data.length > 6 ? 90 : 0} interval={0} minTickGap={0}
               tick={data.length > 6 ? <CustomizedAxisTick /> : true} />
        <YAxis scale={scale} domain={[0, parseDataMax]} />
        <Tooltip />
        <Bar
          dataKey="value"
          fill={palette(
            2,
            1
          )}
        />
        ))
      </BarChart>
    </ResponsiveContainer>
  </div>
}

const CustomizedAxisTick = (props) => {
  const { x, y, stroke, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dx={-5} dy={5} textAnchor="end" fill="#666" transform="rotate(-90)">
        {payload.value.substring(0, 25)}{payload.value.length > 25 ? '...' : ''}
      </text>
    </g>
  );
};

export default BarGraph;

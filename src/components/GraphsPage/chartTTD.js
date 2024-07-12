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
  BarChart,
  CartesianGrid,
  Bar,
  Cell,
  LabelList,
} from 'recharts';

import s from './s.module.css';
import { formatDuration } from 'utils/formatDuration';
import { palette } from '../../utils/colors';

export const ChartTTD = ({ data = {} }) => {
  const [aspect, setAspect] = useState(3);

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

  const formatter = (value) => formatDuration(value);

  const renderTooltip = (props) => {
    const providerData = props?.payload?.[0]?.payload;

    if (!providerData) return null;

    return (
      <div className={s.chartTooltip}>
        <div className={s.chartTooltipTitle}>{providerData['name']}</div>
        <h5>TTD statistics</h5>
        <div className={s.chartTooltipData} style={{color: palette(0, 0)}}>
          Direct TTD: {formatDuration(providerData['directTTD'])}
        </div>
        <div className={s.chartTooltipData} style={{color: palette(0, 1)}}>
          LDN TTD: {formatDuration(providerData['ldnTTD'])}
        </div>
      </div>
    );
  };

  return (
    <div className={s.chartWrap}>
      <ResponsiveContainer width="100%" aspect={2}>
        <BarChart width={500} height={500} data={data.data}>
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip content={renderTooltip} />
          <XAxis dataKey="name" />
          <YAxis
            ticks={[432000, 864000, 1296000, 1728000, 2160000, 2592000]}
            width={80}
            tickFormatter={formatter}
          />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="directTTD"
            fill={palette(0, 0)}
            name="Direct allocators TTD"
          />
          <Bar dataKey="ldnTTD" fill={palette(0, 1)} name="LDN allocators TTD" />
          ))
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

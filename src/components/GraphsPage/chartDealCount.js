import { useEffect, useState } from 'react';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import s from './s.module.css';
import { palette } from 'utils/colors';

export const ChartDealCount = ({ data = {} }) => {

  const [hoveredBarIndex, setHoveredBarIndex] = useState(-1);

  const getVal = (obj, key) => {
    if (obj && obj[key]) return obj[key].value;
    return 0;
  };

  const getId = (obj, key) => {
    if (obj && obj[key]) return obj[key].id;
    return 0;
  };

  const barKeys = [];
  for (let i = 0; i < 11; i++) barKeys.push(`a${i}`);

  const reversedBarKeys = [];
  for (let i = 10; i >= 0; i--) reversedBarKeys.push(`a${i}`);

  const renderTooltip = (props) => {
    const providerData = props?.payload?.[0]?.payload;

    if (!providerData) return null;

    return (
      <div className={s.chartTooltip}>
        <div className={s.chartTooltipTitle}>{providerData['name']}</div>
        <h5>Provider deal count</h5>

        {reversedBarKeys.map((key, index) => (
          <div
            style={{
              color: palette(
                data.providers.length * 15,
                barKeys.indexOf(key)
              ),
              fontWeight: (barKeys.length - 1) - hoveredBarIndex === index ? '900' : '400',
            }}
          >
            {providerData[key]
              ? `${providerData[key]['id']} : ${providerData[key]['value']}`
              : ''}
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    setTimeout(() => {
      const tooltip = document.querySelector(
        '.deal-count-chart .recharts-tooltip-wrapper'
      );
      tooltip.addEventListener('mousemove', (e) => e.stopPropagation());
    }, 0);
  }, []);

  return (
    <div className={s.chartWrap}>
      <ResponsiveContainer width="100%" aspect={2} className="deal-count-chart">
        <BarChart width={500} height={500} data={data.data}>
          <CartesianGrid />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            wrapperStyle={{ pointerEvents: 'all', boxShadow: '0 0 10px #333', borderRadius: '5px'}}
            content={renderTooltip}
          />
          {barKeys.map((key, barIndex) => (
            <Bar key={`chartDealCount_${barIndex}`}
                 dataKey={(val) => getVal(val, key)} stackId="a">
              {data.data.map((entry, entryIndex) => {
                return (
                  <Cell
                    key={`chartDealCount_${barIndex}_${entryIndex}`}
                    fill={palette(
                      data.providers.length * 15,
                      barIndex
                    )}
                    onMouseOver={() => {
                      setHoveredBarIndex(barIndex);
                    }}
                    onMouseOut={() => {
                      setHoveredBarIndex(-1);
                    }}
                    stroke={'#333'}
                    strokeWidth={0.5}
                  ></Cell>
                );
              })}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

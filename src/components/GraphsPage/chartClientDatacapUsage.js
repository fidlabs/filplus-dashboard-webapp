import { useEffect, useState } from 'react';

import { convertBytesToIEC } from 'utils/bytes';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import s from './s.module.css';
import { palette } from 'utils/colors';

export const ChartClientDatacapUsage = ({ data = {} }) => {
  const [hoveredBarIndex, setHoveredBarIndex] = useState(-1);
  const [hoveredBarIndexSb, setHoveredBarIndexSb] = useState(-1);


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

  const barKeysb = [];
  for (let i = 0; i < 11; i++) barKeysb.push(`b${i}`);

  const reversedBarKeys = [];
  for (let i = 10; i >= 0; i--) reversedBarKeys.push(`a${i}`);
  const reversedBarKeysb = [];
  for (let i = 10; i >= 0; i--) reversedBarKeysb.push(`b${i}`);

  const renderTooltip = (props) => {
    const providerData = props?.payload?.[0]?.payload;
    if (!providerData) return null;
    return (
      <div className={s.chartTooltip}>
        <div className={s.chartTooltipTitle}>{providerData['name']}</div>
        <div>
          <div style={{ float: 'left' }}>
            <h5>Incoming DataCap</h5>
            {reversedBarKeysb.map((key, index) => (
              <div
                style={{
                  color: palette(
                    data.clients.length * 15,
                    barKeysb.indexOf(key)
                  ),
                  fontWeight: (barKeysb.length - 1) - hoveredBarIndexSb === index ? '900' : '400',
                }}
              >
                {providerData[key]
                  ? `${providerData[key]['id']} : ${convertBytesToIEC(
                    providerData[key]['value']
                  )}`
                  : ''}
              </div>
            ))}
          </div>

          <div style={{ float: 'left', paddingLeft: '30px' }}>
            <h5>Outgoing DataCap</h5>
            {reversedBarKeys.map((key, index) => (
              <div
                style={{
                  color: palette(
                    data.clients.length * 15,
                    barKeys.indexOf(key),
                  ),
                  fontWeight: (barKeys.length - 1) - hoveredBarIndex === index ? '900' : '400',
                }}
              >
                {providerData[key]
                  ? `${providerData[key]['id']} : ${convertBytesToIEC(
                    providerData[key]['value']
                  )}`
                  : ''}
              </div>
            ))}
          </div>

          <div style={{ clear: 'both' }}></div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    setTimeout(() => {
      const tooltip = document.querySelector(
        '.client-datacap-usage-chart .recharts-tooltip-wrapper'
      );
      tooltip.addEventListener('mousemove', (e) => e.stopPropagation());
    }, 0);
  }, []);

  return (
    <div className={s.chartWrap}>
      <ResponsiveContainer
        width="100%"
        aspect={2}
        className="client-datacap-usage-chart"
      >
        <BarChart width={500} height={500} data={data.data}>
          <CartesianGrid />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => convertBytesToIEC(value)} />
          <Tooltip
            wrapperStyle={{ pointerEvents: 'all', boxShadow: '0 0 10px #333', borderRadius: '5px' }}
            content={renderTooltip}
          />
          {barKeysb.map((key, barIndex) => (
            <Bar key={`chartClientDatacapUsage1_${barIndex}`}
                 dataKey={(val) => getVal(val, key)} stackId="b">
              {data.data.map((entry, entryIndex) => {
                return (
                  <Cell
                    key={`chartClientDatacapUsage1_${barIndex}_${entryIndex}`}
                    fill={palette(
                      data.clients.length * 15,
                      barIndex
                    )}
                    onMouseOver={() => {
                      setHoveredBarIndexSb(barIndex);
                    }}
                    onMouseOut={() => {
                      setHoveredBarIndexSb(-1);
                    }}
                    stroke={'#333'}
                    strokeWidth={0.5}
                  ></Cell>
                );
              })}
            </Bar>
          ))}

          {barKeys.map((key, barIndex) => (
            <Bar key={`chartClientDatacapUsage2_${barIndex}`}
                 dataKey={(val) => getVal(val, key)} stackId="a">
              {data.data.map((entry, entryIndex) => {
                return (
                  <Cell
                    key={`chartClientDatacapUsage2_${barIndex}_${entryIndex}`}
                    fill={palette(
                      data.clients.length * 15,
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

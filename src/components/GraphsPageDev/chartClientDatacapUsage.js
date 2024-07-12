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
import { palette } from 'utils/colors';

export const ChartClientDatacapUsage = ({ data = {} }) => {
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
            {reversedBarKeysb.map((key) => (
              <div
                style={{
                  color: palette(
                    data.clients.length * 15,
                    data.clients.indexOf(getId(providerData, key)) * 15
                  ),
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
            {reversedBarKeys.map((key) => (
              <div
                style={{
                  color: palette(
                    data.clients.length * 15,
                    data.clients.indexOf(getId(providerData, key)) * 15
                  ),
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

  return (
    <div className={s.chartWrap}>
      <ResponsiveContainer width="100%" aspect={2}>
        <BarChart width={500} height={500} data={data.data}>
          <CartesianGrid />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => convertBytesToIEC(value)} />
          <Tooltip content={renderTooltip} />
          {barKeysb.map((key) => (
            <Bar dataKey={(val) => getVal(val, key)} stackId="b">
              {data.data.map((entry) => {
                return (
                  <Cell
                    fill={palette(
                      data.clients.length * 15,
                      data.clients.indexOf(getId(entry, key)) * 15
                    )}
                    stroke={'#000'}
                  ></Cell>
                );
              })}
            </Bar>
          ))}

          {barKeys.map((key) => (
            <Bar dataKey={(val) => getVal(val, key)} stackId="a">
              {data.data.map((entry) => {
                return (
                  <Cell
                    fill={palette(
                      data.clients.length * 15,
                      data.clients.indexOf(getId(entry, key)) * 15
                    )}
                    stroke={'#000'}
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

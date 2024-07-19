import s from './s.module.css';
import {
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid, Bar, BarChart, Legend
} from 'recharts';
import { palette } from '../../utils/colors';
import { convertBytesToIEC } from '../../utils/bytes';
import { useFetch } from '../../hooks/fetch';
import { PureComponent, useMemo, useState } from 'react';
import cn from 'classnames';
import { useHistory } from 'react-router-dom';

import { scaleSymlog, scaleLog } from 'd3-scale';
const scale = scaleSymlog().constant(700 * 1024 * 1024 * 1024);

export const DataCapUsedOverTime = () => {
  const fetchUrl = '/get-dc-allocated-to-clients-grouped-by-verifiers-wow';
  const fetchUrlNotaries = `/getVerifiers?page=1&showInactive=true`;
  const {push} = useHistory();

  const [data, { loading, loaded }] = useFetch(fetchUrl);
  const [notaries] = useFetch(fetchUrlNotaries);
  const [weeksKeys, setWeeksKeys] = useState([]);

  const parsedData = useMemo(() => {
    let normalData = [];
    if (data && !!notaries?.data) {
      setWeeksKeys([]);
      Object.keys(data).forEach((yearKey) => {
        const yearObj = data[yearKey];
        Object.keys(yearObj).forEach((weekKey) => {
          const weekObj = yearObj[weekKey];
          setWeeksKeys(keys => {
            return [
              ...keys,
              `w${weekKey}`
            ];
          });
          Object.keys(weekObj).forEach((clientKey) => {
            const clientObj = weekObj[clientKey];
            if (normalData.findIndex((item) => item.name === clientKey) === -1) {
              normalData.push({
                name: clientKey,
                display: notaries.data.find((notary) => notary.addressId === clientKey)?.name || clientKey,
                [`w${weekKey}`]: +clientObj
              });
            } else {
              normalData = normalData.map((item) => {
                if (item.name === clientKey) {
                  return {
                    ...item,
                    [`w${weekKey}`]: +clientObj
                  };
                }
                return item;
              });
            }
          });
        });
      });
    }
    return normalData;
  }, [data, notaries.data]);

  const renderTooltip = (props) => {
    const providerData = props?.payload?.[0]?.payload;
    if (!providerData) return null;

    const reversedWeekKeys = [...weeksKeys].reverse();
    const total = weeksKeys.reduce((acc, key) => (isNaN(+providerData[key]) ? 0 : +providerData[key]) + acc, 0);

    return <div className={s.chartTooltip}>
      <div className={s.chartTooltipTitle}>{providerData['display']} - {convertBytesToIEC(total)}</div>

      {reversedWeekKeys.map((key, index) => (
        <div
          style={{
            color: palette(
              0,
              weeksKeys.indexOf(key)
            ),
          }}
        >
          {providerData[key]
            ? `${key} : ${convertBytesToIEC(providerData[key])}`
            : ''}
        </div>
      ))}
    </div>;

  };

  const handleClick = (data) => {
    push(`/notaries/${data.name}`);
  };

  const formatYAxisTick = (value) => {
    return convertBytesToIEC(value);
  }

  const logScale = (value) => {
    console.log(value);

    return value;
  }

  return <div className={cn(s.chartWrap, s.squareIsh, s.chartMarginBottom)}>
    {!!parsedData.length && <ResponsiveContainer width="100%" aspect={3/2} debounce={500}>
      <BarChart
        data={parsedData}
        margin={{ top: 40, right: 50, left: 20, bottom: 200 }}
        onClick={console.log}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="display" angle={90} interval={0} minTickGap={0} tick={<CustomizedAxisTick/>} />
        <YAxis tickFormatter={formatYAxisTick} scale={scale}/>
        <Tooltip content={renderTooltip} />
        <Legend align="right" verticalAlign="middle" layout="vertical" />
        {weeksKeys.map((key, index) => <Bar onClick={handleClick} key={key} style={{cursor: 'pointer'}} dataKey={key} stackId="a" fill={palette(0, index)} />)}
      </BarChart>
    </ResponsiveContainer>}
  </div>;

};

class CustomizedAxisTick extends PureComponent {
  render() {
    const { x, y, stroke, payload } = this.props;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dx={-5} dy={5} textAnchor="end" fill="#666" transform="rotate(-90)">
          {payload.value.substring(0, 25)}{payload.value.length > 25 ? '...' : ''}
        </text>
      </g>
    );
  }
}


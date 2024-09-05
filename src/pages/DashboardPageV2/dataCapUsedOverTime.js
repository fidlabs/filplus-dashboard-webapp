import s from './s.module.css';
import {
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid, Bar, BarChart, Legend
} from 'recharts';
import { palette } from 'utils/colors';
import { convertBytesToIEC } from 'utils/bytes';
import { useFetch, useChartScale } from 'hooks';
import { useMemo, useState } from 'react';
import cn from 'classnames';
import { ScaleTabs } from 'components';

export const DataCapUsedOverTime = () => {
  const fetchUrl = '/get-dc-allocated-to-clients-grouped-by-verifiers-wow';
  const fetchUrlNotaries = `/getVerifiers?page=1&showInactive=true`;

  const [data, { loading, loaded }] = useFetch(fetchUrl);
  const [notaries] = useFetch(fetchUrlNotaries);
  const [weeksKeys, setWeeksKeys] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState([]);

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

    const reversedWeekKeys = [...weeksToDisplay].reverse();
    const total = weeksToDisplay.reduce((acc, key) => (isNaN(+providerData[key]) ? 0 : +providerData[key]) + acc, 0);

    return <div className={'chartTooltip'}>
      <div className={'chartTooltipTitle'}>{providerData['display']} - {convertBytesToIEC(total)}</div>

      {reversedWeekKeys.map((key, index) => (
        <div
          key={index}
          style={{
            color: palette(
              0,
              weeksKeys.indexOf(key)
            )
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
    window.open(`/notaries/${data.name}`, '_blank');
  };

  const formatYAxisTick = (value) => {
    return convertBytesToIEC(value);
  };

  const clickLegend = (event, entry) => {
    const isMac = navigator.userAgent.includes('Mac');
    if (event.shiftKey) {
      if (!selectedWeek.length) {
        setSelectedWeek([entry]);
      } else {
        const firstIndex = weeksKeys.indexOf(selectedWeek[0]);
        const lastIndex = weeksKeys.indexOf(selectedWeek[selectedWeek.length - 1]);
        const selectedIndex = weeksKeys.indexOf(entry);
        const start = Math.min(firstIndex, selectedIndex, selectedWeek.indexOf(entry) > -1 ? selectedIndex :lastIndex);
        const end = Math.max(firstIndex, selectedIndex, selectedWeek.indexOf(entry) > -1 ? selectedIndex :lastIndex);
        setSelectedWeek(weeksKeys.slice(start, end + 1));
      }
    } else if ((!isMac && event.ctrlKey) || (isMac && event.metaKey)) {
      setSelectedWeek(curr => curr.indexOf(entry) > -1 ? curr.filter((item) => item !== entry) : [...curr, entry]);
    } else {
      setSelectedWeek(curr => curr.length === 1 && curr.indexOf(entry) > -1 ? curr.filter((item) => item !== entry) : [entry]);
    }
  };

  const clearLegend = () => {
    setSelectedWeek([]);
  };

  const renderLegend = () => {
    return (
      <div className={s.legend}>
        {
          weeksKeys.map((entry, index) => (
            <button
              className={cn(s.item, { [s.active]: selectedWeek.indexOf(entry) > -1 }, { [s.siblingActive]: !!selectedWeek.length })}
              onClick={(e) => clickLegend(e, entry)} key={`item-${index}`}>
              <div className={s.indicator} style={{ backgroundColor: palette(0, index) }} />
              Week {entry.substring(1)}
            </button>
          ))
        }
        <div className={s.menu}>
          <button
            className={s.item}
            onClick={clearLegend}>
            Clear
          </button>
        </div>
      </div>
    );
  };

  const weeksToDisplay = useMemo(() => {
    if (!selectedWeek?.length) {
      return weeksKeys;
    }
    return weeksKeys.filter((key) => selectedWeek.indexOf(key) > -1);
  }, [selectedWeek, weeksKeys]);

  const minValue = useMemo(() => {
    if (!parsedData.length) {
      return 0;
    }
    const values = parsedData.map((item) => weeksToDisplay.map(week => item[week])).flat().filter((item) => !isNaN(item));

    return Math.min(...values);
  }, [parsedData, weeksToDisplay]);

  const filteredData = useMemo(() => {
    console.log(parsedData)
    return parsedData.filter((item) => weeksToDisplay.some((key) => Object.keys(item).includes(key)));
  }, [parsedData, weeksToDisplay]);

  const { scale, selectedScale, setSelectedScale } = useChartScale(minValue, 'log');

  return <div className="card size6">
    <div className="cardTitle">
      <div className="chartHeader">
        <div>DataCap Used Over Time by Allocator</div>
        <div className="chartHeaderOptions">
          <ScaleTabs scale={selectedScale} setScale={setSelectedScale} />
        </div>
      </div>
    </div>
    <div className={cn('chartWrap', s.aspect3_2, s.chartMarginBottom)}>
      {!!filteredData.length && <ResponsiveContainer width="100%" aspect={3 / 2} debounce={500}>
        <BarChart
          data={filteredData}
          margin={{ top: 40, right: 50, left: 20, bottom: 200 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="display" angle={90} interval={0} minTickGap={0} tick={<CustomizedAxisTick />} />
          <YAxis tickFormatter={formatYAxisTick} scale={scale} />
          <Tooltip content={renderTooltip} />
          <Legend align="right" verticalAlign="middle" layout="vertical" content={renderLegend} />
          {weeksToDisplay.map((key) => <Bar onClick={handleClick} key={key} style={{ cursor: 'pointer' }} dataKey={key}
                                            stackId="a" fill={palette(0, weeksKeys.indexOf(key))} />)}
        </BarChart>
      </ResponsiveContainer>}
    </div>
  </div>;

};

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


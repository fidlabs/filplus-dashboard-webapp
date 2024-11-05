import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { palette } from 'utils/colors';
import cn from 'classnames';
import s from '../s.module.css';
import ChartLoader from './ChartLoader';
import { uniq } from 'lodash/array';
import { useMemo, useState } from 'react';
import { useGoogleSheetFilters } from '../../../hooks/useGoogleSheetFilters';

const AuditHistoryBarGraph = ({ data, scale = 'linear', isLoading, audits }) => {

  const {
    activeFilter, auditedFilter, FAILED_STATUSES, WAITING_STATUSES, PARTIAL_STATUSES, PASS_STATUSES
  } = useGoogleSheetFilters();

  const [showActive, setShowActive] = useState(true);
  const [showAudited, setShowAudited] = useState(true);

  const getStatusFriendlyName = (status) => {

    if (FAILED_STATUSES.includes(status)) {
      return 'Failed';
    }
    if (PARTIAL_STATUSES.includes(status)) {
      return 'Passed conditionally';
    }
    if (PASS_STATUSES.includes(status)) {
      return 'Passed';
    }
    return 'Pre audit';
  };

  const getStatusColor = (status) => {
    if (FAILED_STATUSES.includes(status)) {
      return '#ff0029';
    }
    if (PARTIAL_STATUSES.includes(status)) {
      return '#f2b94f';
    }
    if (PASS_STATUSES.includes(status)) {
      return '#66a61e';
    }
    return '#525252';
  };

  const getOrdinalNumber = (number) => {
    const j = number % 10,
      k = number % 100;
    if (j === 1 && k !== 11) {
      return number + 'st';
    }
    if (j === 2 && k !== 12) {
      return number + 'nd';
    }
    if (j === 3 && k !== 13) {
      return number + 'rd';
    }
    return number + 'th';
  };

  const renderTooltip = (props) => {
    const payload = props?.payload?.[0]?.payload;

    const dataKeysReversed = [...dataKeys].reverse();

    if (!payload) {
      return null;
    }

    return (
      <div className="chartTooltip">
        <div className="chartTooltipTitle">{payload.name}</div>
        <div className="chartTooltipData">{
          dataKeysReversed.map((key, index) => {
            const value = payload[key];
            if (!value || (!key.includes('0') && WAITING_STATUSES.includes(payload[`${key}Name`])) || payload[`${key}Name`] === 'INACTIVE') {
              return null;
            }
            const name = payload[`group${index}Name`] ?? payload[`${key}Name`] ?? key;
            return <div key={key} className="chartTooltipRow">
              <div>{getOrdinalNumber(+key.substring(1) + 1)} Audit - <span
                style={{ color: getStatusColor(payload[`${key}Name`]) }}>{getStatusFriendlyName(payload[`${key}Name`])}</span>
              </div>
            </div>;
          })
        }</div>
      </div>
    );
  };

  const chartData = useMemo(() => {
    const returnData = [];

    const filteredData = data.filter((item) => (!showActive || activeFilter(item)) && (!showAudited || auditedFilter(item)));

    filteredData.forEach((item) => {
      const newItem = {
        ...item
      };
      item.auditStatuses.forEach((status, index) => {
        if (index > 0 && WAITING_STATUSES.includes(status) || status === 'INACTIVE') {
          return;
        }
        const key = `a${index}`;
        newItem[key] = 1;
        newItem[`${key}Name`] = status;
      });

      returnData.push(newItem);
    });
    return returnData;
  }, [data, showActive, showAudited]);

  const dataKeys = useMemo(() => {
    return Array.from({ length: audits }, (_, i) => `a${i}`);
  }, [audits]);

  const renderLegend = () => {
    return (
      <div className={s.legend}>
        <div
          className={s.item}>
          <div className={s.indicator} style={{ backgroundColor: getStatusColor('DOUBLE') }} />
          Passed
        </div>
        <div
          className={s.item}>
          <div className={s.indicator} style={{ backgroundColor: getStatusColor('THROTTLE') }} />
          Passed <br/> conditionally
        </div>
        <div
          className={s.item}>
          <div className={s.indicator} style={{ backgroundColor: getStatusColor('REJECT') }} />
          Failed
        </div>
        <div
          className={s.item}>
          <div className={s.indicator} style={{ backgroundColor: getStatusColor('WAITING') }} />
          Waiting
        </div>

      </div>
    );
  };

  if (!data?.length) {
    return null;
  }

  if (isLoading) {
    return <div className={'chartWrap'}>
      <div className={s.loaderWrap}>
        <ChartLoader />
      </div>
    </div>;
  }

  return <div className="grid w-full noMargin">
    <div className="card alt compact size2">
      <div className="cardTitle">
        Settings
      </div>
      <div className="cardData">
        <div>

          <div>
            <input
              type="checkbox"
              style={{ width: 20, height: 20, cursor: 'pointer' }}
              checked={showActive}
              onChange={(e) => {
                setShowActive(e.target.checked)
                if (!e.target.checked) {
                  setShowAudited(false)
                }
              }}
            />
            <span
              style={{
                color: 'var(--theme-text-secondary)',
                fontWeight: 500
              }}
            >
                Show only active
              </span>
          </div>
          <div>
            <input
              type="checkbox"
              style={{ width: 20, height: 20, cursor: 'pointer' }}
              checked={showAudited}
              onChange={(e) => {
                setShowAudited(e.target.checked)
                if (e.target.checked) {
                  setShowActive(true)
                }
              }}
            />
            <span
              style={{
                color: 'var(--theme-text-secondary)',
                fontWeight: 500
              }}
            >
                Show audited
              </span>
          </div>
        </div>
      </div>
    </div>
    <div className="size6">
      <div className={cn('chartWrap', 'aspect3_2')}>
        <ResponsiveContainer width="100%" aspect={3 / 2} debounce={500}>
          <BarChart
            data={chartData}
            margin={{ bottom: chartData.length > 6 ? 150 : 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip content={renderTooltip} />
            <XAxis dataKey="name" angle={chartData.length > 6 ? 90 : 0} interval={0} minTickGap={0}
                   tick={chartData.length > 6 ? <CustomizedAxisTick /> : true} />
            <YAxis domain={[0, audits]} tickCount={audits + 1} />
            <Tooltip />
            <Legend align="right" verticalAlign="middle" layout="vertical" content={renderLegend} />
            {dataKeys.map((key, index) => <Bar key={key} dataKey={key}
                                               stackId="a">
              {
                chartData.map((entry) => (
                  <Cell fill={getStatusColor(entry[key + 'Name'])} />
                ))
              }
            </Bar>)}
            ))
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>;
};

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

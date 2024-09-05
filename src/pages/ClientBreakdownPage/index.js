import cn from 'classnames';
import { useParams } from 'react-router-dom';
import s from './s.module.css';
import { useFetch } from 'hooks';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useMemo, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from 'recharts';
import { value } from 'lodash/seq';
import { palette } from 'utils/colors';
import { TableHeading, PageHeading, ComplianceDownloadButton } from 'components';
import { convertBytesToIEC } from 'utils/bytes';

const table = [
  { key: 'provider', title: 'Storage Provider ID' },
  {
    key: 'percent',
    title: '% of total client used DataCap',
    align: 'right',
    suffix: '%'
  },
  {
    key: 'total_deal_size',
    title: 'Total size',
    align: 'right',
    convertToIEC: true
  }
];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value}%`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {payload.totalSize}
      </text>
    </g>
  );
};

export default function ClientBreakdownPage() {
  const { clientID } = useParams();

  const auxEndDate = new Date();
  const auxStartDate = new Date(new Date().setDate(auxEndDate.getDate() - 30));

  const [activeIndex, setActiveIndex] = useState(0);
  const [startDate, setStartDate] = useState(auxStartDate);
  const [endDate, setEndDate] = useState(auxEndDate);
  const fetchUrl = `/getDealAllocationStats/${clientID}?startDate=${
    startDate.toISOString().split('T')[0]
  }&endDate=${endDate.toISOString().split('T')[0]}`;
  const [data, { loading, error }] = useFetch(fetchUrl);
  const csvFilename = `client-${clientID}-stats.csv`;

  const name = data?.name ? `, ${data.name}` : '';

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const chartData = useMemo(() => {
    if (!data?.stats?.length) {
      return [];
    }

    return data?.stats?.map((item) => ({
      name: item.provider,
      value: +item.percent,
      totalSize: convertBytesToIEC(item.total_deal_size)
    }));

  }, [data]);

  return (
    <div className="container">
      <PageHeading
        title={`Client ID: ${clientID}${name}`}
        subtitle="The page lists all the SPs used by the client"
        additionalContent={<ComplianceDownloadButton id={clientID} />}
      />

      <div className="tableSectionWrap">
        <TableHeading
          tabs={[
            {
              name: 'DC claims',
              url: `/clients/${clientID}/ddo-deals`
            },
            {
              name: `Verified deals prior to nv 22`,
              url: `/clients/${clientID}`
            },
            {
              name: 'Storage Providers breakdown',
              url: `/clients/${clientID}/breakdown`
            },
            {
              name: 'Allocations breakdown',
              url: `/clients/${clientID}/allocations`
            }
          ]}

          hideSearch={<div className={s.date_filters}>
            <div className={s.entry}>
              <label>From</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => {
                  if (!date) return;
                  if (Math.floor(date.getTime() / 1000) < 1598306400) {
                    return;
                  }
                  setStartDate(date);
                }}
                disabled={loading}
              />
            </div>
            <div className={s.entry}>
              <label>to</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => {
                  if (!date) return;
                  if (date > new Date()) {
                    return;
                  }
                  setEndDate(date);
                }}
                disabled={loading}
              />
            </div>
          </div>}

          csv={{
            table,
            fetchUrl,
            csvFilename,
            itemsCount: data?.stats?.length || 0
          }}
        />
        <div style={{
          backgroundColor: '#fff'
        }}>
          {
            error && <div style={{ padding: '2em' }}>
              Unable to prepare data
            </div>
          }
          <div className={cn('chartWrap', s.aspect3_2)}>
            {chartData && <ResponsiveContainer width={'100%'} aspect={1.5} debounce={500}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={'50%'}
                  innerRadius={'35%'}
                  fill="#8884d8"
                  dataKey="value"
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={onPieEnter}
                  cursor={'pointer'}
                  paddingAngle={1}
                  onClick={(val) => {
                    window.open(`/storage-providers/${val.name}`, '_blank');
                  }}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={palette(chartData.length, index)} cursor="pointer" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>}
          </div>
        </div>
      </div>
    </div>
  );
}

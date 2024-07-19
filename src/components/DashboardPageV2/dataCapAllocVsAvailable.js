import s from './s.module.css';
import { Cell, Pie, ResponsiveContainer, PieChart } from 'recharts';
import { palette } from '../../utils/colors';
import { useMemo } from 'react';
import { convertBytesToIEC } from '../../utils/bytes';
import cn from 'classnames';

const RADIAN = Math.PI / 180;

export const DataCapAllocVsAvailable = ({
                                          totalDataCap, usedDataCap, availableDataCap
                                        }) => {

  const data = useMemo(() => {
      const usedDataCapNum = +usedDataCap;
      const availableDataCapNum = +availableDataCap;
      if (isNaN(usedDataCapNum) || isNaN(availableDataCapNum)) {
        return undefined;
      }
      return [
        { name: 'Allocated', value: usedDataCapNum },
        { name: 'Available', value: availableDataCapNum }
      ];
    }, [usedDataCap, availableDataCap]);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return <svg>
      <text x={x + (50 * (!!index ? -1 : 1))} y={y-10} fill="black" textAnchor={x > cx ? 'start' : 'end'} style={{fontSize: 12}} dominantBaseline="central">
        {data[index].name}
      </text>
      {!index && <line x1={x-20} y1={y} x2={x + 105} y2={y} stroke={palette(2, index)} />}
      {!!index && <line x1={x-105} y1={y} x2={x + 20} y2={y} stroke={palette(2, index)} />}
      <text x={x + (70 * (!!index ? -1 : 1))} y={y+10} fill="grey" textAnchor={x > cx ? 'start' : 'end'} style={{fontSize: 10, fontWeight: 300}} dominantBaseline="central">
        {`${(percent * 100).toFixed(2)}%`}
      </text>
    </svg>
  };

  return <div className={cn(s.chartWrap, s.square)}>
    {data && <ResponsiveContainer width={'100%'} aspect={1} debounce={500}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={'50%'}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={palette(2, index)} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>}
  </div>;

};

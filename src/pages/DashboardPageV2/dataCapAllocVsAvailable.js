import s from './s.module.css';
import { Cell, Pie, ResponsiveContainer, PieChart, Sector } from 'recharts';
import { palette } from 'utils/colors';
import { useMemo } from 'react';
import { convertBytesToIEC } from 'utils/bytes';
import cn from 'classnames';

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
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{payload.name}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`${convertBytesToIEC(value)} (${payload.percent.toFixed(2)}%)`}
      </text>
    </g>
  );
};


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
        { name: 'Allocated', value: usedDataCapNum, percent: usedDataCapNum / totalDataCap * 100 },
        { name: 'Available', value: availableDataCapNum, percent: availableDataCapNum / totalDataCap * 100 }
      ];
    }, [usedDataCap, availableDataCap]);

  return <div className={cn('chartWrap', 'square')}>
    {data && <ResponsiveContainer width={'100%'} aspect={1} debounce={500}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={'50%'}
          innerRadius={'35%'}
          fill="#8884d8"
          dataKey="value"
          activeIndex={[0, 1]}
          activeShape={renderActiveShape}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={palette(2, index)} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>}
  </div>;

};

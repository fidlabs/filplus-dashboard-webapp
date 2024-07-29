import { Link, useParams } from 'react-router-dom';

import { useFetch, useFetchTable } from 'hooks/fetch';

import { PageHeading } from 'components/PageHeading';
import { TableHeading } from 'components/TableHeading';
import { convertBytesToIEC } from 'utils/bytes';
import { TableCustomBody } from '../TableCustomBody';
import { useMemo } from 'react';
import cn from 'classnames';
import s from '../DashboardPageV2/s.module.css';
import { Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { palette } from '../../utils/colors';
import { calculateDateFromHeight } from '../../utils/height';
import { ComplianceDownloadButton } from '../ComplianceDownloadButton';

export default function NotaryAllocationsOverview() {
  const { notaryID } = useParams();
  const fetchUrl = `/getVerifiedClients/${notaryID}`;
  const [results, { loading }] = useFetchTable(fetchUrl);

  const name = results?.name ? `, ${results.name}` : '';
  const remainingDatacap = results?.remainingDatacap
    ? convertBytesToIEC(results.remainingDatacap)
    : '';

  const groupedByHeight = useMemo(() => {
    if (!results) return [];
    console.log('groupedByHeight', Object.groupBy(results.data.sort((a, b) => a.createdAtHeight - b.createdAtHeight), val => val.createdAtHeight));
    return Object.groupBy(results.data.sort((a, b) => a.createdAtHeight - b.createdAtHeight), val => val.createdAtHeight);
  }, [results]);

  const parsedData = useMemo(() => {
    const newData = [];

    Object.entries(groupedByHeight).forEach(([key, value], index) => {
      const totalDatacap = newData[index - 1]?.value || 0;
      const valueParsed = value.reduce((acc, val) => acc + +val.initialAllowance, 0);
      newData.push({
        name: key,
        value: totalDatacap + valueParsed
      });
    });

    console.log('newData', newData);

    return newData;
  }, [groupedByHeight])

  return (
    <div className="container">
      <PageHeading
        title={`Allocator ID: ${notaryID}${name}`}
        subtitle={
          <>
            The page lists all the verified clients of the allocator.
            {remainingDatacap ? (
              <>
                <br />
                Amount DataCap remaining: {remainingDatacap}
              </>
            ) : null}
          </>
        }
        additionalContent={<ComplianceDownloadButton id={notaryID} />}
      />
      <div className="tableSectionWrap">
        <TableHeading
          hideSearch
          hideExport
          tabs={[
            {
              name: `${results?.count || 0} verified clients`,
              url: `/notaries/${notaryID}`,
            },
            {
              name: 'Allocations over time',
              url: `/notaries/${notaryID}/overview`,
            },
          ]}
        />
        <TableCustomBody>
          <div className={cn(s.chartWrap, s.wide)}>
            {!!parsedData.length && <ResponsiveContainer width="100%" aspect={2} debounce={500}>
              <LineChart
                data={parsedData}
                margin={{ top: 40, right: 50, left: 20, bottom: 20 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 12,
                    fontWeight: 500,
                    fill: 'var(--theme-text-secondary)'
                  }}
                  tickFormatter={(value) => calculateDateFromHeight(value)}
                />
                <YAxis
                  dataKey="value"
                  domain={[0, 'dataMax']}
                  tickFormatter={(value) => convertBytesToIEC(value)}
                  tick={{
                    fontSize: 12,
                    fontWeight: 500,
                    fill: 'var(--theme-text-secondary)'
                  }}
                />
                <Tooltip content={(props) => {
                  return <div className={s.chartTooltip}>
                    <div className={s.chartTooltipTitle}>{calculateDateFromHeight(props.label)}</div>
                    <div className={s.chartTooltipTitle}>Total to date - {convertBytesToIEC(props?.payload?.[0]?.value)}</div>
                    <div className={s.chartTooltipTitle} style={{marginTop: '16px'}}>New clients</div>
                    <div className={s.chartTooltipData}>
                      {
                        groupedByHeight[props.label]?.map((val, index) => {
                          return <div key={index}><Link href={`clients/${val.addressId}`} >{val.name}</Link> - {convertBytesToIEC(val.initialAllowance)}</div>
                        })
                      }
                    </div>
                  </div>
                }} />
                <Legend />
                <Line
                  name="Allocations over time"
                  type="monotone"
                  dataKey="value"
                  stroke={palette(8, 0)}
                />
              </LineChart>
            </ResponsiveContainer>}
          </div>
        </TableCustomBody>
      </div>
    </div>
  );
}

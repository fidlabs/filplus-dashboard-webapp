import { useParams } from 'react-router-dom';

import { useFetch } from 'hooks/fetch';

import { PageHeading } from 'components/PageHeading';
import { TableHeading } from 'components/TableHeading';
// import { TableControls } from 'components/TableControls';
import { Table } from 'components/Table';
import { ComplianceDownloadButton } from '../ComplianceDownloadButton';
import { useMemo, useState } from 'react';
import { Area, Bar, CartesianGrid, ComposedChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { convertBytesToIEC } from '../../utils/bytes';
import { calculateDateFromHeight } from '../../utils/height';
import s from '../DashboardPageV2/s.module.css';
import { palette } from '../../utils/colors';
import { scaleSymlog } from 'd3-scale';
import { ContentTabs } from '../ContentTabs';

const table = [
  {
    key: 'verifierAddressId',
    title: 'Allocator ID',
    linkPattern: '/notaries/:verifierAddressId'
  },
  {
    key: 'allowance',
    title: 'Total size',
    align: 'right',
    convertToIEC: true
  },
  {
    key: 'height',
    title: 'Height',
    align: 'right'
  }
];

const totalTable = [
  {
    key: 'verifierAddressId',
    title: 'Allocator ID',
    linkPattern: '/notaries/:verifierAddressId'
  },
  {
    key: 'allowance',
    title: 'Total size',
    align: 'right',
    convertToIEC: true
  }
];

export default function ClientAllocationPage() {
  const { clientID } = useParams();
  const fetchUrl = `/getVerifiedClients?filter=${clientID}`;
  const [data, { loading }] = useFetch(fetchUrl);

  const totalPerVerifier = {};
  const totalPerVerifierArray = [];
  if (!loading && data.data?.[0]?.allowanceArray) {
    for (const item of data.data?.[0]?.allowanceArray) {
      if (!totalPerVerifier[item.verifierAddressId]) {
        totalPerVerifier[item.verifierAddressId] = 0n;
      }
      totalPerVerifier[item.verifierAddressId] += BigInt(item.allowance);
    }

    for (const verifierAddressId in totalPerVerifier) {
      totalPerVerifierArray.push({
        verifierAddressId,
        allowance: totalPerVerifier[verifierAddressId]
      });
    }
  }

  const csvFilename = `client-${clientID}-stats.csv`;

  const name = data?.name ? `, ${data.name}` : '';

  const renderTooltip = (props) => {
    const allocationData = props?.payload?.[0]?.payload;
    if (!allocationData) return null;

    return <div className={s.chartTooltip}>
      <div className={s.chartTooltipTitle}>{calculateDateFromHeight(allocationData['height'])}</div>
      <div>
        <p>{`From: ${allocationData['verifierAddressId']}`}</p>
        <p>{`Allocated: ${convertBytesToIEC(allocationData['allowance'])}`}</p>
        <p>{`Total: ${convertBytesToIEC(allocationData['totalAllowance'])}`}</p>
      </div>

    </div>;

  };

  const chartData = useMemo(() => {

    if (!data?.data?.[0]?.allowanceArray) {
      return [];
    }

    const returnData = [];

    data?.data?.[0]?.allowanceArray.sort((a, b) => +a.height - +b.height).forEach((item) => {
      returnData.push({
        verifierAddressId: item.verifierAddressId,
        allowance: +item.allowance,
        height: item.height,
        auditTrail: item.auditTrail,
        totalAllowance: returnData.reduce((acc, cur) => acc + +cur.allowance, 0) + +item.allowance
      });
    });

    console.log(returnData);

    return returnData;

  }, [data]);

  return (
    <div className="container">
      <PageHeading
        title={`Client ID: ${clientID}${name}`}
        additionalContent={<ComplianceDownloadButton id={clientID} />}
        subtitle="The page lists all the allocations received by the client"
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
          hideSearch
          csv={{
            table,
            fetchUrl,
            csvFilename,
            itemsCount: data.data?.[0]?.allowanceArray?.length || 0
          }}
        />
        <div style={{
          backgroundColor: 'white'
        }}>
          <ContentTabs tabs={['Table view', 'Chart view']}>
            <Table
              table={table}
              data={data.data?.[0]?.allowanceArray}
              loading={loading}
              noControls
            />
            <div>
              {chartData && <ResponsiveContainer width="100%" height="100%" aspect={1.5} debounce={500}>
                <ComposedChart
                  width={500}
                  height={400}
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20
                  }}
                >
                  <CartesianGrid stroke="#f5f5f5" />
                  <XAxis dataKey="height" tickFormatter={(value) => calculateDateFromHeight(value)} />
                  <YAxis tickFormatter={(value) => convertBytesToIEC(value)} />
                  <Tooltip content={renderTooltip} />
                  <Legend />
                  <Area type="monotone" dataKey="totalAllowance" fill="#8884d8" stroke="#8884d8" />
                  <Bar dataKey="allowance" barSize={50} fill="#413ea0" />
                </ComposedChart>
              </ResponsiveContainer>}
            </div>
          </ContentTabs>
        </div>
      </div>
      <br />
      <div className="tableSectionWrap">
        <TableHeading title="Total size per allocator" hideSearch />
        <Table
          table={totalTable}
          data={totalPerVerifierArray}
          loading={loading}
          noControls
        />
      </div>
    </div>
  );
}

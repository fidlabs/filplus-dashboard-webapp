import { useParams } from 'react-router-dom';
import s from './s.module.css';
import { useFetch } from 'hooks/fetch';

import { PageHeading } from 'components/PageHeading';
import { TableHeading } from 'components/TableHeading';
// import { TableControls } from 'components/TableControls';
import { Table } from 'components/Table';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';
import { ComplianceDownloadButton } from '../ComplianceDownloadButton';

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

export default function ClientBreakdownPage() {
  const { clientID } = useParams();

  const auxEndDate = new Date();
  const auxStartDate = new Date(new Date().setDate(auxEndDate.getDate() - 30));

  const [startDate, setStartDate] = useState(auxStartDate);
  const [endDate, setEndDate] = useState(auxEndDate);
  const fetchUrl = `/getDealAllocationStats/${clientID}?startDate=${
    startDate.toISOString().split('T')[0]
  }&endDate=${endDate.toISOString().split('T')[0]}`;
  const [data, { loading }] = useFetch(fetchUrl);
  const csvFilename = `client-${clientID}-stats.csv`;

  const name = data?.name ? `, ${data.name}` : '';

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
        <Table table={table} data={data?.stats} loading={loading} noControls />
        {/*<TableControls totalItems={data?.stats?.length || 0} />*/}
      </div>
    </div>
  );
}

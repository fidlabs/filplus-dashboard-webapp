import { useFetchTable } from 'hooks/fetch';

import { PageHeading } from 'components/PageHeading';
import { TableHeading } from 'components/TableHeading';
import { TableControls } from 'components/TableControls';
import { Table } from 'components/Table';
import CronStats from 'components/CronStats';

const table = [
  {
    key: 'provider',
    title: 'Storage Provider ID',
    linkPattern: '/storage-providers/:provider',
  },
  {
    key: 'noOfDeals',
    title: 'Number of deals per storage provider',
    align: 'right',
  },
  {
    key: 'dealsTotalSize',
    title: 'DataCap received by storage provider',
    convertToIEC: true,
    align: 'right',
  },
  {
    key: 'noOfClients',
    title: 'Number of clients per storage provider',
    linkPattern: '/storage-providers/:provider',
    align: 'right',
  },
  {
    key: 'avgDealLength',
    title: 'Avg. deal length',
    align: 'right',
    formatTime: true,
  },
  {
    key: 'avgDealPrice',
    title: 'Avg. deal price',
    align: 'right',
    formatFil: true,
  },
  {
    key: 'minDealSize',
    title: 'Minimum deal size',
    convertToIEC: true,
    align: 'right',
  },
];

export default function MinersPage() {
  const fetchUrl = '/getMiners';
  const [results, { loading }] = useFetchTable(fetchUrl);
  const csvFilename = 'storage-providers.csv';

  return (
    <div className="container">
      <div className="tableSectionWrap">
        <TableHeading
          title={`${results?.count || 0} storage providers`}
          searchPlaceholder="Storage Provider ID"
          csv={{
            table,
            fetchUrl,
            csvFilename,
            itemsCount: results?.count || 0,
          }}
        />
        <Table table={table} data={results.data} loading={loading} />
        <TableControls totalItems={results?.count || 0} />
      </div>
      <CronStats
        dashboardCrons={['processDataForMiners']}
        scraperCrons={['getAllowanceAuditTrail', 'updateMinerInfo']}
      ></CronStats>
    </div>
  );
}

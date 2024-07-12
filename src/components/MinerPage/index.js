import { useParams } from 'react-router-dom';

import { useFetchTable } from 'hooks/fetch';

import { PageHeading } from 'components/PageHeading';
import { TableHeading } from 'components/TableHeading';
import { TableControls } from 'components/TableControls';
import { Table } from 'components/Table';

const table = [
  {
    key: 'verifiedClientAddressId',
    title: 'Client ID',
    linkPattern: '/clients/:verifiedClientAddressId',
  },
  {
    key: 'no_of_deals',
    title: 'Number of deals',
    align: 'right',
    linkPattern: '/clients/:verifiedClientAddressId',
  },
  {
    key: 'avg_deal_length',
    title: 'Avg. deal length',
    align: 'right',
    formatTime: true,
  },
  {
    key: 'avg_deal_price',
    title: 'Avg. deal price',
    align: 'right',
    formatFil: true,
  },
  {
    key: 'lastdealstart',
    title: 'Last deal start epoch',
    align: 'right',
  },
  {
    key: 'allocation_percent',
    title: 'Percent of DataCap allocated by client',
    align: 'right',
    suffix: '%',
  },
];

export default function MinerPage() {
  const { minerID } = useParams();
  const fetchUrl = `/getMinerInfo/${minerID}`;
  const [results, { loading }] = useFetchTable(fetchUrl);
  const csvFilename = `storage-provider-${minerID}.csv`;

  const name = results?.name ? `, ${results.name}` : '';

  return (
    <div className="container">
      <PageHeading
        title={`Storage Provider ID: ${minerID}${name}`}
        subtitle="The page lists all the verified clients of the allocator"
        searchPlaceholder="Client ID"
      />
      <div className="tableSectionWrap">
        <TableHeading
          title={`${results?.count || 0} verified clients`}
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
    </div>
  );
}

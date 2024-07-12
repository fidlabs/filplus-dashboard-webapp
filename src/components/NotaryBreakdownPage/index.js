import { useParams } from 'react-router-dom';

import { useFetch } from 'hooks/fetch';

import { PageHeading } from 'components/PageHeading';
import { TableHeading } from 'components/TableHeading';
// import { TableControls } from 'components/TableControls';
import { Table } from 'components/Table';
import { convertBytesToIEC } from 'utils/bytes';

const table = [
  { key: 'provider', title: 'Storage Provider ID' },
  {
    key: 'percent',
    title: '% of total DataCap used by clients',
    align: 'right',
    suffix: '%',
  },
  {
    key: 'percent_from_total_allocated',
    title: '% of total DataCap allocated by allocator',
    align: 'right',
    suffix: '%',
  },
  {
    key: 'total_deal_size',
    title: 'Total size',
    align: 'right',
    convertToIEC: true,
  },
];

export default function NotaryBreakdownPage() {
  const { notaryID } = useParams();
  const fetchUrl = `/getDealAllocationStatsByVerifier/${notaryID}`;
  const [data, { loading }] = useFetch(fetchUrl);
  const csvFilename = `allocator-${notaryID}-breakdown.csv`;

  const name = data?.name ? `, ${data.name}` : '';
  const remainingDatacap = data?.remainingDatacap
    ? convertBytesToIEC(data.remainingDatacap)
    : '';

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
        searchPlaceholder=""
      />
      <div className="tableSectionWrap">
        <TableHeading
          tabs={[
            {
              name: `${data?.verifiedClientCount || 0} verified clients`,
              url: `/notaries/${notaryID}`,
            },
            {
              name: 'Storage Providers breakdown',
              url: `/notaries/${notaryID}/breakdown`,
            },
            {
              name: `${data?.ldnActivityCount || 0} LDN Activity`,
              url: `/notaries/${notaryID}/ldn-activity`,
            },
          ]}
          csv={{
            table,
            fetchUrl,
            csvFilename,
            itemsCount: data?.stats?.length || 0,
          }}
        />
        <Table table={table} data={data?.stats} loading={loading} noControls />
        {/*<TableControls totalItems={data?.stats?.length || 0} />*/}
      </div>
    </div>
  );
}

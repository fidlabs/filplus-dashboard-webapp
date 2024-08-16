import { useParams } from 'react-router-dom';

import { useFetchTable } from 'hooks/fetch';

import { PageHeading } from 'components/PageHeading';
import { TableHeading } from 'components/TableHeading';
import { TableControls } from 'components/TableControls';
import { Table } from 'components/Table';
import { convertBytesToIEC } from 'utils/bytes';
import { ComplianceDownloadButton } from '../ComplianceDownloadButton';

const table = [
  {
    key: 'verifierAddressId',
    title: 'Allocator ID',
    linkPattern: '/notaries/:verifierAddressId',
  },
  { key: 'dealId', title: 'Verified Deal ID' },
  { key: 'provider', title: 'Storage Provider ID' },
  { key: 'createdAtHeight', title: 'Height', align: 'right' },
  {
    key: 'dealSize',
    title: 'Size',
    sort: {
      key: 'dealSize',
      ascName: 'Size Asc.',
      descName: 'Size Desc.',
    },
    align: 'right',
    convertToIEC: true,
  },
];

export default function ClientPage() {
  const { clientID } = useParams();
  const fetchUrl = `/getVerifiedDeals/v2/${clientID}`;
  const [results, { loading }] = useFetchTable(fetchUrl);
  const csvFilename = `client-${clientID}.csv`;

  const name = results?.name ? `, ${results.name}` : '';
  const remainingDatacap = results?.remainingDatacap
    ? convertBytesToIEC(results.remainingDatacap)
    : '';
  const allocatedDatacap = results?.allocatedDatacap
    ? convertBytesToIEC(results.allocatedDatacap)
    : '';
  const daAllocatedDatacap = results?.daAllocatedDatacap
    ? convertBytesToIEC(results.daAllocatedDatacap)
    : '';
  const ldnAllocatedDatacap = results?.ldnAllocatedDatacap
    ? convertBytesToIEC(results.ldnAllocatedDatacap)
    : '';
  const efilAllocatedDatacap = results?.efilAllocatedDatacap
    ? convertBytesToIEC(results.efilAllocatedDatacap)
    : '';
  const autoverifierAllocatedDatacap = results?.autoverifierAllocatedDatacap
    ? convertBytesToIEC(results.autoverifierAllocatedDatacap)
    : '';

  return (
    <div className="container">
      <PageHeading
        title={`Client ID: ${clientID}${name}`}
        additionalContent={<ComplianceDownloadButton id={clientID} />}
        subtitle={
          <>
            The page lists all the verified clients of the allocator.
            {remainingDatacap ? (
              <>
                <br />
                DataCap remaining: {remainingDatacap}
              </>
            ) : null}
            {allocatedDatacap ? (
              <>
                Allocated DataCap: {allocatedDatacap}
              </>
            ) : null}
          </>
        }
      />
      <div className="tableSectionWrap">
        <TableHeading
          tabs={[
            {
              name: 'DC claims',
              url: `/clients/${clientID}/ddo-deals`,
            },
            {
              name: `Verified deals prior to nv 22`,
              url: `/clients/${clientID}`,
            },
            {
              name: 'Storage Providers breakdown',
              url: `/clients/${clientID}/breakdown`,
            },
            {
              name: 'Allocations breakdown',
              url: `/clients/${clientID}/allocations`,
            },
          ]}
          searchPlaceholder="Verified Deal ID / Storage Provider ID"
          csv={{
            directDownload: true,
            table,
            fetchUrl: `/buildClientDealJSON/${clientID}`,
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

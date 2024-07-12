import { useParams } from 'react-router-dom';

import { useFetchTable } from 'hooks/fetch';

import { PageHeading } from 'components/PageHeading';
import { TableHeading } from 'components/TableHeading';
import { TableControls } from 'components/TableControls';
import { Table } from 'components/Table';
import { convertBytesToIEC } from 'utils/bytes';

const table = [
  {
    key: 'addressId',
    title: 'Verified Client ID',
    sort: {
      key: 'addressId',
      ascName: 'Verified Client ID Asc.',
      descName: 'Verified Client ID Desc.',
    },
    githubLinkKey: 'auditTrail',
    linkPattern: '/clients/:addressId',
  },
  {
    key: 'composite',
    title: 'Client Name',
    shrinkable: true,
    compositeOptions: {
      keys: ['name', 'orgName'],
      pattern: `:name - (:orgName)`,
    },
  },
  {
    key: 'verifierAddressId',
    title: 'Allocator Address ID',
    sort: {
      key: 'verifierAddressId',
      ascName: 'Allocator Address ID Asc.',
      descName: 'Allocator Address ID Desc.',
    },
    linkPattern: '/notaries/:verifierAddressId',
  },
  {
    key: 'dealCount',
    title: 'Verified Deals',
    align: 'right',
    linkPattern: '/clients/:addressId',
  },
  {
    key: 'providerCount',
    title: 'Provider Count',
    align: 'right',
  },
  {
    key: 'signerDatacapAllocatedAmount',
    title: 'Amount given by this allocator across allocations',
    align: 'right',
    convertToIEC: true,
    customLink: {
      itemKeysAsParamsInOrder: [
        { value: 'addressId' },
        { value: 'notaryID', overrideWithRouteParam: true },
      ],
      linkPattern: '/large-datasets?filter=$$$&highlight=$$$',
    },
  },
  {
    key: 'allowance',
    title: 'DataCap Available',
    align: 'right',
    sort: {
      key: 'allowance',
      ascName: 'DataCap Available Asc.',
      descName: 'DataCap Available Desc.',
    },
    convertToIEC: true,
  },
  {
    key: 'ldnAllowanceCount',
    title: 'LDN Allowance Count',
    align: 'right',
    customLink: {
      itemKeysAsParamsInOrder: [
        { value: 'addressId' },
        { value: 'notaryID', overrideWithRouteParam: true },
      ],
      linkPattern: '/large-datasets?filter=$$$&highlight=$$$',
    },
  },
];

export default function NotaryLdnActivityPage() {
  const { notaryID } = useParams();
  const fetchUrl = `/getClientsOfLdnSigner/${notaryID}`;
  const [results, { loading }] = useFetchTable(fetchUrl);
  const csvFilename = `allocator-${notaryID}.csv`;

  const name = results?.name ? `, ${results.name}` : '';
  const remainingDatacap = results?.remainingDatacap
    ? convertBytesToIEC(results.remainingDatacap)
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
        searchPlaceholder="Verified Client ID / Address"
      />
      <div className="tableSectionWrap">
        <TableHeading
          tabs={[
            {
              name: `${results?.verifiedClientCount || 0} verified clients`,
              url: `/notaries/${notaryID}`,
            },
            {
              name: 'Storage Providers breakdown',
              url: `/notaries/${notaryID}/breakdown`,
            },
            {
              name: `${results?.count || 0} LDN Activity`,
              url: `/notaries/${notaryID}/ldn-activity`,
            },
          ]}
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

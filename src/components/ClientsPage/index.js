import { useFetchTable } from 'hooks/fetch';

import { TableControls } from 'components/TableControls';
import { TableHeading } from 'components/TableHeading';
import { PageHeading } from 'components/PageHeading';
import { Table } from 'components/Table';
import CronStats from 'components/CronStats';

const table = [
  {
    key: 'addressId',
    title: 'Verified Client ID',
    githubLinkKey: 'auditTrailProcessed',
    linkPattern: '/clients/:addressId/ddo-deals',
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
  { key: 'address', title: 'Address', canBeCopied: true },
  {
    key: 'verifierAddressId',
    title: 'Allocator ID',
    linkPattern: '/notaries/:verifierAddressId',
  },
  {
    key: 'verifierName',
    title: 'Allocator Name',
  },
  {
    key: 'dealCount',
    title: 'Verified Deals',
    align: 'right',
    linkPattern: '/clients/:addressId/ddo-deals',
  },
  {
    key: 'providerCount',
    title: 'Storage Providers with Verified Deals',
    align: 'right',
  },
  {
    key: 'topProvider',
    title: 'Top Allocation',
    suffix: '%',
  },
  {
    key: 'initialAllowance',
    title: 'DataCap Allocated',
    sort: {
      key: 'initialAllowance',
      ascName: 'DataCap Allocated Asc.',
      descName: 'DataCap Allocated Desc.',
    },
    align: 'right',
    convertToIEC: true,
    tooltip: {
      key: 'allowanceArray',
      values: [
        {
          key: 'verifierAddressId',
          name: 'Address ID',
        },
        {
          key: 'allowance',
          name: 'Value',
          convertToIEC: true,
        },
        {
          key: 'height',
          name: 'Height',
        },
        {
          key: 'height',
          name: 'Creation Date',
          convertToDate: true,
        },
      ],
    },
  },
  {
    key: 'allowance',
    title: 'DataCap Available',
    sort: {
      key: 'allowance',
      ascName: 'DataCap Available Asc.',
      descName: 'DataCap Available Desc.',
    },
    align: 'right',
    convertToIEC: true,
  },
  {
    key: 'receivedDatacapChange',
    title: 'DataCap Received Last 2 Weeks',
    sort: {
      key: 'receivedDatacapChange',
      ascName: 'DataCap Received Last 2 Weeks Asc.',
      descName: 'DataCap Received Last 2 Weeks Desc.',
    },
    align: 'right',
    convertToIEC: true,
  },
  {
    key: 'usedDatacapChange',
    title: 'DataCap Used Last 2 Weeks',
    sort: {
      key: 'usedDatacapChange',
      ascName: 'DataCap Used Last 2 Weeks Asc.',
      descName: 'DataCap Used Last 2 Weeks Desc.',
    },
    align: 'right',
    convertToIEC: true,
  },
];

export default function ClientsPage() {
  const fetchUrl = '/getVerifiedClients';
  const [results, { loading }] = useFetchTable(fetchUrl);

  for (const row of results.data) {
    if (row.allowanceArray[0]?.auditTrail) {
      row.auditTrailProcessed = row.allowanceArray[0].auditTrail;
    } else {
      row.auditTrailProcessed = row.auditTrail;
    }
  }

  const csvFilename = 'clients.csv';

  return (
    <div className="container">
      <div className="tableSectionWrap">
        <TableHeading
          title={`${results?.count || 0} clients`}
          searchPlaceholder="Verified Client ID / Client Name / Address / Allocator ID / Allocator Name"
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
        dashboardCrons={['processDataForVerifiedClients']}
        scraperCrons={[
          'getAllowanceAuditTrail',
          'getVerifiedRegistryMessages',
          'processVerifiedRegistryMessages',
          'upsertDealData',
        ]}
      ></CronStats>
    </div>
  );
}

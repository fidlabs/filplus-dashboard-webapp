import { useFetchTable } from 'hooks/fetch';
import s from './s.module.css';
import { TableControls } from 'components/TableControls';
import { TableHeading } from 'components/TableHeading';
import { PageHeading } from 'components/PageHeading';
import { Table } from 'components/Table';
import CronStats from 'components/CronStats';
import { LoadingValue } from '../LoadingValue';

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
  {
    key: 'initialAllowance',
    title: 'DataCap Received',
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
      <h2 className="h1">Clients</h2>
      <div className="grid">
        <div className="card size3">
          <div className="cardTitle">
            <span>Filecoin clients</span>
          </div>
          <div className="cardData">
            <LoadingValue
              value={results?.count}
              loading={loading}
            />
          </div>
        </div>
        <div className="size6">
          <div className="tableSectionWrap">
            <TableHeading
              title="Clients list"
              searchPlaceholder="Verified Client ID / Client Name / Address / Allocator ID / Allocator Name"
              csv={{
                table,
                fetchUrl,
                csvFilename,
                itemsCount: results?.count || 0
              }}
            />
            <Table table={table} data={results.data} loading={loading} />
            <TableControls totalItems={results?.count || 0} />
          </div>
        </div>
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

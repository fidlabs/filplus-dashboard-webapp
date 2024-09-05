import { useFetchTable } from 'hooks';
import { PageHeading, TableHeading, TableControls, Table, CronStats} from 'components';
import { CUSTOM_LINK_TYPE } from 'components/Table/utils';

const table = [
  {
    key: 'allowanceId',
    title: 'Allocation ID',
    customLink: [
      {
        type: CUSTOM_LINK_TYPE.NO_LINK,
      },
      {
        itemKeysAsParamsInOrder: [{ value: 'auditTrail' }],
        linkPattern: '$$$',
        type: CUSTOM_LINK_TYPE.GITHUB,
      },
      {
        itemKeysAsParamsInOrder: [
          {
            value: (item) =>
              item.signers.find((signer) => signer.method === 2)?.msgCID,
          },
        ],
        linkPattern: 'https://filfox.info/en/message/$$$',
        type: CUSTOM_LINK_TYPE.FILFOX,
      },
    ],
  },
  {
    key: 'clientAddressId',
    title: 'Client ID',
    sort: {
      key: 'clientAddressId',
      ascName: 'Client ID Asc.',
      descName: 'Client ID Desc.',
    },
    linkPattern: '/clients/:clientAddressId',
  },
  {
    key: 'clientName',
    title: 'Client Name',
    shrinkable: true,
  },
  {
    key: 'clientAddress',
    title: 'Client Address',
    canBeCopied: true,
  },
  {
    key: 'signers',
    title: 'Signers',
    renderCallback: (signer) => signer.shortName || signer.addressId,
    tooltipRenderCallback: (signer) => signer.fullName || signer.addressId,
    linkPattern: '/notaries/:addressId/ldn-activity',
  },
  {
    key: 'allowanceNumber',
    title: 'Allowance Number',
    align: 'right',
  },
  {
    key: 'datacapAllocated',
    title: 'Amount Allocated',
    sort: {
      key: 'datacapAllocated',
      ascName: 'Amount Allocated Asc.',
      descName: 'Amount Allocated Desc.',
    },
    align: 'right',
    convertToIEC: true,
  },
  {
    key: 'timestamp',
    title: 'Date',
    sort: {
      key: 'timestamp',
      ascName: 'Date Asc.',
      descName: 'Date Desc.',
    },
  },
  {
    key: 'ttd',
    title: 'TTD for allocation',
    formatTime: true,
  },
  {
    key: 'topProvider',
    suffix: '%',
    title: 'Top Provider',
  },
];

export default function LargeDatasetsPage() {
  const fetchUrl = '/getLdnAllowances';
  const [results, { loading }] = useFetchTable(fetchUrl);
  let dataCopy = [...results.data];
  dataCopy = dataCopy.map((row) => ({ ...row }));

  for (const row of dataCopy) {
    if (row.timestamp) {
      row.timestamp = new Date(row.timestamp * 1000).toDateString();
    }
  }

  const csvFilename = 'large_datasets.csv';

  return (
    <div className="container">
      <PageHeading
        title="Large datasets"
        searchPlaceholder="Client or Signer Id / Address / Name"
      />
      <div className="tableSectionWrap">
        <TableHeading
          title={`${results?.count || 0} allocations`}
          csv={{
            table,
            fetchUrl,
            csvFilename,
            itemsCount: results?.count || 0,
          }}
        />
        <Table table={table} data={dataCopy} loading={loading} />
        <TableControls totalItems={results?.count || 0} />
      </div>

      <CronStats
        dashboardCrons={['processDataForVerifiedClientLdnAllowances']}
        scraperCrons={[
          'getAllowanceAuditTrail',
          'getVerifiedRegistryMessages',
          'processVerifiedRegistryMessages',
          'computeTTD',
        ]}
      ></CronStats>
    </div>
  );
}

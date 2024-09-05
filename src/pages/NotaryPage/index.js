import { useParams } from 'react-router-dom';
import { useFetchTable } from 'hooks';
import { PageHeading, TableHeading, TableControls, Table, ComplianceDownloadButton } from 'components';
import { convertBytesToIEC } from 'utils/bytes';

const table = [
  {
    key: 'addressId',
    title: 'Client ID',
    sort: {
      key: 'addressId',
      ascName: 'Verified Client ID Asc.',
      descName: 'Verified Client ID Desc.',
    },
    githubLinkKey: 'auditTrail',
    linkPattern: '/clients/:addressId',
  },
  {
    key: 'name',
    title: 'Client Name',
    sort: {
      key: 'name',
      ascName: 'Name Asc.',
      descName: 'Name Desc.',
    },
    linkPattern: '/clients/:addressId',
  },
  {
    key: 'initialAllowance',
    title: 'Total DC received',
    align: 'right',
    sort: {
      key: 'initialAllowance',
      ascName: 'DataCap Allocated Asc.',
      descName: 'DataCap Allocated Desc.',
    },
    convertToIEC: true,
    tooltip: {
      key: 'allowanceArray',
      filterCallback: (value, index, self) => self.findIndex(s => s.msgCID	=== value.msgCID) === index,
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
          name: 'Date',
          convertToDate: true,
          tooltip: {
            key: 'height',
            singleValue: true,
          }
        },
      ],
    },
  },
  {
    key: 'allowance',
    title: 'Unused DataCap',
    align: 'right',
    sort: {
      key: 'allowance',
      ascName: 'DataCap Available Asc.',
      descName: 'DataCap Available Desc.',
    },
    convertToIEC: true,
  },
  {
    key: 'providerCount',
    title: 'Provider Count',
    align: 'right',
    tooltip: 'Number of SPs this client uses'
  },
  {
    key: 'address',
    title: 'Address',
    canBeCopied: true,
    align: 'right',
  },
];

export default function NotaryPage() {
  const { notaryID } = useParams();
  const fetchUrl = `/getVerifiedClients/${notaryID}`;
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
        additionalContent={<ComplianceDownloadButton id={results.addressId} />}
      />
      <div className="tableSectionWrap">
        <TableHeading
          tabs={[
            {
              name: `${results?.count || 0} verified clients`,
              url: `/notaries/${notaryID}`,
            },
            {
              name: 'Allocations over time',
              url: `/notaries/${notaryID}/overview`,
            },
          ]}
        />
        <Table table={table} data={results.data} loading={loading} />
        <TableControls totalItems={results?.count || 0} />
      </div>
    </div>
  );
}

import { useParams } from 'react-router-dom';

import { useFetch } from 'hooks/fetch';

import { PageHeading } from 'components/PageHeading';
import { TableHeading } from 'components/TableHeading';
// import { TableControls } from 'components/TableControls';
import { Table } from 'components/Table';

const table = [
  {
    key: 'verifierAddressId',
    title: 'Allocator ID',
    linkPattern: '/notaries/:verifierAddressId',
  },
  {
    key: 'allowance',
    title: 'Total size',
    align: 'right',
    convertToIEC: true,
  },
  {
    key: 'height',
    title: 'Height',
    align: 'right',
  },
];

const totalTable = [
  {
    key: 'verifierAddressId',
    title: 'Allocator ID',
    linkPattern: '/notaries/:verifierAddressId',
  },
  {
    key: 'allowance',
    title: 'Total size',
    align: 'right',
    convertToIEC: true,
  },
];

export default function ClientAllocationPage() {
  const { clientID } = useParams();
  const fetchUrl = `/getVerifiedClients?filter=${clientID}`;
  const [data, { loading }] = useFetch(fetchUrl);

  const totalPerVerifier = {};
  const totalPerVerifierArray = [];
  if (!loading && data.data?.[0]?.allowanceArray) {
    for (const item of data.data?.[0]?.allowanceArray) {
      if (!totalPerVerifier[item.verifierAddressId]) {
        totalPerVerifier[item.verifierAddressId] = 0n;
      }
      totalPerVerifier[item.verifierAddressId] += BigInt(item.allowance);
    }

    for (const verifierAddressId in totalPerVerifier) {
      totalPerVerifierArray.push({
        verifierAddressId,
        allowance: totalPerVerifier[verifierAddressId],
      });
    }
  }

  const csvFilename = `client-${clientID}-stats.csv`;

  const name = data?.name ? `, ${data.name}` : '';

  return (
    <div className="container">
      <PageHeading
        title={`Client ID: ${clientID}${name}`}
        subtitle="The page lists all the allocations received by the client"
        searchPlaceholder=""
      />
      <div className="tableSectionWrap">
        <TableHeading
          tabs={[
            {
              name: 'DC claims',
              url: `/clients/${clientID}/ddo-deals`,
            },
            {
              name: `${data?.dealCount || 0} verified deals prior to nv 22`,
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
          csv={{
            table,
            fetchUrl,
            csvFilename,
            itemsCount: data.data?.[0]?.allowanceArray?.length || 0,
          }}
        />
        <Table
          table={table}
          data={data.data?.[0]?.allowanceArray}
          loading={loading}
          noControls
        />
      </div>
      <br />
      <div className="tableSectionWrap">
        <TableHeading title="Total size per allocator" />
        <Table
          table={totalTable}
          data={totalPerVerifierArray}
          loading={loading}
          noControls
        />
      </div>
    </div>
  );
}

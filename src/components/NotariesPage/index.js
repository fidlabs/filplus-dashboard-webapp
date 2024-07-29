import { useFetchTable } from 'hooks/fetch';
import { TableHeading } from 'components/TableHeading';
import { TableControls } from 'components/TableControls';
import { Table } from 'components/Table';
import { useCallback, useEffect, useReducer, useState } from 'react';
import ReactDOM from 'react-dom';
import { useQueryParams } from '../../hooks/queryParams';
import CronStats from 'components/CronStats';

const table = [
  {
    key: 'addressId',
    title: 'Allocator ID',
    githubLinkKey: 'auditTrailProcessed',
    linkPattern: '/notaries/:addressId',
    sort: {
      key: 'addressId',
      ascName: 'Allocator ID Asc.',
      descName: 'Allocator ID Desc.',
    },
  },
  {
    key: 'name',
    title: 'Name',
    shrinkable: true,
    linkPattern: '/notaries/:addressId',
  },
  {
    key: 'orgName',
    title: 'Organisation',
    shrinkable: true,
  },
  {
    key: 'verifiedClientsCount',
    title: 'Verified Clients',
    align: 'right',
    tooltip: 'Number of SPs this client uses'
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
    key: 'remainingDatacap',
    title: 'Used DataCap',
    align: 'right',
    sort: {
      key: 'remainingDatacap',
      ascName: 'Used DataCap Asc.',
      descName: 'Used DataCap Desc.',
    },
    convertToIEC: true,
  },
  {
    key: 'initialAllowance',
    title: 'Total DataCap Received',
    sort: {
      key: 'initialAllowance',
      ascName: 'DataCap Allocated Asc.',
      descName: 'DataCap Allocated Desc.',
    },
    align: 'right',
    convertToIEC: true,
    tooltip: {
      key: 'allowanceArray',
      filterCallback: (value, index, self) => self.findIndex(s => s.msgCID	=== value.msgCID) === index,
      values: [
        {
          key: 'allowance',
          name: 'Value',
          convertToIEC: true,
        },
        {
          key: 'height',
          name: 'Height',
          convertToDate: true,
        },
      ],
    },
  },
  {
    key: 'createdAtHeight',
    title: 'Create date',
    align: 'right',
    convertToDate: true,
    tooltip: {
      key: 'createdAtHeight',
      singleValue: true,
    }
  },
  {
    key: 'address',
    title: 'Address',
    canBeCopied: true,
  },
];

const csvTable = JSON.parse(JSON.stringify(table));
csvTable.push({
  key: 'removed',
  title: 'Allocator deprecated',
});

export default function NotariesPage() {
  const fetchUrl = '/getVerifiers';
  const [query, setQuery] = useQueryParams();
  const [showInactive, setShowInactive] = useState(
    query.showInactive !== undefined ? query.showInactive === 'true' : false
  );

  const [results, { loading }] = useFetchTable(
    fetchUrl,
    [showInactive],
    (queryParams, [showInactiveFromCaller]) => {
      if (showInactiveFromCaller !== undefined) {
        queryParams.set('showInactive', showInactiveFromCaller);
      }
    }
  );
  let dataCopy = [...results.data];
  dataCopy = dataCopy.map((row) => ({ ...row }));

  for (const row of dataCopy) {
    if (row.removed && row.name) {
      row.name = `Deprecated - ${row.name}`;
    }

    if (row.allowanceArray[0].auditTrail) {
      row.auditTrailProcessed = row.allowanceArray[0].auditTrail;
    } else {
      row.auditTrailProcessed = row.auditTrail;
    }
  }
  const csvFilename = 'allocators.csv';

  const [portalContainer, setPortalContainer] = useState(null);

  const portalRef = useCallback(
    (node) => {
      if (node !== null) {
        setPortalContainer(
          ReactDOM.createPortal(
            <>
              <span
                style={{
                  color: 'var(--theme-text-secondary)',
                  fontWeight: 500,
                }}
              >
                Show inactive
              </span>
              <input
                type="checkbox"
                style={{ width: 20, height: 20, cursor: 'pointer' }}
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
              />
            </>,
            node
          )
        );
      }
    },
    [showInactive]
  );

  useEffect(() => {
    setQuery((params) => ({ ...params, showInactive }));
  }, [showInactive]);

  console.log(results)

  return (
    <div className="container">
      <div className="tableSectionWrap">
        <TableHeading
          title={`${results?.count || 0} allocators`}
          searchPlaceholder="Allocator ID / Address / Name"
          csv={{
            table: csvTable,
            fetchUrl,
            csvFilename,
            itemsCount: results?.count || 0,
          }}
          portalRef={portalRef}
        />
        {portalContainer}
        <Table table={table} data={dataCopy} loading={loading} />
        <TableControls totalItems={results?.count || 0} />
      </div>
      <CronStats
        dashboardCrons={['processDataForVerifiers']}
        scraperCrons={[
          'getAllowanceAuditTrail',
          'getVerifiedRegistryMessages',
          'processVerifiedRegistryMessages',
        ]}
      ></CronStats>
    </div>
  );
}

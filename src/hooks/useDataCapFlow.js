import { useCallback, useMemo } from 'react';
import { convertBytesToIEC } from '../utils/bytes';
import { useFetch } from './fetch';

const PB_10 = 10 * 1024 * 1024 * 1024 * 1024 * 1024;
const PB_15 = 15 * 1024 * 1024 * 1024 * 1024 * 1024;

const useDataCapFlow = () => {
  const fetchUrl = '/get-dc-flow-graph-grouped-by-audit-status';
  const [data, { loading, loaded }] = useFetch(fetchUrl);

  const getName = useCallback((key) => {
    switch (key) {
      case 'rkh':
        return 'Root Key Holder';
      case 'inactiveAllocators':
        return 'Inactive Allocators';
      case 'activeAllocators':
        return 'Active Allocators';
      case 'passedAudit':
        return 'Passed Audit';
      case 'passedAuditConditionally':
        return 'Passed Audit Conditionally';
      case 'failedAudit':
        return 'Failed Audit';
      case 'notAudited':
        return 'Not Audited';
      default:
        return key;
    }
  }, [])

  const countChildAllocators = useCallback((data) => {
    if (data?.datacap) {
      return undefined;
    }

    if (data?.allocators?.length) {
      return data.allocators.length;
    } else {
      return Object.entries(data).reduce((acc, [key, data]) => {
        return acc + countChildAllocators(data);
      }, 0);
    }
  }, [])

  const groupAllocators = useCallback((allocators, skipUnique) => {

    const uniqueAllocationValues = [...new Set(allocators.map(a => a.datacap))];

    if (uniqueAllocationValues.length > 3 && !skipUnique) {
      const datacapAllocatorsGrouped = Object.groupBy(Object.values(allocators), item => {
        if (item.datacap < PB_10) {
          return '<10 PiB';
        } else if (item.datacap < PB_15) {
          return '>10 PiB & <15 PiB';
        } else {
          return '>15 PiB';
        }
      });
      return Object.entries(datacapAllocatorsGrouped).map(([key, data]) => {
        return {
          name: key,
          attributes: {
            datacap: data.reduce((acc, curr) => acc + +curr.datacap, 0),
            allocators: data.length
          },
          children: groupAllocators(data, true)
        };
      });
    } else {
      const datacapAllocatorsGrouped = Object.groupBy(Object.values(allocators), item => convertBytesToIEC(+item.datacap));

      if (Object.keys(datacapAllocatorsGrouped).length === 1) {
        return Object.values(datacapAllocatorsGrouped)[0].map((data) => {
          return {
            name: data.name ?? data.addressId,
            attributes: {
              datacap: +data.datacap,
              id: data.addressId
            },
            children: undefined
          };
        });
      }

      return Object.entries(datacapAllocatorsGrouped).map(([key, data]) => {
        if (data.length === 1) {
          return {
            name: data[0].name ?? data[0].addressId,
            attributes: {
              datacap: +data[0].datacap,
              id: data[0].addressId
            },
            children: undefined
          };
        }
        return {
          name: key,
          attributes: {
            datacap: data.reduce((acc, curr) => acc + +curr.datacap, 0),
            allocators: data.length
          },
          children: data.map((data) => {
            return {
              name: data.name ?? data.addressId,
              attributes: {
                datacap: +data.datacap,
                id: data.addressId
              },
              children: undefined
            };
          })
        };
      });
    }
  }, [])

  const parseChildren = useCallback((data) => {
    if (data?.allocators?.length) {
      if (data?.allocators?.length > 10) {
        return groupAllocators(data.allocators);
      }
      return data.allocators.map((data) => {
        return {
          name: data.name ?? data.addressId,
          attributes: {
            datacap: +data.datacap,
            id: data.addressId
          },
          children: undefined
        };
      });
    } else {
      return Object.entries(data).map(([key, data]) => {
        return {
          name: getName(key),
          attributes: {
            datacap: data.totalDc ? +data.totalDc : Object.values(data).reduce((acc, val) => acc + +val.totalDc, 0),
            allocators: countChildAllocators(data)
          },
          children: parseChildren(data)
        };
      });
    }
  }, []);

  const dataCapFlow = useMemo(() => {
    return Object.entries(data).map(([key, data]) => {
      const children = parseChildren(data);
      return {
        name: getName(key),
        children,
        attributes: {
          datacap: children.reduce((acc, curr) => acc + +curr.attributes.datacap, 0),
          allocators: children.reduce((acc, curr) => acc + +curr.attributes.allocators, 0)
        }
      };
    });
  }, [data]);

  return {
    dataCapFlow,
    loading,
    loaded
  }
}

export default useDataCapFlow;

import { useMemo } from 'react';
import { useGoogleSheetsAuditReport } from './useGoogleSheetsReports';
import { useGoogleSheetFilters } from './useGoogleSheetFilters';

const PB_10 = 10 * 1024 * 1024 * 1024 * 1024 * 1024;
const PB_15 = 15 * 1024 * 1024 * 1024 * 1024 * 1024;

const useDataCapFlow = () => {

  const {
    activeFilter, partialFilter, failedFilter, notActiveFilter, notAuditedFilter, notWaitingFilter, passFilter
  } = useGoogleSheetFilters()

  const { results, loading, loaded } = useGoogleSheetsAuditReport();

  const getElement = (name, array, withSimpleChildren = false) => {
    console.log(name, array, array.map(item => item.auditStatuses))

    const element = {
      name,
      attributes: getAttributes(array)
    };

    if (withSimpleChildren) {
      element['children'] = array.map((data) => ({
        name: data.name,
        attributes: {
          datacap: data.initialAllowance,
          allocatorId: data.addressId
        },
        children: undefined
      }));
    }
    return element;
  };

  const getAttributes = (array) => {
    return {
      datacap: array.reduce((acc, curr) => acc + +curr.initialAllowance, 0),
      allocators: array.length
    };
  };

  const getAudits = (results) => {
    const numberOfAudits = results.audits;
    const data = results.data.filter(activeFilter);
    const audits = [
      {
        ...getElement('Not Audited', data.filter(notAuditedFilter), true)
      }
    ];

    for (let i = 0; i < numberOfAudits; i++) {
      const notWaitingData = data.filter(notWaitingFilter(i));

      audits.push({
        ...getElement(`Audit ${i + 1}`, notWaitingData),
        children: !!notWaitingData.length ? [
          getElement('Failed', notWaitingData.filter(failedFilter(i)), true),
          getElement('Conditional', notWaitingData.filter(partialFilter(i)), true),
          getElement('Pass', notWaitingData.filter(passFilter(i)), true)
        ] : undefined
      });
    }

    return audits;
  };

  const dataCapFlow = useMemo(() => {

    if (!loaded) {
      return [];
    }

    return [{
      name: 'Root Key Holder',
      attributes: getAttributes(results.data),
      children: [
        getElement('Not Active', results.data.filter(notActiveFilter), true),
        {
          ...getElement('Active', results.data.filter(activeFilter)),
          children: getAudits(results)
        }
      ]
    }];
  }, [results, loaded]);

  return {
    dataCapFlow,
    loading,
    loaded
  };
};

export default useDataCapFlow;

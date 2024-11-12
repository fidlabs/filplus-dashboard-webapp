import { useFetch } from './fetch';
import { useMemo, useState } from 'react';


const useGoogleSheetsAuditReport = () => {


  const [loaded, setLoaded] = useState(false);

  const [results, { loading: dataLoading }] = useFetch(
    '/getVerifiers?showInactive=false'
  );

  console.log(results?.data?.reduce((acc, curr) => acc + +curr.allowance, 0));

  const [googleSheetsData, { loading: googleLoading }] = useFetch(`https://cdp.allocator.tech/proxy/googleapis/allocators-overview`);

  const loading = useMemo(() => dataLoading || googleLoading, [dataLoading, googleLoading]);

  const parsedData = useMemo(() => {
    setLoaded(false);
    const returnData = {
      audits: 0,
      data: []
    };

    if (results?.data && googleSheetsData?.values) {
      const allocatorIdIndex = googleSheetsData.values[0].indexOf('Allocator ID');
      const firstReviewIndex = googleSheetsData.values[0].indexOf('1');

      returnData.audits = +(googleSheetsData.values[0][googleSheetsData.values[0].length - 1]);

      if (allocatorIdIndex === -1) {
        throw new Error('Allocator ID column not found in google sheets data');
      }


      results?.data.forEach((result) => {
        const googleSheetData = googleSheetsData?.values.find((data) => data[allocatorIdIndex] === result.addressId);
        const auditStatuses = googleSheetData ? googleSheetData.slice(firstReviewIndex).map(item => item.toUpperCase()) : []

        returnData.data.push({
          ...result,
          auditStatuses,
          isActive: (googleSheetData && googleSheetData[firstReviewIndex] !== 'Inactive') || false,
          isAudited: googleSheetData && !['Inactive', 'Waiting', 'Pre Audit'].includes(googleSheetData[firstReviewIndex]),
          lastValidAudit : auditStatuses.filter(item => !['WAITING', 'PRE AUDIT', 'INACTIVE'].includes(item)).length - 1,
        });
      });

      setLoaded(true);

      console.log(returnData)

    }
    return returnData;
  }, [results, googleSheetsData]);

  return {
    results: parsedData,
    loading,
    loaded
  };
};

export { useGoogleSheetsAuditReport };

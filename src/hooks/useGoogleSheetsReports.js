import { useFetch } from './fetch';
import { useMemo, useState } from 'react';


const useGoogleSheetsAuditReport = () => {


  const [loaded, setLoaded] = useState(false);

  const [results, { loading: dataLoading }] = useFetch(
    '/getVerifiers?showInactive=false'
  );

  const [googleSheetsData, { loading: googleLoading }] = useFetch(`https://sheets.googleapis.com/v4/spreadsheets/1Rx3ZsUh7rhjdAARBNdBHgdbhBM5zFlEnqghC7A0JZ4k/values/GRAPHS?key=AIzaSyAu2rJkwoZRJF-7A9j1gd_odIK9CiWMt0s`);

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

        returnData.data.push({
          ...result,
          auditStatuses: googleSheetData ? googleSheetData.slice(firstReviewIndex) : [],
          isActive: googleSheetData && googleSheetData[firstReviewIndex] !== 'Inactive',
          isAudited: googleSheetData && googleSheetData[firstReviewIndex] !== 'Inactive' && googleSheetData[firstReviewIndex] !== 'Pre Audit'
        });
      });

      setLoaded(true);

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

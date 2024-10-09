import { useCDP } from 'hooks';
import { useEffect, useMemo, useState } from 'react';
import { useCommonChart } from '../providers/CommonChartProvider';
import { format } from 'date-fns';
import { uniq } from 'lodash/array';

const useWeeklyChartData = (data, unit = '', defaultTab = 0) => {
  const {
    groupData,
    parseSingleBucketWeek,
    parseBucketGroupWeek
  } = useCDP();

  const {
    barTabs, globalBarTab
  } = useCommonChart();

  const [currentTab, setCurrentTab] = useState(defaultTab);

  const chartData = useMemo(() => {

    if (!data?.length) {
      return [];
    }

    return data?.map((bucket) => {
      const name = `w${format(new Date(bucket.week), 'ww yyyy')}`
      let data = {
        name
      };

      let results;

      if (currentTab === barTabs.length - 1) {
        results = bucket.results.map((bucket, index) => parseSingleBucketWeek(bucket, index, data?.length, unit));
      } else {
        const groupedBuckets = groupData(bucket.results, currentTab * 3 + 3);
        results = groupedBuckets.map((group, index) => parseBucketGroupWeek(group, index, groupedBuckets.length, unit));
      }

      Object.values(results).forEach((value, index) => {
        data[`group${index}`] = value.value;
        data[`group${index}Name`] = value.name;
      });
      return data;
    })

  }, [data, currentTab]);

  const minValue = useMemo(() => {
    const dataKeys = uniq(chartData.flatMap(d => Object.values(d)).filter(val => !isNaN(+val))).map(item => +item);
    return Math.min(...dataKeys);
  }, [chartData]);

  useEffect(() => {
    setCurrentTab(globalBarTab);
  }, [globalBarTab]);

  return {
    chartData,
    currentTab,
    setCurrentTab,
    tabs: barTabs,
    minValue
  };
};

export default useWeeklyChartData;

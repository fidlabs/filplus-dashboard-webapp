import useCDP from '../../../hooks/useCDP';
import { useEffect, useMemo, useState } from 'react';
import { useCommonChart } from '../providers/CommonChartProvider';

const useChartData = (data, unit = '') => {
  const {
    groupData,
    parseSingleBucket,
    parseBucketGroup,
  } = useCDP()

  const {
    barTabs, globalBarTab
  } = useCommonChart()

  const [currentTab, setCurrentTab] = useState(0)

  const chartData = useMemo(() => {
    if (currentTab === barTabs.length - 1) {
      return data.map((bucket, index) => parseSingleBucket(bucket, index, data?.length, unit));
    } else {
      const groupedBuckets = groupData(data, currentTab * 3 + 3);
      return groupedBuckets.map((group, index) => parseBucketGroup(group, index, groupedBuckets.length, unit));
    }
  }, [data, currentTab]);

  useEffect(() => {
    setCurrentTab(globalBarTab)
  }, [globalBarTab]);

  return {
    chartData,
    currentTab,
    setCurrentTab,
    tabs: barTabs
  }
}

export default useChartData;

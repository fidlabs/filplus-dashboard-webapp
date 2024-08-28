import useCDP from '../../../hooks/useCDP';
import { useMemo, useState } from 'react';

const tabs = ['3 bars', '6 bars', 'All']

const useChartData = (data, unit = '') => {
  const {
    groupData,
    parseSingleBucket,
    parseBucketGroup,
  } = useCDP()

  const [currentTab, setCurrentTab] = useState(0)

  const chartData = useMemo(() => {
    if (currentTab === tabs.length - 1) {
      return data.map((bucket, index) => parseSingleBucket(bucket, index, data?.length, unit));
    } else {
      const groupedBuckets = groupData(data, currentTab * 3 + 3);
      return groupedBuckets.map((group, index) => parseBucketGroup(group, index, groupedBuckets.length, unit));
    }
  }, [data, currentTab]);

  return {
    chartData,
    currentTab,
    setCurrentTab,
    tabs
  }
}

export default useChartData;

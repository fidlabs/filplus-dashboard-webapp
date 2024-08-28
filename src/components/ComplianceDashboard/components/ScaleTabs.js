import TabsSelector from '../../ContentTabs/TabsSelector';
import { useCallback, useEffect, useMemo } from 'react';
import { useCommonChart } from '../providers/CommonChartProvider';

const ScaleTabs = ({ scale, setScale, global = false }) => {

  const {
    scaleTabs,
    globalScaleTab
  } = useCommonChart()

  const currentTab = useMemo(() => {
    switch (scale) {
      case 'linear':
        return 0;
      case 'log':
        return 1;
    }
  }, [scale]);

  const switchScale = useCallback((tab) => {
    switch (tab) {
      case 0:
        setScale('linear');
        break;
      case 1:
        setScale('log');
        break;
    }
  }, [scale]);

  useEffect(() => {
    if (global) {
      return
    }
    setScale(globalScaleTab);
  }, [globalScaleTab, global]);

  return <TabsSelector tabs={scaleTabs} currentTab={currentTab} setCurrentTab={switchScale} />
}

export default ScaleTabs;

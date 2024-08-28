import TabsSelector from '../ContentTabs/TabsSelector';
import { useCallback, useMemo } from 'react';

const tabs = ['Linear scale', 'Log scale']

const ScaleTabs = ({ scale, setScale }) => {

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

  return <TabsSelector tabs={tabs} currentTab={currentTab} setCurrentTab={switchScale} />
}

export default ScaleTabs;

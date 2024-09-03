import { useCallback, useMemo } from 'react';
import TabsSelector from '../ContentTabs/TabsSelector';

const scaleTabs = ['Linear scale', 'Log scale'];

export const ScaleTabs = ({ scale, setScale }) => {

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

  return <TabsSelector tabs={scaleTabs} currentTab={currentTab} setCurrentTab={switchScale} />
}

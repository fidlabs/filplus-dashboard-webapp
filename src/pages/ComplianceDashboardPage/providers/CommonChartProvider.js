import { createContext, useContext, useState } from 'react';

const barTabs = ['3 bars', '6 bars', 'All'];
const scaleTabs = ['Linear scale', 'Log scale'];

const CommonChartContext = createContext({
  barTabs,
  scaleTabs,
  globalBarTab: 0,
  setGlobalBarTab: (v) => {},
  globalScaleTab: 0,
  setGlobalScaleTab: (v) => {}
});

const CommonChartProvider = ({ children }) => {

  const [globalBarTab, setGlobalBarTab] = useState(0);
  const [globalScaleTab, setGlobalScaleTab] = useState('linear');

  return (
    <CommonChartContext.Provider value={{
      barTabs,
      scaleTabs,
      globalBarTab,
      globalScaleTab,
      setGlobalBarTab,
      setGlobalScaleTab
    }}>
      {children}
    </CommonChartContext.Provider>
  );
};

const useCommonChart = () => {
  return useContext(CommonChartContext);
}

export { CommonChartProvider, useCommonChart };

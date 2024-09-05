import { TabsSelector } from 'components';
import { useCommonChart } from '../providers/CommonChartProvider';
import cn from 'classnames';
import SharedScaleTabs from './SharedScaleTabs';

const CommonChartsSettings = () => {

  const {
    barTabs,
    globalBarTab,
    globalScaleTab,
    setGlobalScaleTab,
    setGlobalBarTab
  } = useCommonChart();

  return (
    <div className="card">
      <div className={cn("cardTitle noMargin chartHeaderOptionsVertical")}>
        Common chart settings
          <SharedScaleTabs scale={globalScaleTab} setScale={setGlobalScaleTab} global />
          <TabsSelector tabs={barTabs} currentTab={globalBarTab} setCurrentTab={setGlobalBarTab} />
      </div>
    </div>
  );
};


export default CommonChartsSettings;

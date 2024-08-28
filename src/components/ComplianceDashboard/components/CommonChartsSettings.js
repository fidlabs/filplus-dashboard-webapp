import ScaleTabs from './ScaleTabs';
import TabsSelector from '../../ContentTabs/TabsSelector';
import { useCommonChart } from '../providers/CommonChartProvider';
import s from '../s.module.css'
import cn from 'classnames';

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
      <div className={cn("cardTitle noMargin", s.chartHeaderOptionsVertical)}>
        Common chart settings
          <ScaleTabs scale={globalScaleTab} setScale={setGlobalScaleTab} global />
          <TabsSelector tabs={barTabs} currentTab={globalBarTab} setCurrentTab={setGlobalBarTab} />
      </div>
    </div>
  );
};


export default CommonChartsSettings;

import useCDP from '../../../hooks/useCDP';
import { useEffect, useState } from 'react';
import s from '../s.module.css'
import TabsSelector from '../../ContentTabs/TabsSelector';
import BarGraph from './BarGraph';
import useScrollObserver from '../../../hooks/useScrollObserver';
import useChartData from '../hooks/useChartData';
import useChartScale from '../hooks/useChartScale';
import ScaleTabs from './ScaleTabs';

const tabs = ['3 bars', '6 bars', 'All']

const BiggestDealsSP = ({setCurrentElement}) => {
  const {
    data, isLoading
  } = useCDP().getSizeOfTheBiggestDealSP()

  const { top, ref } = useScrollObserver();

  const { chartData, currentTab, setCurrentTab, tabs } = useChartData(data?.buckets, '%')
  const { scale, selectedScale, setSelectedScale } = useChartScale(chartData)

  useEffect(() => {
    if (top > 0 && top < 300) {
      setCurrentElement("BiggestDealsSP");
    }
  }, [top]);


  return <div className="size6 w-full" id="BiggestDealsSP" ref={ref}>
    <div className="card">
      <div className="cardTitle noMargin">
        <div className={s.chartHeader}>
          <div>Size Of The Biggest Deal</div>
          <div className={s.chartHeaderOptions}>
            <ScaleTabs scale={selectedScale} setScale={setSelectedScale} />
            <TabsSelector tabs={tabs} currentTab={currentTab} setCurrentTab={setCurrentTab} />
          </div>
        </div>
      </div>
      <div className="cardData">
        <div className="grid w-full noMargin">
          <div className="card alt compact size3">
            <div className="cardTitle">
              Total providers
            </div>
            <div className="cardData">
              {data?.count}
            </div>
          </div>
          <div className="card alt compact size3">
            <div className="cardTitle">
              What is this data?
            </div>
            <div className="cardData compact">
              What % of the total data cap received comes from the single client
            </div>
          </div>
          <div className="size6">
            <BarGraph data={chartData} scale={scale} isLoading={isLoading} />
          </div>
        </div>

      </div>
    </div>
  </div>

}

export default BiggestDealsSP;

import { useCDP, useScrollObserver, useChartScale } from 'hooks';
import { useEffect } from 'react';
import { TabsSelector } from 'components';
import SharedScaleTabs from './SharedScaleTabs';
import StackedBarGraph from './StackedBarGraph';
import useWeeklyChartData from '../hooks/useWeeklyChartData';

const NumberOfDealsSP = ({setCurrentElement}) => {
  const {
    data, isLoading
  } = useCDP().getNumberOfDealsSP()

  const { top, ref } = useScrollObserver();

  const { chartData, currentTab, setCurrentTab, tabs, minValue } = useWeeklyChartData(data?.buckets, ' deals')
  const { scale, selectedScale, setSelectedScale } = useChartScale(minValue)

  useEffect(() => {
    if (top > 0 && top < 300) {
      setCurrentElement("NumberOfDealsSP");
    }
  }, [top]);


  return <div className="size6 w-full" id="NumberOfDealsSP" ref={ref}>
    <div className="card">
      <div className="cardTitle noMargin">
        <div className="chartHeader">
          <div>Number Of Allocations</div>
          <div className="chartHeaderOptions">
            <SharedScaleTabs scale={selectedScale} setScale={setSelectedScale} />
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
          <div className="size6">
            <StackedBarGraph data={chartData} scale={scale} isLoading={isLoading} unit="providers"/>
          </div>
        </div>

      </div>
    </div>
  </div>

}

export default NumberOfDealsSP;

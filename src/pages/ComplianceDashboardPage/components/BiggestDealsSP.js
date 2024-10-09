import { useCDP, useScrollObserver, useChartScale } from 'hooks';
import { useEffect } from 'react';
import { TabsSelector } from 'components';
import SharedScaleTabs from './SharedScaleTabs';
import StackedBarGraph from './StackedBarGraph';
import useWeeklyChartData from '../hooks/useWeeklyChartData';

const BiggestDealsSP = ({setCurrentElement}) => {
  const {
    data, isLoading
  } = useCDP().getSizeOfTheBiggestDealSP()

  const { top, ref } = useScrollObserver();

  const { chartData, currentTab, setCurrentTab, tabs, minValue } = useWeeklyChartData(data?.buckets, '%')
  const { scale, selectedScale, setSelectedScale } = useChartScale(minValue)

  useEffect(() => {
    if (top > 0 && top < 300) {
      setCurrentElement("BiggestDealsSP");
    }
  }, [top]);


  return <div className="size6 w-full" id="BiggestDealsSP" ref={ref}>
    <div className="card">
      <div className="cardTitle noMargin">
        <div className="chartHeader">
          <div>Size Of The Biggest Deal</div>
          <div className="chartHeaderOptions">
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
            <StackedBarGraph data={chartData} scale={scale} isLoading={isLoading} />
          </div>
        </div>

      </div>
    </div>
  </div>

}

export default BiggestDealsSP;

import { useCDP, useScrollObserver, useChartScale } from 'hooks';
import { useEffect } from 'react';
import { TabsSelector } from 'components';
import SharedScaleTabs from './SharedScaleTabs';
import useWeeklyChartData from '../hooks/useWeeklyChartData';
import StackedBarGraph from './StackedBarGraph';

const RetrievabilityScoreAllocator = ({setCurrentElement}) => {
  const {
    data, isLoading
  } = useCDP().getRetrievabilityAllocator()

  const { top, ref } = useScrollObserver()
  const { chartData, currentTab, setCurrentTab, tabs, minValue } = useWeeklyChartData(data?.buckets, '%')
  const { scale, selectedScale, setSelectedScale } = useChartScale(minValue)


  useEffect(() => {
    if (top > 0 && top < 300) {
      setCurrentElement("RetrievabilityScoreAllocator");
    }
  }, [top]);


  return <div className="size6 w-full" id="RetrievabilityScoreAllocator" ref={ref}>
    <div className="card">
      <div className="cardTitle noMargin">
        <div className="chartHeader">
          <div>Retrievability Score</div>
          <div className="chartHeaderOptions">
            <TabsSelector tabs={tabs} currentTab={currentTab} setCurrentTab={setCurrentTab} />
          </div>
        </div>
      </div>
      <div className="cardData">
        <div className="grid w-full noMargin">
          <div className="card alt compact size3">
            <div className="cardTitle">
              Average success rate
            </div>
            <div className="cardData">
              {data?.avg_score?.toFixed(2)}%
            </div>
          </div>
          <div className="card alt compact size3">
            <div className="cardTitle">
              Total allocators
            </div>
            <div className="cardData">
              {data?.count}
            </div>
          </div>
          <div className="size6">
            <StackedBarGraph data={chartData} scale={scale} isLoading={isLoading}/>
          </div>
        </div>

      </div>
    </div>
  </div>

}

export default RetrievabilityScoreAllocator;

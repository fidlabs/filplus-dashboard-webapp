import useCDP from '../../../hooks/useCDP';
import { useEffect } from 'react';
import TabsSelector from '../../ContentTabs/TabsSelector';
import BarGraph from './BarGraph';
import useScrollObserver from '../../../hooks/useScrollObserver';
import useChartData from '../hooks/useChartData';
import useChartScale from '../../../hooks/useChartScale';
import SharedScaleTabs from './SharedScaleTabs';

const RetrievabilityScoreSP = ({setCurrentElement}) => {

  const {
    data, isLoading
  } = useCDP().getRetrievabilitySP()

  const { top, ref } = useScrollObserver()
  const { chartData, currentTab, setCurrentTab, tabs, minValue } = useChartData(data?.buckets, '%')
  const { scale, selectedScale, setSelectedScale } = useChartScale(minValue)

  useEffect(() => {
    if (top > 0 && top < 300) {
      setCurrentElement("RetrievabilityScoreSP");
    }
  }, [top]);


  return <div className="size6 w-full" id="RetrievabilityScoreSP" ref={ref}>
    <div className="card">
      <div className="cardTitle noMargin">
        <div className="chartHeader">
          <div>Retrievability Score</div>
          <div className="chartHeaderOptions">
            <SharedScaleTabs scale={selectedScale} setScale={setSelectedScale}/>
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
              {data?.avg_success_rate_pct?.toFixed(2)}%
            </div>
          </div>
          <div className="card alt compact size3">
            <div className="cardTitle">
              Total providers
            </div>
            <div className="cardData">
              {data?.count}
            </div>
          </div>
          <div className="size6">
            <BarGraph data={chartData} scale={scale} isLoading={isLoading}/>
          </div>
        </div>

      </div>
    </div>
  </div>

}

export default RetrievabilityScoreSP;

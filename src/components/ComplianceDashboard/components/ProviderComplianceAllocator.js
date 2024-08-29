import useCDP from '../../../hooks/useCDP';
import { useEffect, useMemo, useState } from 'react';
import s from '../s.module.css'
import TabsSelector from '../../ContentTabs/TabsSelector';
import BarGraph from './BarGraph';
import useScrollObserver from '../../../hooks/useScrollObserver';
import ScaleTabs from './ScaleTabs';
import useChartData from '../hooks/useChartData';
import useChartScale from '../hooks/useChartScale';

const metrics = [
  '0-1/3 metrics',
  '2/3 metrics',
  '3/3 metrics',
]

const ProviderComplianceAllocator = ({setCurrentElement}) => {

  const [selectedMetric, setSelectedMetric] = useState(2);
  const { top, ref } = useScrollObserver()

  const metricRange = useMemo(() => {
    switch (selectedMetric) {
      case 0:
        return [0, 1]
      case 1:
        return [2, 2]
      case 2:
        return [3, 3]
    }
  }, [selectedMetric])

  useEffect(() => {
    if (top > 0 && top < 300) {
      setCurrentElement("ProviderComplianceAllocator");
    }
  }, [top]);

  const {
    data, isLoading
  } = useCDP().getProviderComplianceAllocator(metricRange[0], metricRange[1])
  const { chartData, currentTab, setCurrentTab, tabs } = useChartData(data?.buckets, '%')
  const { scale, selectedScale, setSelectedScale } = useChartScale(chartData)

  return <div className="size6 w-full" id="ProviderComplianceAllocator" ref={ref}>
    <div className="card">
      <div className="cardTitle noMargin">
        <div className={s.chartHeader}>
          <div>SP Compliance</div>
          <div className={s.chartHeaderOptions}>
            <TabsSelector tabs={metrics} currentTab={selectedMetric} setCurrentTab={setSelectedMetric} />
            <ScaleTabs scale={selectedScale} setScale={setSelectedScale}/>
            <TabsSelector tabs={tabs} currentTab={currentTab} setCurrentTab={setCurrentTab} />
          </div>
        </div>
      </div>
      <div className="cardData">
        <div className="grid w-full noMargin">
          <div className="card alt compact size3">
            <div className="cardTitle">
              Total allocators
            </div>
            <div className="cardData">
              {data?.count}
            </div>
            <div className="cardData compact">
              This data shows allocators which clients made at least one deal
            </div>
          </div>
          <div className="card alt compact size3">
            <div className="cardTitle noMargin">
              What are those metrics?
            </div>
            <div className="cardData compact">
              <ul style={{paddingLeft: '15px', margin: 0}}>
                <li>SP have retrievability score above average</li>
                <li>SP have at least 3 clients</li>
                <li>SP biggest client accounts for less than 30%</li>
              </ul>
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

export default ProviderComplianceAllocator;

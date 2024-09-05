import { useCDP, useScrollObserver, useChartScale } from 'hooks';
import { useEffect } from 'react';
import BarGraph from './BarGraph';
import SharedScaleTabs from './SharedScaleTabs';

const AuditStateAllocator = ({setCurrentElement}) => {
  const {
    data, isLoading
  } = useCDP().getAuditStateAllocator()

  const { top, ref } = useScrollObserver();

  const { scale, selectedScale, setSelectedScale } = useChartScale(data.chartData)

  useEffect(() => {
    if (top > 0 && top < 300) {
      setCurrentElement("AuditStateAllocator");
    }
  }, [top]);


  return <div className="size6 w-full" id="AuditStateAllocator" ref={ref}>
    <div className="card">
      <div className="cardTitle noMargin">
        <div className="chartHeader">
          <div>Audit state</div>
          <div className="chartHeaderOptions">
            <SharedScaleTabs scale={selectedScale} setScale={setSelectedScale} />
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
          </div>
          <div className="size6">
            <BarGraph data={data.chartData} scale={scale} isLoading={isLoading}/>
          </div>
        </div>

      </div>
    </div>
  </div>

}

export default AuditStateAllocator;

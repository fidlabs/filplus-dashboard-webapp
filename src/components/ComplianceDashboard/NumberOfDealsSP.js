import useCDP from '../../hooks/useCDP';
import { useEffect, useState } from 'react';
import s from './s.module.css'
import TabsSelector from '../ContentTabs/TabsSelector';
import BarGraph from './BarGraph';
import useScrollObserver from '../../hooks/useScrollObserver';
import useChartData from './hooks/useChartData';
import useChartScale from './hooks/useChartScale';
import ScaleTabs from './ScaleTabs';


const NumberOfDealsSP = ({setCurrentElement}) => {
  const {
    getNumberOfDealsSP,
  } = useCDP()

  const { top, ref } = useScrollObserver();

  const [numberOfDeals, setNumberOfDeals] = useState(null);
  const { chartData, currentTab, setCurrentTab, tabs } = useChartData(numberOfDeals?.buckets, ' deals')
  const { scale, selectedScale, setSelectedScale } = useChartScale(chartData)

  useEffect(() => {
      getNumberOfDealsSP().then(setNumberOfDeals);
  }, []);

  useEffect(() => {
    if (top > 0 && top < 200) {
      setCurrentElement("NumberOfDealsSP");
    }
  }, [top]);


  return <div className="size6 w-full" id="NumberOfDealsSP" ref={ref}>
    <div className="card">
      <div className="cardTitle noMargin">
        <div className={s.chartHeader}>
          <div>Number Of Deals</div>
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
              {numberOfDeals?.count}
            </div>
          </div>
          <div className="size6">
            <BarGraph data={chartData} scale={scale}/>
          </div>
        </div>

      </div>
    </div>
  </div>

}

export default NumberOfDealsSP;

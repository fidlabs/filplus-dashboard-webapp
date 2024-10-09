import { useCDP, useScrollObserver, useChartScale } from 'hooks';
import { useEffect, useMemo, useState } from 'react';
import { TabsSelector } from 'components';
import SharedScaleTabs from './SharedScaleTabs';
import useWeeklyChartData from '../hooks/useWeeklyChartData';
import StackedBarGraph from './StackedBarGraph';

const metrics = [
  '0-1/3 metrics',
  '2/3 metrics',
  '3/3 metrics',
]

const ProviderComplianceAllocator = ({setCurrentElement}) => {

  const { top, ref } = useScrollObserver()

  useEffect(() => {
    if (top > 0 && top < 300) {
      setCurrentElement("ProviderComplianceAllocator");
    }
  }, [top]);

  const {
    data, isLoading
  } = useCDP().getProviderComplianceAllocator()

  // console.log(chartData)

  const chartData = useMemo(() => {
    return data;
  }, [data]);

  return <div className="size6 w-full" id="ProviderComplianceAllocator" ref={ref}>
    <div className="card">
      <div className="cardTitle noMargin">
        <div className="chartHeader">
          <div>SP Compliance</div>
          <div className="chartHeaderOptions">
          </div>
        </div>
      </div>
      <div className="cardData">
        <p>Work in progress</p>
      </div>
    </div>
  </div>

  // return <div className="size6 w-full" id="ProviderComplianceAllocator" ref={ref}>
  //   <div className="card">
  //     <div className="cardTitle noMargin">
  //       <div className="chartHeader">
  //         <div>SP Compliance</div>
  //         <div className="chartHeaderOptions">
  //         </div>
  //       </div>
  //     </div>
  //     <div className="cardData">
  //       <div className="grid w-full noMargin">
  //         <div className="card alt compact size3">
  //           <div className="cardTitle">
  //             Total allocators
  //           </div>
  //           <div className="cardData">
  //             {data?.count}
  //           </div>
  //           <div className="cardData compact">
  //             This data shows allocators which clients made at least one deal
  //           </div>
  //         </div>
  //         <div className="card alt compact size3">
  //           <div className="cardTitle noMargin">
  //             What are those metrics?
  //           </div>
  //           <div className="cardData compact">
  //             <ul style={{paddingLeft: '15px', margin: 0}}>
  //               <li>SP have retrievability score above average</li>
  //               <li>SP have at least 3 clients</li>
  //               <li>SP biggest client accounts for less than 30%</li>
  //             </ul>
  //           </div>
  //         </div>
  //         <div className="size6">
  //           <StackedBarGraph data={chartData} scale={'linear'} isLoading={isLoading}/>
  //         </div>
  //       </div>
  //
  //     </div>
  //   </div>
  // </div>

}

export default ProviderComplianceAllocator;

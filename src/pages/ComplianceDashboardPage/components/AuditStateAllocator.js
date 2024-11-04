import { useCDP, useScrollObserver, useChartScale } from 'hooks';
import { useEffect, useMemo } from 'react';
import AuditHistoryBarGraph from './AuditHistoryBarGraph';
import { useGoogleSheetsAuditReport } from '../../../hooks/useGoogleSheetsReports';

const AuditStateAllocator = ({setCurrentElement}) => {
  const { results, loading } = useGoogleSheetsAuditReport();

  const { top, ref } = useScrollObserver();

  const { scale, selectedScale, setSelectedScale } = useChartScale(0)

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
              {results?.data?.length}
            </div>
          </div>
          <div className="size6">
            <AuditHistoryBarGraph data={results?.data} audits={results?.audits} scale={scale} isLoading={loading}/>
          </div>
        </div>

      </div>
    </div>
  </div>

}

export default AuditStateAllocator;

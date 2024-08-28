import RetrievabilityScoreSP from './components/RetrievabilityScoreSP';
import s from './s.module.css';
import NumberOfDealsSP from './components/NumberOfDealsSP';
import { useScrollToHash } from '../../hooks/useScrollToHash';
import { useCallback, useMemo, useState } from 'react';
import cn from 'classnames';
import BiggestDealsSP from './components/BiggestDealsSP';
import RetrievabilityScoreAllocator from './components/RetrievabilityScoreAllocator';
import BiggestDealsAllocator from './components/BiggestDealsAllocator';
import ProviderComplianceAllocator from './components/ProviderComplianceAllocator';
import AuditStateAllocator from './components/AuditStateAllocator';
import { CommonChartProvider } from './providers/CommonChartProvider';
import CommonChartsSettings from './components/CommonChartsSettings';

const ComplianceDashboard = () => {

  const scrollToHash = useScrollToHash();

  const [currentElement, setCurrentElement] = useState('RetrievabilityScoreSP');
  const [disableCallbacks, setDisableCallbacks] = useState(false);

  const top = useMemo(() => {
    switch (currentElement) {
      case 'RetrievabilityScoreSP':
        return 16;
      case 'NumberOfDealsSP':
        return 16 + 22 + 8;
      case 'BiggestDealsSP':
        return 16 + 22 + 22 + 16;
      case 'RetrievabilityScoreAllocator':
        return 16 + 22 + 22 + 22 + 48;
      case 'BiggestDealsAllocator':
        return 16 + 22 + 22 + 22 + 22 + 56;
      case 'ProviderComplianceAllocator':
        return 16 + 22 + 22 + 22 + 22 + 22 + 64;
      case 'AuditStateAllocator':
        return 16 + 22 + 22 + 22 + 22 + 22 + 22 + 72;
    }
  }, [currentElement]);

  const scrollTo = useCallback((element) => {
    setDisableCallbacks(true);
    setCurrentElement(element);
    scrollToHash(element);
    setTimeout(() => {
      setDisableCallbacks(false);
    }, 500);
  }, [scrollToHash]);

  const scrollCallback = (element) => {
    if (disableCallbacks) {
      return;
    }
    setCurrentElement(element);
  };

  return (
    <div className="container">
      <h2 className="h1">Compliance dashboard</h2>
      <CommonChartProvider>
        <div className={s.dashboardsLayout}>
          <div className={cn('grid', s.dashboardsLayoutMenuStickyWrapper)}>
            <div className="size6">
              <div className={s.dashboardsLayoutMenu}>
                <div className={s.dashboardsLayoutMenuIndicator} style={{ top }} />
                <div>
                  <div>SPs</div>
                  <div className={s.submenu}>
                    <button onClick={e => scrollTo('RetrievabilityScoreSP')}>Retrievability Score</button>
                    <button onClick={e => scrollTo('NumberOfDealsSP')}>Number Of Deals</button>
                    <button onClick={e => scrollTo('BiggestDealsSP')}>Biggest Deal</button>
                  </div>
                </div>
                <div>
                  <div>Allocators</div>
                  <div className={s.submenu}>
                    <button onClick={e => scrollTo('RetrievabilityScoreAllocator')}>Retrievability Score</button>
                    <button onClick={e => scrollTo('BiggestDealsAllocator')}>Biggest allocation</button>
                    <button onClick={e => scrollTo('ProviderComplianceAllocator')}>SP Compliance</button>
                    <button onClick={e => scrollTo('AuditStateAllocator')}>Audit state</button>
                  </div>
                </div>
                <CommonChartsSettings />
              </div>
            </div>
          </div>
          <div className="grid w-full" style={{
            marginBottom: '25%'
          }}>
            <h3 className="h3 text-black">SPs</h3>
            <>
              <RetrievabilityScoreSP setCurrentElement={scrollCallback} />
              <NumberOfDealsSP setCurrentElement={scrollCallback} />
              <BiggestDealsSP setCurrentElement={scrollCallback} />
            </>
            <h3 className="h3 text-black">Allocators</h3>
            <>
              <RetrievabilityScoreAllocator setCurrentElement={scrollCallback} />
              <BiggestDealsAllocator setCurrentElement={scrollCallback} />
              <ProviderComplianceAllocator setCurrentElement={scrollCallback} />
              <AuditStateAllocator setCurrentElement={scrollCallback} />

            </>
          </div>
        </div>
      </CommonChartProvider>
    </div>
  );
};

export default ComplianceDashboard;

import RetrievabilityScoreSP from './RetrievabilityScoreSP';
import s from './s.module.css';
import NumberOfDealsSP from './NumberOfDealsSP';
import { useScrollToHash } from '../../hooks/useScrollToHash';
import { useCallback, useMemo, useState } from 'react';
import cn from 'classnames';
import BiggestDealsSP from './BiggestDealsSP';
import { debounce } from 'lodash';

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
              {/*<div>*/}
              {/*  <div>Allocators</div>*/}
              {/*  <div className={s.submenu}>*/}
              {/*    <button onClick={e => scrollTo('RetrievabilityScoreSP')}>Retrievability Score</button>*/}
              {/*    <button onClick={e => scrollTo('NumberOfDealsSP')}>Number Of Deals</button>*/}
              {/*    <button onClick={e => scrollTo('BiggestDealsSP')}>Biggest Deal</button>*/}
              {/*  </div>*/}
              </div>
            </div>
          </div>
        </div>
        <div className="grid w-full">
          <h3 className="h3 text-black">SPs</h3>
          <RetrievabilityScoreSP setCurrentElement={scrollCallback} />
          <NumberOfDealsSP setCurrentElement={scrollCallback} />
          <BiggestDealsSP setCurrentElement={scrollCallback} />
          {/*<h3 className="h3 text-black">Allocators</h3>*/}
        </div>
      </div>
    </div>
  );
};

export default ComplianceDashboard;

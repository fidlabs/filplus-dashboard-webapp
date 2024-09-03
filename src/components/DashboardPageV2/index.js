import cn from 'classnames';
import { useFetch } from 'hooks/fetch';
import { convertBytesToIEC } from 'utils/bytes';
import s from './s.module.css';
import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { DataCapAllocVsAvailable } from './dataCapAllocVsAvailable';
import { DataCapAllocationsWoW } from './dataCapAllocationsWoW';
import { DataCapUsedOverTime } from './dataCapUsedOverTime';
import { DataCapFlowGraph } from './dataCapFlowGraph';
import { DataCapFlowTree } from './dataCapFlowTree';
import { LoadingValue } from '../LoadingValue';
import { ContentTabs } from '../ContentTabs';
import { useScrollToHash } from '../../hooks/useScrollToHash';

export default function DashboardPage() {
  const fetchUrl = '/getFilPlusStats';
  const [toggle, setToggle] = useState(false);
  const scrollToHash = useScrollToHash();

  const [data, { loading, loaded }] = useFetch(fetchUrl);

  const {
    numberOfClients,
    numberOfActiveNotariesV2,
    numberOfAllocators,
    totalDcGivenToAllocators,
    totalDcUsedByAllocators
  } = data;

  const toggleChartsWrapper = useCallback(() => {
    if (!toggle) {
      scrollToHash('chartsWrapper');
    }
    setToggle(!toggle);
  }, [toggle, scrollToHash]);

  return (
    <div className="container">
      <h2 className="h1">State of Fil+</h2>
      <div className="grid double">
        <div className="card size2">
          <div className="cardTitle">
            <span>Total Allocators Datacap</span>
          </div>
          <div className="cardData">
            <LoadingValue
              value={convertBytesToIEC(totalDcGivenToAllocators)}
              loading={loading}
            />
          </div>
        </div>
        <div className="card size2">
          <div className="cardTitle">
            <span>Remaining Datacap Allowance</span>
          </div>
          <div className="cardData">
            <LoadingValue
              value={convertBytesToIEC(
                totalDcGivenToAllocators - totalDcUsedByAllocators
              )}
              loading={loading}
            />
          </div>
        </div>
        <div className="card size2">
          <div className="cardTitle">
            <span>Used Datacap Allowance</span>
          </div>
          <div className="cardData">
            <LoadingValue
              value={convertBytesToIEC(totalDcUsedByAllocators)}
              loading={loading}
            />
          </div>
        </div>
        <div className="card size2">
          <div className="cardTitle">
            <span>Total Approved Allocators</span>
          </div>
          <div className="cardData">
            <LoadingValue value={numberOfAllocators} loading={loading} />
            <Link className={s.cardLink} to="/notaries">
              Allocators <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        <div className="card size2">
          <div className="cardTitle">
            <span>Total Active Allocators</span>
          </div>
          <div className="cardData">
            <LoadingValue value={numberOfActiveNotariesV2} loading={loading} />
          </div>
        </div>
        <div className="card size2">
          <div className="cardTitle">
            <span>Numbers of Clients served</span>
          </div>
          <div className="cardData">
            <LoadingValue value={numberOfClients} loading={loading} />
            <Link className={s.cardLink} to="/clients">
              Clients <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
      <div className="grid">
        <div id="chartsWrapper" className={cn('card', toggle ? 'size6' : 'size4')}>
          <div className="cardTitle noMargin">
            <span>System Structure</span>
            <button className={s.cardButton} onClick={toggleChartsWrapper}>
              <ArrowRight
                size={18}
                style={{ transform: toggle ? 'rotate(90deg' : '' }}
              />
            </button>
          </div>
          <div className={cn(s.cardData, !toggle && s.cardDataHidden)}>
            <ContentTabs tabs={['Allocators tree', 'DataCap flow']}>
              <DataCapFlowTree />
              <DataCapFlowGraph />
            </ContentTabs>
          </div>
        </div>
      </div>
      <div className="grid">
        <div className="card size2">
          <div className="cardTitle">
            <span>DataCap Allocation</span>
          </div>
          <DataCapAllocVsAvailable
            totalDataCap={totalDcGivenToAllocators}
            usedDataCap={totalDcUsedByAllocators}
            availableDataCap={
              totalDcGivenToAllocators - totalDcUsedByAllocators
            }
          />
        </div>
        <div className="card size4">
          <div className="cardTitle">
            <span>DataCap Allocation WoW</span>
          </div>
          <DataCapAllocationsWoW />
        </div>
      </div>
      <div className="grid">
        <DataCapUsedOverTime />
      </div>
    </div>
  );
}

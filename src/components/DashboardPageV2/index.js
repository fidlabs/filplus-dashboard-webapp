import cn from 'classnames';

import { useFetch } from 'hooks/fetch';
import { convertBytesToIEC } from 'utils/bytes';
import { formatDuration } from 'utils/formatDuration';
import { Spinner } from 'components/Spinner';
import { Tooltip } from 'components/Tooltip';
import { formatFixed } from '@ethersproject/bignumber';

import s from './s.module.css';
import { Sankey, Tooltip as ReTooltip } from 'recharts';
import { getPercent } from 'utils/numbers';
import { isArray } from 'lodash';
import Switch from 'components/Switch';
import { useEffect, useState } from 'react';
import { useGlifFetch } from 'hooks/glifFetch';
import CronStats from 'components/CronStats';
import { StatusTooltip } from 'components/StatusTooltip';
import { Radio } from 'components/Radio';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { DataCapAllocVsAvailable } from './dataCapAllocVsAvailable';
import { DataCapAllocationsWoW } from './dataCapAllocationsWoW';
import { DataCapUsedOverTime } from './dataCapUsedOverTime';
import { DataCapFlowGraph } from './dataCapFlowGraph';
// import isFinite from 'lodash/isFinite';

export default function DashboardPage() {
  const fetchUrl = '/getFilPlusStats';
  const [toggle, setToggle] = useState(false);

  const [data, { loading, loaded }] = useFetch(fetchUrl);

  const {
    totalDcStored,

    numberOfClients,
    numberOfProviders,

    avgTTDIn95thPercentile,
    numberOfActiveNotaries,
    numberOfNotaries,

    activeVerifiedDealCollateral,
    activeRegularDealCollateral,
    totalVerifiedDealCollateral,
    totalRegularDealCollateral,

    totalAmountOfDatacapGrantedToNotaries,
    totalAmountOfDatacapGrantedToClients,
    totalAmountOfDatacapUsedByClients,
    percentOfAllocatedDatacapFromTotal,
    percentOfUsedDataFromDatacapGrantedToNotaries,
    percentOfUsedDataFromDatacapGrantedToClients,

    LDNv3totalAmountOfDatacapGrantedToNotary,
    LDNv3totalAmountOfDatacapGrantedToClients,
    LDNv3totalAmountOfDatacapUsedByClients,
    LDNv3percentOfAllocatedDatacapFromTotal,
    LDNv3percentOfUsedDataFromDatacapGrantedToClients,
    LDNv3percentOfUsedDataFromDatacapGrantedToNotaries,

    EFilTotalAmountOfDatacapGrantedToNotary,
    EFilTotalAmountOfDatacapGrantedToClients,
    EFiltotalAmountOfDatacapUsedByClients,
    EFilPercentOfAllocatedDatacapFromTotal,
    EFilPercentOfUsedDataFromDatacapGrantedToClients,
    EFilPercentOfUsedDataFromDatacapGrantedToNotaries,

    numberOfMainlyFilPlusProviders,
    totalNumberOfProviders,
    investmentCost,

    countOfClientsWhoReceiveMoreThan100TibDatacap,
    countOfClientsWhoUsedMoreThan90PercentOfRequestedDatacap,
    totalNewInitialPledge,
    sankeyChartData,

    numberOfActiveNotariesV2,
    numberOfAllocators,
    totalDcGivenToAllocators,
    totalDcUsedByAllocators,
  } = data;

  return (
    <div className="container">
      <h2 className="h1">State of Fil+</h2>
      <div className={cn(s.grid, s.double)}>
        <div className={cn(s.card, s.size2)}>
          <div className={s.cardTitle}>
            <span>Total Allocators Datacap</span>
          </div>
          <div className={s.cardData}>
            <LoadingValue
              value={convertBytesToIEC(totalDcGivenToAllocators)}
              loading={loading}
            />
          </div>
        </div>
        <div className={cn(s.card, s.size2)}>
          <div className={s.cardTitle}>
            <span>Remaining Datacap Allowance</span>
          </div>
          <div className={s.cardData}>
            <LoadingValue
              value={convertBytesToIEC(
                totalDcGivenToAllocators - totalDcUsedByAllocators
              )}
              loading={loading}
            />
          </div>
        </div>
        <div className={cn(s.card, s.size2)}>
          <div className={s.cardTitle}>
            <span>Used Datacap Allowance</span>
          </div>
          <div className={s.cardData}>
            <LoadingValue
              value={convertBytesToIEC(totalDcUsedByAllocators)}
              loading={loading}
            />
          </div>
        </div>
        <div className={cn(s.card, s.size2)}>
          <div className={s.cardTitle}>
            <span>Total Approved Allocators</span>
          </div>
          <div className={s.cardData}>
            <LoadingValue value={numberOfAllocators} loading={loading} />
            <Link className={s.cardLink} to="/notaries">
              Allocators <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        <div className={cn(s.card, s.size2)}>
          <div className={s.cardTitle}>
            <span>Total Active Allocators</span>
          </div>
          <div className={s.cardData}>
            <LoadingValue value={numberOfActiveNotariesV2} loading={loading} />
          </div>
        </div>
        <div className={cn(s.card, s.size2)}>
          <div className={s.cardTitle}>
            <span>Numbers of Clients served</span>
          </div>
          <div className={s.cardData}>
            <LoadingValue value={numberOfClients} loading={loading} />
            <Link className={s.cardLink} to="/clients">
              Clients <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </div>
      <div className={s.grid}>
        <div className={cn(s.card, toggle ? s.size6 : s.size4)}>
          <div className={cn(s.cardTitle, s.noMargin)}>
            <span>System Structure</span>
            <button className={s.cardButton} onClick={() => setToggle(!toggle)}>
              <ArrowRight
                size={18}
                style={{ transform: toggle ? 'rotate(90deg' : '' }}
              />
            </button>
          </div>
          <div className={cn(s.cardData, !toggle && s.cardDataHidden)}>
            <DataCapFlowGraph />
          </div>
        </div>
      </div>
      <div className={s.grid}>
        <div className={cn(s.card, s.size2)}>
          <div className={s.cardTitle}>
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
        <div className={cn(s.card, s.size4)}>
          <div className={s.cardTitle}>
            <span>DataCap Allocation WoW</span>
          </div>
          <DataCapAllocationsWoW />
        </div>
      </div>
      <div className={s.grid}>
        <div className={cn(s.card, s.size6)}>
          <div className={s.cardTitle}>
            <span>DataCap Used Over Time by Allocator</span>
          </div>
          <DataCapUsedOverTime />
        </div>
      </div>
    </div>
  );
}

const LoadingValue = ({ value, loading, spinnerSize = 24 }) => {
  return (
    <>
      {loading ? <Spinner width={spinnerSize} height={spinnerSize} /> : value}
    </>
  );
};

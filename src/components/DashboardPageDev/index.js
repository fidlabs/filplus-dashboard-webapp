import cn from 'classnames';

import { useFetch } from 'hooks/fetch';
import { convertBytesToIEC } from 'utils/bytes';
import { formatDuration } from 'utils/formatDuration';
import { Spinner } from 'components/Spinner';
import { Tooltip } from 'components/Tooltip';
import { formatFixed } from '@ethersproject/bignumber';

import s from './s.module.css';
import { Sankey, Tooltip as ReTooltip } from 'recharts';
import SankeyNode from './sankeyNode';
import { getPercent } from 'utils/numbers';
import { MarketDealsState } from './marketDealsState';
import { isArray } from 'lodash';
import Switch from 'components/Switch';
import { useState } from 'react';
import { MarketDealsStateBySize } from './marketDealsStateBySize';
// import isFinite from 'lodash/isFinite';

export default function DashboardPageDev() {
  const fetchUrl = '/getFilPlusStats';
  const [toggle, setToggle] = useState(false);

  const [data, { loading }] = useFetch(fetchUrl);
  const [
    marketDealsStateCumulativePerDay,
    { loaded: marketDealsStateCumulativePerDayLoaded },
  ] = useFetch('/timescale/get-market-deals-state/cumulative/per-day');
  const [
    marketDealsStatePerDay,
    { loaded: marketDealsStatePerDayLoaded },
  ] = useFetch('/timescale/get-market-deals-state/per-day');
  const [
    marketDealsStatePerWeek,
    { loaded: marketDealsStatePerWeekLoaded },
  ] = useFetch('/timescale/get-market-deals-state/per-week');

  const [
    marketDealsStateCumulativePerDayBySize,
    { loaded: marketDealsStateCumulativePerDayBySizeLoaded },
  ] = useFetch(
    '/timescale/get-market-deals-state-based-on-deal-size/cumulative/per-day'
  );
  const [
    marketDealsStatePerDayBySize,
    { loaded: marketDealsStatePerDayBySizeLoaded },
  ] = useFetch('/timescale/get-market-deals-state-based-on-deal-size/per-day');
  const [
    marketDealsStatePerWeekBySize,
    { loaded: marketDealsStatePerWeekBySizeLoaded },
  ] = useFetch('/timescale/get-market-deals-state-based-on-deal-size/per-week');

  const {
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
  } = data;

  let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const collateralAsString = formatFixed(
    totalVerifiedDealCollateral ? totalVerifiedDealCollateral : 0,
    18
  );

  const sectorPledgeAsString = formatFixed(
    totalNewInitialPledge ? totalNewInitialPledge : 0,
    18
  );

  const getValueOrSpinner = (value, spinnerSize = 24) => {
    return loading ? (
      <Spinner width={spinnerSize} height={spinnerSize} />
    ) : (
      value
    );
  };
  const renderTooltip = (props) => {
    const providerData = props?.payload?.[0];
    if (!providerData) return '';

    return (
      <div className={s.chartTooltip}>
        {providerData.name} &nbsp; {convertBytesToIEC(providerData.value)}
      </div>
    );
  };

  const totalDC =
    +totalAmountOfDatacapGrantedToNotaries +
    +LDNv3totalAmountOfDatacapGrantedToNotary +
    +EFilTotalAmountOfDatacapGrantedToNotary;

  return (
    <div className="container">
      <h2 className="h2">Dashboard</h2>
      <div className={s.grid}>
        <dl className={cn(s.card, s.size2)}>
          <dt className={s.cardTitle}>
            <span>Data stored in verified deals</span>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(
              convertBytesToIEC(
                Number(LDNv3totalAmountOfDatacapUsedByClients) +
                  Number(totalAmountOfDatacapUsedByClients) +
                  Number(EFiltotalAmountOfDatacapUsedByClients)
              )
            )}
          </dd>
        </dl>
        <dl className={cn(s.card, s.size2)}>
          <dt className={s.cardTitle}>
            <span>Average Time-to-DataCap (95th percentile)</span>
            <Tooltip>
              95th percentile of time it takes to get DataCap (including both
              LDN + Direct)
            </Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(formatDuration(avgTTDIn95thPercentile))}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2)}>
          <dt className={s.cardTitle}>
            <span>Active Allocators in the last 2 weeks</span>
            <Tooltip>
              Total number of active allocators that made a direct allocation or
              participated in an LDN allocation in the past 2 weeks
            </Tooltip>
          </dt>
          <dd className={s.cardData}>
            <span className={s.marginBottom4}>
              {getValueOrSpinner(numberOfActiveNotaries)}
            </span>
            <span className={cn(s.label, s.primary, s.margin0)}>
              <b>81</b>
              total allocators on chain
            </span>
          </dd>
        </dl>

        <dl className={cn(s.card, s.size3)}>
          <dt className={s.cardTitle}>
            <span>Unique client addresses that have received DataCap</span>
          </dt>
          <dd className={s.cardData} style={{ width: '390px' }}>
            <span className={s.marginBottom4}>
              {getValueOrSpinner(numberOfClients)}
            </span>
            <span className={s.displayFlexColumn}>
              <span className={cn(s.label, s.primary, s.margin0)}>
                <b>
                  {getValueOrSpinner(
                    Math.round(
                      (+countOfClientsWhoReceiveMoreThan100TibDatacap * 10000) /
                        +numberOfClients
                    )
                  ) / 100}
                  %
                </b>
                of clients who received &gt;= 100 TiBs of DataCap
              </span>
              <span className={cn(s.label, s.secondary, s.margin4000)}>
                <b>
                  {getValueOrSpinner(
                    Math.round(
                      (+countOfClientsWhoUsedMoreThan90PercentOfRequestedDatacap *
                        10000) /
                        +485
                    )
                  ) / 100}
                  %
                </b>
                of LDN clients who used &gt;90% of requested DataCap
              </span>
            </span>
          </dd>
        </dl>

        <dl className={cn(s.card, s.size3)}>
          <dt className={s.cardTitle}>
            <span>SP IDs with &gt; 75% capacity in verified deals</span>
          </dt>
          <dd className={s.cardData} style={{ width: '330px' }}>
            <span className={s.marginBottom4}>
              {getValueOrSpinner(+numberOfMainlyFilPlusProviders)}
            </span>
            <span className={s.displayFlexColumn}>
              <span className={cn(s.label, s.primary, s.margin0)}>
                <b>
                  {getValueOrSpinner(
                    Math.round(
                      (+numberOfMainlyFilPlusProviders * 10000) /
                        +numberOfProviders
                    )
                  ) / 100}
                  %
                </b>
                of SP IDs with at least 1 active Fil+ deal
              </span>
              <span className={cn(s.label, s.secondary, s.margin4000)}>
                <b>
                  {getValueOrSpinner(
                    Math.round(
                      (+numberOfMainlyFilPlusProviders * 10000) /
                        +totalNumberOfProviders
                    )
                  ) / 100}
                  %
                </b>
                of all active SP IDs on chain
              </span>
            </span>
          </dd>
        </dl>

        {/* <dl className={cn(s.card, s.size6)}>
          <dt className={s.cardTitle}>
            <span>Network investment footprint</span>
          </dt>
          <dd className={s.cardData}>
            <div className={s.flexContainer}>
              <div className={s.flexItem}>
                <div className={s.flexTitle}>
                  Estimated hardware investment in verified deal storage. &nbsp;
                  <a href="https://calc.filecoin.eu/calculator" target="_blank">
                    ROI calculator
                  </a>
                  <Tooltip>
                    Estimated hardware investment required to support current
                    verified deals on network, using an approximate of $36,667
                    per PiB for the average SP in the network today, based on
                    the SP size and cost analysis.
                  </Tooltip>
                </div>
                <div>{getValueOrSpinner(USDollar.format(investmentCost))}</div>
              </div>

              <div className={s.flexItem}>
                <div className={s.flexTitle}>
                  Current collateral supporting verified deal storage
                </div>
                <div>
                  {getValueOrSpinner(
                    `${collateralAsString.substring(
                      0,
                      collateralAsString.indexOf('.')
                    )} FIL`
                  )}
                </div>
              </div>

              <div className={s.flexItem}>
                <div className={s.flexTitle}>Total collateral in sectors</div>
                <div>
                  {getValueOrSpinner(
                    `${sectorPledgeAsString.substring(
                      0,
                      sectorPledgeAsString.indexOf('.')
                    )} FIL`
                  )}
                </div>
              </div>
            </div>
          </dd>
        </dl>*/}

        <dl className={cn(s.card, s.size6)}>
          <dt className={s.cardTitle}>
            <span>DataCap flow</span>
          </dt>
          <dd>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Sankey
                width={1000}
                height={500}
                margin={{
                  left: 0,
                  right: 300,
                  top: 0,
                  bottom: 50,
                }}
                node={<SankeyNode containerWidth={600} />}
                data={{
                  nodes: [
                    { name: 'Datacap created' },
                    {
                      name: 'Direct allocation allocators',
                      percent: getPercent(
                        totalDC,
                        totalAmountOfDatacapGrantedToNotaries
                      ),
                      percentLabel: ' of total created datacap',
                    },
                    {
                      name: 'LDN allocators',
                      percent: getPercent(
                        totalDC,
                        LDNv3totalAmountOfDatacapGrantedToNotary
                      ),
                      percentLabel: ' of total created datacap',
                    },
                    {
                      name: 'E-Fil+ allocators',
                      percent: getPercent(
                        totalDC,
                        EFilTotalAmountOfDatacapGrantedToNotary
                      ),
                      percentLabel: ' of total created datacap',
                    },

                    {
                      name: 'Direct allocation clients',
                      percent: getPercent(
                        totalAmountOfDatacapGrantedToNotaries,
                        totalAmountOfDatacapGrantedToClients
                      ),
                      percentLabel: ' of allocated datacap',
                    },
                    {
                      name: 'LDN clients',
                      percent: getPercent(
                        LDNv3totalAmountOfDatacapGrantedToNotary,
                        LDNv3totalAmountOfDatacapGrantedToClients
                      ),
                      percentLabel: ' of allocated datacap',
                    },
                    {
                      name: 'E-Fil+ clients',
                      percent: getPercent(
                        EFilTotalAmountOfDatacapGrantedToNotary,
                        EFilTotalAmountOfDatacapGrantedToClients
                      ),
                      percentLabel: ' of allocated datacap',
                    },

                    {
                      name: 'Used by direct allocation clients',
                      percent: getPercent(
                        totalAmountOfDatacapGrantedToClients,
                        totalAmountOfDatacapUsedByClients
                      ),
                      percentLabel: ' of allocated datacap',
                    },
                    {
                      name: 'Used by LDN clients',
                      percent: getPercent(
                        LDNv3totalAmountOfDatacapGrantedToClients,
                        LDNv3totalAmountOfDatacapUsedByClients
                      ),
                      percentLabel: ' of allocated datacap',
                    },
                    {
                      name: 'Used by E-Fil+ clients',
                      percent: getPercent(
                        EFilTotalAmountOfDatacapGrantedToClients,
                        EFiltotalAmountOfDatacapUsedByClients
                      ),
                      percentLabel: ' of allocated datacap',
                    },
                  ],
                  links: [
                    {
                      source: 0,
                      target: 1,
                      value: +totalAmountOfDatacapGrantedToNotaries,
                    },
                    {
                      source: 0,
                      target: 2,
                      value: +LDNv3totalAmountOfDatacapGrantedToNotary,
                    },
                    {
                      source: 0,
                      target: 3,
                      value: +EFilTotalAmountOfDatacapGrantedToNotary,
                    },
                    {
                      source: 1,
                      target: 4,
                      value: +totalAmountOfDatacapGrantedToClients,
                    },
                    {
                      source: 2,
                      target: 5,
                      value: +LDNv3totalAmountOfDatacapGrantedToClients,
                    },
                    {
                      source: 3,
                      target: 6,
                      value: +EFilTotalAmountOfDatacapGrantedToClients,
                    },

                    {
                      source: 4,
                      target: 7,
                      value: +totalAmountOfDatacapUsedByClients,
                    },
                    {
                      source: 5,
                      target: 8,
                      value: +LDNv3totalAmountOfDatacapUsedByClients,
                    },
                    {
                      source: 6,
                      target: 9,
                      value: +EFiltotalAmountOfDatacapUsedByClients,
                    },
                  ],
                }}
                nodePadding={50}
                link={{ stroke: '#77c878' }}
              >
                <ReTooltip content={renderTooltip}></ReTooltip>
              </Sankey>
            </div>
          </dd>
        </dl>

        <h3 className={cn('h3', s.sectionTitle)}>
          Network investment footprint
        </h3>

        <dl className={cn(s.card, s.size3)}>
          <dt className={s.cardTitle}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex' }}>
                <span>
                  Estimated hardware investment in verified deal storage. &nbsp;
                </span>
                <Tooltip>
                  Estimated hardware investment required to support current
                  verified deals on network, using an approximate of $36,667 per
                  PiB for the average SP in the network today, based on the SP
                  size and cost analysis.
                  <br />
                  It's important to note that this is a conservative estimate,
                  as we have not factored in the additional base setup cost per
                  SP.
                </Tooltip>
              </div>
              <a href="https://calc.filecoin.eu/calculator" target="_blank">
                ROI calculator
              </a>
            </div>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(USDollar.format(investmentCost))}
          </dd>
        </dl>

        {/* <dl className={cn(s.card, s.size2)}>
          <dt className={s.cardTitle}>
            <span>Current collateral supporting verified deal storage</span>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(
              `${collateralAsString.substring(
                0,
                collateralAsString.indexOf('.')
              )} FIL`
            )}
          </dd>
        </dl> */}

        <dl className={cn(s.card, s.size3)}>
          <dt className={s.cardTitle}>
            <span>Estimated collateral in sectors</span>
            <Tooltip>
              Estimated collateral locked up in sector initial pledge. This
              value is computed by multiplying the total sector initial pledge
              with the ratio between the total regular deal size and total
              verified deal size.
            </Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(
              `${sectorPledgeAsString.substring(
                0,
                sectorPledgeAsString.indexOf('.')
              )} FIL`
            )}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size6)}>
          <dt
            className={s.cardTitle}
            style={{ fontSize: '14px', fontWeight: 'bold' }}
          >
            CID deal distribution analysis (
            {toggle ? 'by deal size' : 'by deal number'})
            <Tooltip>
              We define "Well-distributed deals" as the set of deals that
              fulfill the following three conditions:
              <br />
              1. No duplicate CID per client per provider
              <br />
              2. No CID sharing across clients
              <br />
              3. Unique CID for clients that have onboarded &gt; 1PiB and have
              not made a deal for last 6 weeks
            </Tooltip>
            <Switch
              className={s.toggleSwitch}
              onToggle={(switchValue) => setToggle(switchValue)}
            />
          </dt>
          {marketDealsStateCumulativePerDayLoaded &&
            marketDealsStatePerWeekLoaded &&
            marketDealsStatePerDayLoaded &&
            !toggle && (
              <MarketDealsState
                marketDealsState={{
                  processedMarketDealStateCumulativePerDay: marketDealsStateCumulativePerDay,
                  processedMarketDealStatePerDay: marketDealsStatePerDay,
                  processedMarketDealStatePerWeek: marketDealsStatePerWeek,
                }}
              />
            )}

          {marketDealsStateCumulativePerDayBySizeLoaded &&
            marketDealsStatePerWeekBySizeLoaded &&
            marketDealsStatePerDayBySizeLoaded &&
            toggle && (
              <MarketDealsStateBySize
                marketDealsState={{
                  processedMarketDealStateCumulativePerDay: marketDealsStateCumulativePerDayBySize,
                  processedMarketDealStatePerDay: marketDealsStatePerDayBySize,
                  processedMarketDealStatePerWeek: marketDealsStatePerWeekBySize,
                }}
              />
            )}
        </dl>
      </div>
    </div>
  );
}

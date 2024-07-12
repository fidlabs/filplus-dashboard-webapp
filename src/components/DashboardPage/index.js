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
import { useEffect, useState } from 'react';
import { MarketDealsStateBySize } from './marketDealsStateBySize';
import { useGlifFetch } from 'hooks/glifFetch';
import CronStats from 'components/CronStats';
import { StatusTooltip } from 'components/StatusTooltip';
import { Radio } from 'components/Radio';
// import isFinite from 'lodash/isFinite';

export default function DashboardPage() {
  const fetchUrl = '/getFilPlusStatsV2';
  const [toggle, setToggle] = useState(false);

  const [data, { loading, loaded }] = useFetch(fetchUrl);

  const [cronStates, { loaded: cronStatesLoaded }] = useFetch('/getCronStates');
  // const [
  //   marketDealsStateCumulativePerDay,
  //   { loaded: marketDealsStateCumulativePerDayLoaded },
  // ] = useFetch('/timescale/get-market-deals-state/cumulative/per-day');
  // const [
  //   marketDealsStatePerDay,
  //   { loaded: marketDealsStatePerDayLoaded },
  // ] = useFetch('/timescale/get-market-deals-state/per-day');
  // const [
  //   marketDealsStatePerWeek,
  //   { loaded: marketDealsStatePerWeekLoaded },
  // ] = useFetch('/timescale/get-market-deals-state/per-week');

  const {
    totalDcStoredDealsV2,
    totalDcStoredClaims,

    numberOfClients,
    numberOfProviders,

    avgTTDIn95thPercentile,

    numberOfActiveNotariesV2,
    totalVerifiedDealCollateral,

    totalAmountOfDatacapGrantedToNotaries,
    totalAmountOfDatacapGrantedToClients,
    totalAmountOfDatacapUsedByClients,

    LDNv3totalAmountOfDatacapGrantedToNotary,
    LDNv3totalAmountOfDatacapGrantedToClients,
    LDNv3totalAmountOfDatacapUsedByClients,

    EFilTotalAmountOfDatacapGrantedToNotary,
    EFilTotalAmountOfDatacapGrantedToClients,
    EFiltotalAmountOfDatacapUsedByClients,

    numberOfMainlyFilPlusProviders,
    totalNumberOfProviders,
    investmentCost,

    countOfClientsWhoReceiveMoreThan100TibDatacap,
    countOfClientsWhoUsedMoreThan90PercentOfRequestedDatacap,
    totalNewInitialPledge,
    sankeyChartData,
  } = data;

  const [radioFilter, setRadioFilter] = useState({
    option1: true,
    option2: false,
    option3: false,
    option4: false,
  });

  const [sankeyChartHeight, setSankeyChartHeight] = useState(300);

  const [ldnAllowanceGroupedData, setLdnAllowanceGroupedData] = useState({
    nodes: [],
    links: [],
  });

  useEffect(() => {
    setLdnAllowanceGroupedData({
      nodes: [],
      links: [
        {
          source: 2,
          target: 5,
          value: +LDNv3totalAmountOfDatacapGrantedToClients,
        },
      ],
    });
  }, LDNv3totalAmountOfDatacapGrantedToClients);

  let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const sankeyChartsDataDecoded = JSON.parse(sankeyChartData || '{}');

  const humanReadableNameForNode = (nodeName) => {
    if (nodeName === 'totalSubsequentAllocations')
      return 'Subsequent Allocations';
    if (nodeName === 'totalFirstAllocation') return 'First Allocation';

    if (nodeName === 'ttdGreaterThan2Days') return 'TTD > 2days';
    if (nodeName === 'ttd1Day') return 'TTD < 1 day';
    if (nodeName === 'ttdNotComputed') return 'TTD unknown';
    if (nodeName === 'ttd2Days') return '1 day < TTD < 2 days';

    if (nodeName === 'unknown') return 'Unknown region';

    return nodeName;
  };

  const buildSankeyChartNodes = (name, filter, dataSource) => {
    const res = [];
    if (name ? sankeyChartsDataDecoded[name] : dataSource) {
      for (const nodeName of filter ||
        Object.keys(name ? sankeyChartsDataDecoded[name] : dataSource)) {
        res.push({
          name: humanReadableNameForNode(nodeName),
          percent: getPercent(
            LDNv3totalAmountOfDatacapGrantedToClients,
            name
              ? sankeyChartsDataDecoded[name][nodeName]
              : dataSource[nodeName]
          ),
          percentLabel: ' of allocated datacap',
        });
      }
    }
    return res;
  };

  const buildSankeyChartLinks = (name, filter, dataSource) => {
    const res = [];
    if (name ? sankeyChartsDataDecoded[name] : dataSource) {
      let index = 0;
      for (const nodeName of filter ||
        Object.keys(name ? sankeyChartsDataDecoded[name] : dataSource)) {
        res.push({
          source: 2,
          target: 10 + index,
          value: name
            ? +sankeyChartsDataDecoded[name][nodeName]
            : dataSource[nodeName],
        });

        res.push({
          source: 10 + index,
          target: 5,
          value: name
            ? +sankeyChartsDataDecoded[name][nodeName]
            : dataSource[nodeName],
        });

        index++;
      }
    }
    return res;
  };

  const buildSankeyChartRegionNodes = () => {
    const regions = {
      'Asia without GCR': ['Asia', 'Japan', 'Singapore', 'Korea, Republic of'],
      'Greater China Region (GCR)': ['China', 'Hong Kong'],
      'North America': ['North America', 'United States', 'Canada'],
      'South America': ['South America'],
      Europe: [
        'Europe',
        'Italy',
        'United Kingdom',
        'Switzerland',
        'France',
        'Finland',
        'Poland',
        'Germany',
      ],
      Africa: ['South Africa'],
      Oceania: ['American Samoa', 'Oceania'],
      unknown: ['unknown'],
    };

    const processedRegions = {};
    if (sankeyChartsDataDecoded && sankeyChartsDataDecoded['byRegion']) {
      // console.log('start mismatch search');
      // for (const region of Object.keys(sankeyChartsDataDecoded['byRegion'])) {
      //   let found = false;
      //   for (const groupRegion of Object.keys(regions)) {
      //     if (regions[groupRegion].indexOf(region) > -1) found = true;
      //   }
      //   if (!found) console.log(region);
      // }
      // console.log('end mismatch search');

      for (const groupRegion of Object.keys(regions)) {
        let regionAllowance = 0;
        for (const region of regions[groupRegion]) {
          regionAllowance += +sankeyChartsDataDecoded['byRegion'][region] || 0;
        }
        processedRegions[groupRegion] = regionAllowance;
      }
    }
    return processedRegions;
  };

  const onSankeySelectionChange = (option) => {
    const filter = {
      option1: false,
      option2: false,
      option3: false,
      option4: false,
    };

    if (option === 'option1') {
      setRadioFilter({ ...filter, option1: true });
      setSankeyChartHeight(300);
      setLdnAllowanceGroupedData({
        nodes: [],
        links: [
          {
            source: 2,
            target: 5,
            value: +LDNv3totalAmountOfDatacapGrantedToClients,
          },
        ],
      });
    }
    if (option === 'option2') {
      setRadioFilter({ ...filter, option2: true });
      setSankeyChartHeight(300);
      setLdnAllowanceGroupedData({
        nodes: buildSankeyChartNodes('byNumberOfAllocation'),
        links: buildSankeyChartLinks('byNumberOfAllocation'),
      });
    }
    if (option === 'option3') {
      setRadioFilter({ ...filter, option3: true });
      setSankeyChartHeight(500);
      setLdnAllowanceGroupedData({
        nodes: buildSankeyChartNodes('byTTD', [
          'ttd1Day',
          'ttd2Days',
          'ttdGreaterThan2Days',
          'ttdNotComputed',
        ]),
        links: buildSankeyChartLinks('byTTD', [
          'ttd1Day',
          'ttd2Days',
          'ttdGreaterThan2Days',
          'ttdNotComputed',
        ]),
      });
    }
    if (option === 'option4') {
      setRadioFilter({ ...filter, option4: true });
      setSankeyChartHeight(900);
      setLdnAllowanceGroupedData({
        nodes: buildSankeyChartNodes(
          false,
          null,
          buildSankeyChartRegionNodes()
        ),
        links: buildSankeyChartLinks(
          false,
          null,
          buildSankeyChartRegionNodes()
        ),
      });
    }
  };

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
            <span>Data stored in published verified deals</span>
            <StatusTooltip
              cronStates={cronStates}
              cronStatesLoaded={cronStatesLoaded}
              dependencies={['upsertDealData']}
            />
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(
              convertBytesToIEC(
                Number(totalDcStoredDealsV2) + Number(totalDcStoredClaims)
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
            <StatusTooltip
              cronStates={cronStates}
              cronStatesLoaded={cronStatesLoaded}
              dependencies={['computeTTD']}
            />
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
            <StatusTooltip
              cronStates={cronStates}
              cronStatesLoaded={cronStatesLoaded}
              dependencies={[
                'getVerifiedRegistryMessages',
                'processVerifiedRegistryMessages',
              ]}
            />
          </dt>
          <dd className={s.cardData}>
            <span className={s.marginBottom4}>
              {getValueOrSpinner(numberOfActiveNotariesV2)}
            </span>
          </dd>
        </dl>

        <dl
          className={cn(s.card, s.size3)}
          style={{ justifyContent: 'flex-start' }}
        >
          <dt className={s.cardTitle}>
            <span>Unique client addresses that have received DataCap</span>
            <StatusTooltip
              cronStates={cronStates}
              cronStatesLoaded={cronStatesLoaded}
              dependencies={[
                'getVerifiedRegistryMessages',
                'processVerifiedRegistryMessages',
              ]}
            />
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
            </span>
          </dd>
        </dl>

        <dl className={cn(s.card, s.size3)}>
          <dt className={s.cardTitle}>
            <span>SP IDs with &gt; 75% capacity in verified deals</span>
            <StatusTooltip
              cronStates={cronStates}
              cronStatesLoaded={cronStatesLoaded}
              dependencies={[
                'getVerifiedRegistryMessages',
                'processVerifiedRegistryMessages',
                'upsertDealData',
              ]}
            />
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
            <StatusTooltip
              cronStates={cronStates}
              cronStatesLoaded={cronStatesLoaded}
              dependencies={[
                'getAllowanceAuditTrail',
                'getVerifiedRegistryMessages',
                'processVerifiedRegistryMessages',
                'updateAllowancesFromDataCapActor',
                'upsertDealData',
                'computeTTD',
              ]}
            />

            <div style={{ marginLeft: 'auto' }}>
              Group LDN allowances by:
              <Radio
                label="No Grouping"
                value={radioFilter.option1}
                onChange={() => {
                  onSankeySelectionChange('option1');
                }}
              />
              <Radio
                label="Allocation number"
                value={radioFilter.option2}
                onChange={() => {
                  onSankeySelectionChange('option2');
                }}
              />
              <Radio
                label="TTD"
                value={radioFilter.option3}
                onChange={() => {
                  onSankeySelectionChange('option3');
                }}
              />
              <Radio
                label="Location"
                value={radioFilter.option4}
                onChange={() => {
                  onSankeySelectionChange('option4');
                }}
              />
            </div>
          </dt>
          <dd style={{ position: 'relative' }}>
            <div
              style={{
                display: 'block',
                height: '5px',
                background: '#fff',
                width: '100%',
                position: 'absolute',
                zIndex: 1,
              }}
            ></div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Sankey
                width={1300}
                height={sankeyChartHeight}
                margin={{
                  left: 0,
                  right: 300,
                  top: 5,
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

                    ...ldnAllowanceGroupedData.nodes,
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

                    ...ldnAllowanceGroupedData.links,

                    // {
                    //   source: 2,
                    //   target: 5,
                    //   value: +LDNv3totalAmountOfDatacapGrantedToClients,
                    // },

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
            {/* {renderStatusIndicator(['processDataForExtraStats'])} */}
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
            <StatusTooltip
              cronStates={cronStates}
              cronStatesLoaded={cronStatesLoaded}
              dependencies={['getLockedFilBreakdownStats']}
            />
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

        <CronStats
          dashboardCrons={['processDataForExtraStats']}
          scraperCrons={[]}
        ></CronStats>
      </div>
    </div>
  );
}

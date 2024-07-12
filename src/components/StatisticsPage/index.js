import cn from 'classnames';
import { useFetch } from 'hooks/fetch';
import { convertBytesToIEC } from 'utils/bytes';
import { formatDuration } from 'utils/formatDuration';
import { getFormattedFIL } from 'utils/numbers';
import { Spinner } from 'components/Spinner';
import { Tooltip } from 'components/Tooltip';
import s from './s.module.css';
import { useEffect, useState } from 'react';
import Switch from '../Switch';
import CronStats from 'components/CronStats';

export default function StatisticsPage() {
  const [percentileToggle, setPercentileToggle] = useState({
    ttdTotal: {
      activeKey: 95,
      50: null,
      95: null,
    },
    ttdTotal_without_auto: {
      activeKey: 95,
      50: null,
      95: null,
    },
    ttdDirect: {
      activeKey: 95,
      50: null,
      95: null,
    },
    ttdLdn: {
      activeKey: 95,
      50: null,
      95: null,
    },
    ttdFirstAllocation: {
      activeKey: 95,
      50: null,
      95: null,
    },
    ttdFirstRequest: {
      activeKey: 95,
      50: null,
      95: null,
    },
    ttdEfil: {
      activeKey: 95,
      50: null,
      95: null,
    },
    ttdLdnV3: {
      activeKey: 95,
      50: null,
      95: null,
    },
  });

  const fetchUrl = '/getFilPlusExtraStats';
  const [data, { loading }] = useFetch(fetchUrl);

  const {
    totalDcStored,

    TTD,
    TTD4W,
    TTD_direct,
    TTD95thPercentile_direct,
    TTD50thPercentile_direct,
    TTD4W_direct,
    TTD_ldn,
    TTD4W_ldn,
    TTD95thPercentile_ldn,
    TTD50thPercentile_ldn,
    percentOfAllocatedDatacapFromTotal,
    percentOfUsedDataFromDatacapGrantedToClients,
    percentOfUsedDataFromDatacapGrantedToNotaries,
    totalAmountOfDatacapGrantedToClients,
    totalAmountOfDatacapUsedByClients,
    totalAmountOfDatacapGrantedToNotaries,
    totalAmountOfDatacapGrantedToLDNNotaries,

    totalReceivedDirectApplications,
    totalReceivedDirectApplicationsInLast30Days,
    totalApprovedDirectApplications,
    totalApprovedDirectApplicationsInLast30Days,
    totalReceivedLdnApplications,
    totalReceivedLdnApplicationsInLast30Days,
    totalValidatedLdnApplications,
    totalValidatedLdnApplicationsInLast30Days,
    totalApprovedLdnApplications,
    totalApprovedLdnApplicationsInLast30Days,

    secondsToFirstResponse,
    secondsToFirstResponseLast30Days,
    percentOfApplicantsWhoGotAFirstResponse,
    secondsToAllocation,

    percentOfSuccesfullAllocationRequests,

    numberOfIssuesCreatedByClient,
    allocationRequestsPerMonth,
    successfullAllocationRequestsPerMonth,

    percentOfApplicantsWhoGotAnAllocation,
    averageDealSizePerClient,
    averageDatacapDealsPerCLient,

    numberOfProviders,
    numberOfNewProviders,
    averageDealSize,

    averageDealLength,
    averageDealPrice,
    allowanceHistoricData,
    runningTotalHistoricData,
    datacapHistoricUsageData,
    runningTotalDatacapHistoricData,

    TTD_without_auto,
    TTD4W_without_auto,
    TTD95thPercentile_without_auto,
    TTD50thPercentile_without_auto,

    LDNtotalAmountOfDatacapGrantedToClients,
    LDNtotalAmountOfDatacapUsedByClients,
    LDNpercentOfAllocatedDatacapFromTotal,
    LDNpercentOfUsedDataFromDatacapGrantedToClients,
    LDNpercentOfUsedDataFromDatacapGrantedToNotaries,

    avgTTDIn95thPercentile,
    avgTTDIn50thPercentile,
    avgTTDForLdnFirstAllocation,
    avgTTDForLdnFirstAllocationIn95ThPercentile,
    avgTTDForLdnFirstAllocationIn50ThPercentile,
    avgTTDForLdnFirstAllocationInLast30Days,
    avgTimeBetweenIssueTimestampAndLdnFirstRequest,
    avgTimeBetweenIssueTimestampAndLdnFirstRequestIn95thPercentile,
    avgTimeBetweenIssueTimestampAndLdnFirstRequestIn50thPercentile,
    avgTimeBetweenIssueTimestampAndLdnFirstRequestInLast30Days,

    minerWeeklyStats,

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

    TTD_ldnV3,
    TTD95thPercentile_ldnV3,
    TTD50thPercentile_ldnV3,
    TTD4W_ldnV3,

    TTD_EFil,
    TTD95thPercentile_EFil,
    TTD50thPercentile_EFil,
    TTD4W_EFil,
  } = data;

  useEffect(() => {
    if (!Object.keys(data).length) {
      return;
    }

    setPercentileToggle({
      ttdTotal: {
        activeKey: 95,
        50: avgTTDIn50thPercentile,
        95: avgTTDIn95thPercentile,
      },
      ttdTotal_without_auto: {
        activeKey: 95,
        50: TTD50thPercentile_without_auto,
        95: TTD95thPercentile_without_auto,
      },
      ttdDirect: {
        activeKey: 95,
        50: TTD50thPercentile_direct,
        95: TTD95thPercentile_direct,
      },
      ttdLdn: {
        activeKey: 95,
        50: TTD50thPercentile_ldn,
        95: TTD95thPercentile_ldn,
      },
      ttdFirstAllocation: {
        activeKey: 95,
        50: avgTTDForLdnFirstAllocationIn50ThPercentile,
        95: avgTTDForLdnFirstAllocationIn95ThPercentile,
      },
      ttdFirstRequest: {
        activeKey: 95,
        50: avgTimeBetweenIssueTimestampAndLdnFirstRequestIn50thPercentile,
        95: avgTimeBetweenIssueTimestampAndLdnFirstRequestIn95thPercentile,
      },
      ttdEfil: {
        activeKey: 95,
        50: TTD50thPercentile_EFil,
        95: TTD95thPercentile_EFil,
      },
      ttdLdnV3: {
        activeKey: 95,
        50: TTD50thPercentile_ldnV3,
        95: TTD95thPercentile_ldnV3,
      },
    });
  }, [data]);

  const switchPercentile = (switchValue, ttdKey) => {
    if (switchValue) {
      setPercentileToggle((prev) => ({
        ...prev,
        [ttdKey]: {
          ...prev[ttdKey],
          activeKey: 50,
        },
      }));
    } else {
      setPercentileToggle((prev) => ({
        ...prev,
        [ttdKey]: {
          ...prev[ttdKey],
          activeKey: 95,
        },
      }));
    }
  };

  const getValueOrSpinner = (value, spinnerSize = 24) => {
    return loading ? (
      <Spinner width={spinnerSize} height={spinnerSize} />
    ) : (
      value
    );
  };

  return (
    <div className="container">
      <div className={s.grid}>
        <h3 className={cn('h3', s.sectionTitle)}>Overview</h3>

        <dl className={cn(s.card, s.size3)}>
          <dt className={s.cardTitle}>
            <span>
              Average TTD ({percentileToggle?.ttdTotal?.activeKey}th Percentile)
            </span>
            <Tooltip>
              {percentileToggle?.ttdTotal?.activeKey}th percentile of time it
              takes to get DataCap (including both LDN + Direct)
            </Tooltip>
            <Switch
              className={s.toggleSwitch}
              onToggle={(switchValue) =>
                switchPercentile(switchValue, 'ttdTotal')
              }
            />
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(
              formatDuration(
                percentileToggle?.ttdTotal[
                  percentileToggle?.ttdTotal?.activeKey
                ]
              )
            )}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size3)}>
          <dt className={s.cardTitle}>
            <span>Average TTD (last 30 days)</span>
            <Tooltip>
              Average amount of time it takes to get DataCap (including both LDN
              + direct allocation) over the last 30 days
            </Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(formatDuration(TTD4W))}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size3)}>
          <dt className={s.cardTitle}>
            <span>
              Average TTD without automated allocator allowances (
              {percentileToggle?.ttdTotal_without_auto?.activeKey}th Percentile)
            </span>
            <Tooltip>
              {percentileToggle?.ttdTotal_without_auto?.activeKey}th percentile
              of time it takes to get DataCap (including both LDN + EFil)
            </Tooltip>
            <Switch
              className={s.toggleSwitch}
              onToggle={(switchValue2) =>
                switchPercentile(switchValue2, 'ttdTotal_without_auto')
              }
            />
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(
              formatDuration(
                percentileToggle?.ttdTotal_without_auto[
                  percentileToggle?.ttdTotal_without_auto?.activeKey
                ]
              )
            )}
          </dd>
        </dl>
        <dl className={cn(s.card, s.size3)}>
          <dt className={s.cardTitle}>
            <span>
              Average TTD without automated allocator allowances (last 30 days)
            </span>
            <Tooltip>
              Average amount of time it takes to get DataCap (including both LDN
              + EFil) over the last 30 days
            </Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(formatDuration(TTD4W_without_auto))}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size6)}>
          <dt className={s.cardTitle}>
            <span>Data stored in published verified deals</span>
            <Tooltip>
              Total amount of DataCap (LDN + direct allocation) used by clients
              in published verified deals
            </Tooltip>
          </dt>
          <dd className={s.cardData}>
            <span>{getValueOrSpinner(convertBytesToIEC(totalDcStored))}</span>
          </dd>
        </dl>

        <dl className={cn(s.card, s.size3)}>
          <dt className={s.cardTitle}>
            <span>Storage Providers participating in Fil+</span>
            <Tooltip>Number of storage providers participating in Fil+</Tooltip>
          </dt>
          <dd className={s.cardData}>{getValueOrSpinner(numberOfProviders)}</dd>
        </dl>

        <dl className={cn(s.card, s.size3)}>
          <dt className={s.cardTitle}>
            <span>
              New Storage Providers participating in Fil+ deals (last 4 weeks)
            </span>
            <Tooltip>
              New storage providers participating in Fil+ deals in the last 4
              weeks
            </Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(numberOfNewProviders)}
          </dd>
        </dl>

        <h3 className={cn('h3', s.sectionTitle)}>LDN allocations</h3>

        <dl className={cn(s.card, s.size2)}>
          <dt className={s.cardTitle}>
            <span>Average TTD</span>
            <Tooltip>
              Average time it takes to get the first tranche of DataCap for LDN
              applications
            </Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(formatDuration(TTD_ldn))}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2)}>
          <dt className={cn(s.cardTitle)}>
            <span>
              Average TTD ({percentileToggle?.ttdLdn?.activeKey}th percentile)
            </span>
            <Tooltip>
              ({percentileToggle?.ttdLdn?.activeKey}th percentile) percentile of
              average time it takes to get DataCap for LDN applications
            </Tooltip>
            <Switch
              className={s.toggleSwitch}
              onToggle={(switchValue) =>
                switchPercentile(switchValue, 'ttdLdn')
              }
            />
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(
              formatDuration(
                percentileToggle?.ttdLdn[percentileToggle?.ttdLdn?.activeKey]
              )
            )}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2)}>
          <dt className={s.cardTitle}>
            <span>Average TTD (last 30 days)</span>
            <Tooltip>
              Average amount of time it takes to get DataCap for LDN
              applications over the last 30 days
            </Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(formatDuration(TTD4W_ldn))}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2, s.justifyContentStart)}>
          <dt className={s.cardTitle}>
            <span>DataCap granted</span>
            <Tooltip>
              Total amount of DataCap across LDN applications that have received
              at least one tranche of DataCap
            </Tooltip>
          </dt>
          <dd className={cn(s.cardData, s.alignItemsStart)}>
            {getValueOrSpinner(
              convertBytesToIEC(totalAmountOfDatacapGrantedToLDNNotaries)
            )}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2, s.justifyContentStart)}>
          <dt className={s.cardTitle}>
            <span>DataCap allocated to clients</span>
            <Tooltip>
              Total amount of DataCap allocated to clients by LDNs
            </Tooltip>
          </dt>
          <dd className={cn(s.cardData, s.alignItemsStart)}>
            <span className={s.marginBottom4}>
              {getValueOrSpinner(
                convertBytesToIEC(LDNtotalAmountOfDatacapGrantedToClients)
              )}
            </span>
            <span className={cn(s.label, s.primary, s.margin0)}>
              <b>
                {getValueOrSpinner(LDNpercentOfAllocatedDatacapFromTotal, 16)}%
              </b>
              of total LDN DataCap
            </span>
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2, s.justifyContentStart)}>
          <dt className={s.cardTitle}>
            <span>DataCap used by clients in deals or deal proposals</span>
            <Tooltip>
              Total amount of DataCap granted by LDNs used by clients in deals
              or deal proposals
            </Tooltip>
          </dt>
          <dd className={cn(s.cardData, s.alignItemsStart)}>
            <span className={s.marginBottom4}>
              {getValueOrSpinner(
                convertBytesToIEC(LDNtotalAmountOfDatacapUsedByClients)
              )}
            </span>
            <span className={s.displayFlexColumn}>
              <span className={cn(s.label, s.primary, s.margin0)}>
                <b>
                  {getValueOrSpinner(
                    LDNpercentOfUsedDataFromDatacapGrantedToClients,
                    16
                  )}
                  %
                </b>
                of LDN DataCap allocated to clients
              </span>
              <span className={cn(s.label, s.secondary, s.margin4000)}>
                <b>
                  {getValueOrSpinner(
                    LDNpercentOfUsedDataFromDatacapGrantedToNotaries,
                    16
                  )}
                  %
                </b>
                of total LDN DataCap
              </span>
            </span>
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2)}>
          <dt className={s.cardTitle}>
            <span>Average time to first DataCap request</span>
            <Tooltip>
              Average time it takes to fulfill first DataCap request for LDN
              applications
            </Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(
              formatDuration(avgTimeBetweenIssueTimestampAndLdnFirstRequest)
            )}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2)}>
          <dt className={s.cardTitle}>
            <span>
              Average time to first DataCap request (
              {percentileToggle?.ttdFirstRequest?.activeKey}th percentile)
            </span>
            <Tooltip>
              {percentileToggle?.ttdFirstRequest?.activeKey}th percentile of
              average time it takes to fulfill first DataCap request for LDN
              applications
            </Tooltip>
            <Switch
              className={s.toggleSwitch}
              onToggle={(switchValue) =>
                switchPercentile(switchValue, 'ttdFirstRequest')
              }
            />
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(
              formatDuration(
                percentileToggle?.ttdFirstRequest[
                  percentileToggle?.ttdFirstRequest?.activeKey
                ]
              )
            )}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2)}>
          <dt className={s.cardTitle}>
            <span>Average time to first DataCap request (last 30 days)</span>
            <Tooltip>
              Average amount of average time it takes to fulfill first DataCap
              request for LDN applications over the last 30 days
            </Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(
              formatDuration(
                avgTimeBetweenIssueTimestampAndLdnFirstRequestInLast30Days
              )
            )}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2)}>
          <dt className={s.cardTitle}>
            <span>Average TTD for first allocation</span>
            <Tooltip>
              Average amount of time it takes to get first DataCap allocation
              for LDN applications
            </Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(formatDuration(avgTTDForLdnFirstAllocation))}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2)}>
          <dt className={s.cardTitle}>
            <span>
              Average TTD for first allocation (
              {percentileToggle?.ttdFirstAllocation?.activeKey}th percentile)
            </span>
            <Tooltip>
              {percentileToggle?.ttdFirstAllocation?.activeKey}th percentile of
              average time it takes to get first DataCap allocation for LDN
              applications
            </Tooltip>
            <Switch
              className={s.toggleSwitch}
              onToggle={(switchValue) =>
                switchPercentile(switchValue, 'ttdFirstAllocation')
              }
            />
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(
              formatDuration(
                percentileToggle?.ttdFirstAllocation[
                  percentileToggle?.ttdFirstAllocation?.activeKey
                ]
              )
            )}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2)}>
          <dt className={s.cardTitle}>
            <span>Average TTD for first allocation (last 30 days)</span>
            <Tooltip>
              Average amount of time it takes to get first DataCap allocation
              for LDN applications over the last 30 days
            </Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(
              formatDuration(avgTTDForLdnFirstAllocationInLast30Days)
            )}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2)}>
          <dt className={s.cardTitle}>
            <span>Applications received</span>
            <Tooltip>Total number of LDN applications received</Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(totalReceivedLdnApplications)}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2)}>
          <dt className={s.cardTitle}>
            <span>Applications validated</span>
            <Tooltip>Total number of LDN applications validated</Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(totalValidatedLdnApplications)}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2)}>
          <dt className={s.cardTitle}>
            <span>Applications approved</span>
            <Tooltip>Total number of LDN applications approved</Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(totalApprovedLdnApplications)}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2)}>
          <dt className={s.cardTitle}>
            <span>Applications received (last 30 days)</span>
            <Tooltip>
              Total number of LDN applications received in the last 30 days
            </Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(totalReceivedLdnApplicationsInLast30Days)}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2)}>
          <dt className={s.cardTitle}>
            <span>Applications validated (last 30 days)</span>
            <Tooltip>
              Total number of LDN applications validated in the last 30 days
            </Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(totalValidatedLdnApplicationsInLast30Days)}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2)}>
          <dt className={s.cardTitle}>
            <span>Applications approved (last 30 days)</span>
            <Tooltip>
              Total number of LDN applications approved in the last 30 days
            </Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(totalApprovedLdnApplicationsInLast30Days)}
          </dd>
        </dl>

        <h3 className={cn('h3', s.sectionTitle)}>LDN v3 allocations</h3>

        <dl className={cn(s.card, s.size2)}>
          <dt className={s.cardTitle}>
            <span>Average TTD</span>
            <Tooltip>
              Average time it takes to get the first tranche of DataCap for LDN
              applications
            </Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(formatDuration(TTD_ldnV3))}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2)}>
          <dt className={s.cardTitle}>
            <span>
              Average TTD ({percentileToggle?.ttdLdnV3?.activeKey}th percentile)
            </span>
            <Tooltip>
              {percentileToggle?.ttdLdnV3?.activeKey}th percentile of average
              time it takes to get DataCap for LDN v3 applications
            </Tooltip>
          </dt>
          <Switch
            className={s.toggleSwitch}
            onToggle={(switchValue) =>
              switchPercentile(switchValue, 'ttdLdnV3')
            }
          />
          <dd className={s.cardData}>
            {getValueOrSpinner(
              formatDuration(
                percentileToggle?.ttdLdnV3[
                  percentileToggle?.ttdLdnV3?.activeKey
                ]
              )
            )}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2)}>
          <dt className={s.cardTitle}>
            <span>Average TTD (last 30 days)</span>
            <Tooltip>
              Average amount of time it takes to get DataCap for LDN
              applications over the last 30 days
            </Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(formatDuration(TTD4W_ldnV3))}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2, s.justifyContentStart)}>
          <dt className={s.cardTitle}>
            <span>DataCap granted</span>
            <Tooltip>
              Total amount of DataCap across LDN applications that have received
              at least one tranche of DataCap
            </Tooltip>
          </dt>
          <dd className={cn(s.cardData, s.alignItemsStart)}>
            {getValueOrSpinner(
              convertBytesToIEC(LDNv3totalAmountOfDatacapGrantedToNotary)
            )}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2, s.justifyContentStart)}>
          <dt className={s.cardTitle}>
            <span>DataCap allocated to clients</span>
            <Tooltip>
              Total amount of DataCap allocated to clients by LDNs
            </Tooltip>
          </dt>
          <dd className={cn(s.cardData, s.alignItemsStart)}>
            <span className={s.marginBottom4}>
              {getValueOrSpinner(
                convertBytesToIEC(LDNv3totalAmountOfDatacapGrantedToClients)
              )}
            </span>
            <span className={cn(s.label, s.primary, s.margin0)}>
              <b>
                {getValueOrSpinner(LDNv3percentOfAllocatedDatacapFromTotal, 16)}
                %
              </b>
              of total LDN DataCap
            </span>
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2, s.justifyContentStart)}>
          <dt className={s.cardTitle}>
            <span>DataCap used by clients in deals or deal proposals</span>
            <Tooltip>
              Total amount of DataCap granted by LDNs used by clients in deals
              or deal proposals
            </Tooltip>
          </dt>
          <dd className={cn(s.cardData, s.alignItemsStart)}>
            <span className={s.marginBottom4}>
              {getValueOrSpinner(
                convertBytesToIEC(LDNv3totalAmountOfDatacapUsedByClients)
              )}
            </span>
            <span className={s.displayFlexColumn}>
              <span className={cn(s.label, s.primary, s.margin0)}>
                <b>
                  {getValueOrSpinner(
                    LDNv3percentOfUsedDataFromDatacapGrantedToClients,
                    16
                  )}
                  %
                </b>
                of LDN DataCap allocated to clients
              </span>
              <span className={cn(s.label, s.secondary, s.margin4000)}>
                <b>
                  {getValueOrSpinner(
                    LDNv3percentOfUsedDataFromDatacapGrantedToNotaries,
                    16
                  )}
                  %
                </b>
                of total LDN DataCap
              </span>
            </span>
          </dd>
        </dl>

        <h3 className={cn('h3', s.sectionTitle)}>LDN EFil+ allocations</h3>

        <dl className={cn(s.card, s.size2)}>
          <dt className={s.cardTitle}>
            <span>Average TTD</span>
            <Tooltip>
              Average time it takes to get the first tranche of DataCap for LDN
              applications
            </Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(formatDuration(TTD_EFil))}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2)}>
          <dt className={s.cardTitle}>
            <span>
              Average TTD ({percentileToggle?.ttdEfil?.activeKey}th percentile)
            </span>
            <Tooltip>
              {percentileToggle?.ttdEfil?.activeKey}th percentile of average
              time it takes to get DataCap for LDN EFil+ applications
            </Tooltip>
            <Switch
              className={s.toggleSwitch}
              onToggle={(switchValue) =>
                switchPercentile(switchValue, 'ttdEfil')
              }
            />
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(
              formatDuration(
                percentileToggle?.ttdEfil[percentileToggle?.ttdEfil?.activeKey]
              )
            )}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2)}>
          <dt className={s.cardTitle}>
            <span>Average TTD (last 30 days)</span>
            <Tooltip>
              Average amount of time it takes to get DataCap for LDN
              applications over the last 30 days
            </Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(formatDuration(TTD4W_EFil))}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2, s.justifyContentStart)}>
          <dt className={s.cardTitle}>
            <span>DataCap granted</span>
            <Tooltip>
              Total amount of DataCap across LDN applications that have received
              at least one tranche of DataCap
            </Tooltip>
          </dt>
          <dd className={cn(s.cardData, s.alignItemsStart)}>
            {getValueOrSpinner(
              convertBytesToIEC(EFilTotalAmountOfDatacapGrantedToNotary)
            )}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2, s.justifyContentStart)}>
          <dt className={s.cardTitle}>
            <span>DataCap allocated to clients</span>
            <Tooltip>
              Total amount of DataCap allocated to clients by LDNs
            </Tooltip>
          </dt>
          <dd className={cn(s.cardData, s.alignItemsStart)}>
            <span className={s.marginBottom4}>
              {getValueOrSpinner(
                convertBytesToIEC(EFilTotalAmountOfDatacapGrantedToClients)
              )}
            </span>
            <span className={cn(s.label, s.primary, s.margin0)}>
              <b>
                {getValueOrSpinner(EFilPercentOfAllocatedDatacapFromTotal, 16)}%
              </b>
              of total LDN DataCap
            </span>
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2, s.justifyContentStart)}>
          <dt className={s.cardTitle}>
            <span>DataCap used by clients in deals or deal proposals</span>
            <Tooltip>
              Total amount of DataCap granted by LDNs used by clients in deals
              or deal proposals
            </Tooltip>
          </dt>
          <dd className={cn(s.cardData, s.alignItemsStart)}>
            <span className={s.marginBottom4}>
              {getValueOrSpinner(
                convertBytesToIEC(EFiltotalAmountOfDatacapUsedByClients)
              )}
            </span>
            <span className={s.displayFlexColumn}>
              <span className={cn(s.label, s.primary, s.margin0)}>
                <b>
                  {getValueOrSpinner(
                    EFilPercentOfUsedDataFromDatacapGrantedToClients,
                    16
                  )}
                  %
                </b>
                of LDN DataCap allocated to clients
              </span>
              <span className={cn(s.label, s.secondary, s.margin4000)}>
                <b>
                  {getValueOrSpinner(
                    EFilPercentOfUsedDataFromDatacapGrantedToNotaries,
                    16
                  )}
                  %
                </b>
                of total LDN DataCap
              </span>
            </span>
          </dd>
        </dl>

        <h3 className={cn('h3', s.sectionTitle)}>
          Direct allocator allocations
        </h3>

        <dl className={cn(s.card, s.size2)}>
          <dt className={s.cardTitle}>
            <span>Average TTD</span>
            <Tooltip>
              Time it takes to get DataCap through direct allocation
            </Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(formatDuration(TTD_direct))}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2)}>
          <dt className={s.cardTitle}>
            <span>
              Average TTD ({percentileToggle?.ttdDirect?.activeKey}th
              percentile)
            </span>
            <Tooltip>
              {percentileToggle?.ttdDirect?.activeKey}th percentile of average
              time it takes to get DataCap through direct allocation
            </Tooltip>
            <Switch
              className={s.toggleSwitch}
              onToggle={(switchValue) =>
                switchPercentile(switchValue, 'ttdDirect')
              }
            />
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(
              formatDuration(
                percentileToggle?.ttdDirect[
                  percentileToggle?.ttdDirect?.activeKey
                ]
              )
            )}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2)}>
          <dt className={s.cardTitle}>
            <span>Average TTD (last 30 days)</span>
            <Tooltip>
              Average time to DataCap for direct allocation in the last 30 days
            </Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(formatDuration(TTD4W_direct))}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2, s.justifyContentStart)}>
          <dt className={s.cardTitle}>
            <span>DataCap granted to allocators</span>
            <Tooltip>
              Total amount of DataCap granted to allocators by Root Key Holders
              for direct allocation
            </Tooltip>
          </dt>
          <dd className={cn(s.cardData, s.alignItemsStart)}>
            {getValueOrSpinner(
              convertBytesToIEC(totalAmountOfDatacapGrantedToNotaries)
            )}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2, s.justifyContentStart)}>
          <dt className={s.cardTitle}>
            <span>DataCap allocated to clients by allocators</span>
            <Tooltip>
              Total amount of DataCap allocated to clients by allocators through
              direct allocation
            </Tooltip>
          </dt>
          <dd className={cn(s.cardData, s.alignItemsStart)}>
            <span>
              {getValueOrSpinner(
                convertBytesToIEC(totalAmountOfDatacapGrantedToClients)
              )}
            </span>
            <span className={cn(s.label, s.primary, s.margin0)}>
              <b>
                {getValueOrSpinner(percentOfAllocatedDatacapFromTotal, 16)}%
              </b>
              of total DataCap
            </span>
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2, s.justifyContentStart)}>
          <dt className={s.cardTitle}>
            <span>DataCap used by clients in deals or deal proposals</span>
            <Tooltip>
              Total amount of DataCap granted by direct allocations used by
              clients in deals or deal proposals
            </Tooltip>
          </dt>
          <dd className={cn(s.cardData, s.alignItemsStart)}>
            <span className={s.marginBottom4}>
              {getValueOrSpinner(
                convertBytesToIEC(totalAmountOfDatacapUsedByClients)
              )}
            </span>
            <span className={s.displayFlexColumn}>
              <span className={cn(s.label, s.primary, s.margin0)}>
                <b>
                  {getValueOrSpinner(
                    percentOfUsedDataFromDatacapGrantedToClients,
                    16
                  )}
                  %
                </b>
                of DataCap allocated to clients
              </span>
              <span className={cn(s.label, s.secondary, s.margin4000)}>
                <b>
                  {getValueOrSpinner(
                    percentOfUsedDataFromDatacapGrantedToNotaries,
                    16
                  )}
                  %
                </b>
                of total DataCap
              </span>
            </span>
          </dd>
        </dl>

        <dl className={cn(s.card, s.size3)}>
          <dt className={s.cardTitle}>
            <span>Average time to first response from allocator</span>
            <Tooltip>
              Average amount of time it takes to get first response from a
              allocator
            </Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(formatDuration(secondsToFirstResponse))}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size3)}>
          <dt className={s.cardTitle}>
            <span>
              Average time to first response from allocator (last 30 days)
            </span>
            <Tooltip>
              Average amount of time it takes to get first response from a
              allocator in the last 30 days
            </Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(
              formatDuration(secondsToFirstResponseLast30Days)
            )}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size3)}>
          <dt className={s.cardTitle}>
            <span>% first response from a allocator</span>
            <Tooltip>
              % of direct allocation applications that get a first response from
              a allocator
            </Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(percentOfApplicantsWhoGotAFirstResponse)}%
          </dd>
        </dl>

        <dl className={cn(s.card, s.size3)}>
          <dt className={s.cardTitle}>
            <span>% of successful DataCap applications</span>
            <Tooltip>
              % of DataCap applications through direct allocation
            </Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(percentOfSuccesfullAllocationRequests)}%
          </dd>
        </dl>

        <dl className={cn(s.card, s.size3)}>
          <dt className={s.cardTitle}>
            <span>Applications received</span>
            <Tooltip>Total number of direct applications received</Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(totalReceivedDirectApplications)}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size3)}>
          <dt className={s.cardTitle}>
            <span>Applications approved</span>
            <Tooltip>Total number of direct applications approved</Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(totalApprovedDirectApplications)}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size3)}>
          <dt className={s.cardTitle}>
            <span>Applications received (last 30 days)</span>
            <Tooltip>
              Total number of direct applications received in the last 30 days
            </Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(totalReceivedDirectApplicationsInLast30Days)}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size3)}>
          <dt className={s.cardTitle}>
            <span>Applications approved (last 30 days)</span>
            <Tooltip>
              Total number of direct applications approved in the last 30 days
            </Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(totalApprovedDirectApplicationsInLast30Days)}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size6)}>
          <dt className={s.cardTitle}>
            <span>Issues per client</span>
            <Tooltip>Number of issues created by each unique client</Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(numberOfIssuesCreatedByClient)}
          </dd>
        </dl>

        <h3 className={cn('h3', s.sectionTitle)}>Verified deals</h3>

        <dl className={cn(s.card, s.size2)}>
          <dt className={s.cardTitle}>
            <span>Average deal size</span>
            <Tooltip>Average size for verified deals (LDN + Direct)</Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(convertBytesToIEC(averageDealSize))}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2)}>
          <dt className={s.cardTitle}>
            <span>Average deal length</span>
            <Tooltip>
              Average duration for verified deals (LDN + Direct)
            </Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(formatDuration(averageDealLength))}
          </dd>
        </dl>

        <dl className={cn(s.card, s.size2)}>
          <dt className={s.cardTitle}>
            <span>Average deal price</span>
            <Tooltip>
              Average cost per GB per epoch for verified deals (LDN + Direct)
            </Tooltip>
          </dt>
          <dd className={s.cardData}>
            {getValueOrSpinner(getFormattedFIL(averageDealPrice))}
          </dd>
        </dl>

        {/*  <dl className={cn(s.card, s.size2)}>*/}
        {/*    <dt className={s.cardTitle}>*/}
        {/*      <span>Time to DataCap allocated on chain</span>*/}
        {/*      <Tooltip>Time to DataCap allocated on chain, GH flow</Tooltip>*/}
        {/*    </dt>*/}
        {/*    <dd className={s.cardData}>*/}
        {/*      {getValueOrSpinner(formatDuration(secondsToAllocation))}*/}
        {/*    </dd>*/}
        {/*  </dl>*/}

        {/*  <dl className={cn(s.card, s.size2)}>*/}
        {/*    <dt className={s.cardTitle}>*/}
        {/*      <span>% of DataCap used in deals</span>*/}
        {/*      <Tooltip>% of DataCap used in deals</Tooltip>*/}
        {/*    </dt>*/}
        {/*    <dd className={s.cardData}>*/}
        {/*      {getValueOrSpinner(percentOfUsedDataFromDatacapGrantedToClients)}%*/}
        {/*    </dd>*/}
        {/*  </dl>*/}

        {/*  <dl className={cn(s.card, s.size2)}>*/}
        {/*    <dt className={s.cardTitle}>*/}
        {/*      <span>Number of deals made with DataCap per client</span>*/}
        {/*      <Tooltip>Number of deals made with DataCap per client</Tooltip>*/}
        {/*    </dt>*/}
        {/*    <dd className={s.cardData}>*/}
        {/*      {getValueOrSpinner(averageDatacapDealsPerCLient)}*/}
        {/*    </dd>*/}
        {/*  </dl>*/}
        <CronStats
          dashboardCrons={[
            'processDataForExtraStats',
            'getLockedFilBreakdownStats',
          ]}
          scraperCrons={[
            'getAllowanceAuditTrail',
            'getVerifiedRegistryMessages',
            'processVerifiedRegistryMessages',
            'updateAllowancesFromDataCapActor',
            'upsertDealData',
            'computeTTD',
          ]}
        ></CronStats>
      </div>

      {/* <Chart
        data={allowanceHistoricData}
        runningTotalData={runningTotalHistoricData}
      /> */}

      {/* <ChartDealCount /> */}
    </div>
  );
}

import cn from 'classnames';

import { useFetch } from 'hooks/fetch';
import { convertBytesToIEC } from 'utils/bytes';
import { formatDuration } from 'utils/formatDuration';
import { getFormattedFIL } from 'utils/numbers';
import { Spinner } from 'components/Spinner';
import { Checkbox } from 'components/Checkbox';
import { Tooltip } from 'components/Tooltip';

import s from './s.module.css';
import { useState } from 'react';
import { ChartDealCount } from './chartDealCount';
import { ChartClientDatacapUsage } from './chartClientDatacapUsage';
import { Chart2 } from 'components/GraphsPage/chart2';
import { ChartTTD } from './chartTTD';
import { ChartTTFD } from './chartTTFD';

// import isFinite from 'lodash/isFinite';

export default function StatisticsPageDev() {
  const [checked, setChecked] = useState(true);
  const [checked2, setChecked2] = useState(true);
  const [checked3, setChecked3] = useState(true);
  const [checked4, setChecked4] = useState(true);

  const fetchUrl = '/getFilPlusExtraStats';
  const [data, { loading }] = useFetch(fetchUrl);

  const {
    TTD,
    TTD4W,
    TTD_direct,
    TTD4W_direct,
    percentOfAllocatedDatacapFromTotal,
    percentOfUsedDataFromDatacapGrantedToClients,
    percentOfUsedDataFromDatacapGrantedToNotaries,
    totalAmountOfDatacapGrantedToClients,
    totalAmountOfDatacapUsedByClients,

    secondsToFirstResponse,
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

    LDNtotalAmountOfDatacapGrantedToClients,
    LDNtotalAmountOfDatacapUsedByClients,
    LDNpercentOfAllocatedDatacapFromTotal,
    LDNpercentOfUsedDataFromDatacapGrantedToClients,
    LDNpercentOfUsedDataFromDatacapGrantedToNotaries,

    minerWeeklyStats,
    clientWeeklyStats,
    ttdWeeklyStats,
    last14DaysTTFDStats,
  } = data;

  const handleChange = () => {
    setChecked(!checked);
  };

  const handleChange2 = () => {
    setChecked2(!checked2);
  };

  const handleChange3 = () => {
    setChecked3(!checked3);
  };

  const handleChange4 = () => {
    setChecked4(!checked4);
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
      <h2 className="h2">Graphs</h2>

      <div className={s.grid}>
        <dl className={cn(s.card, s.size6)}>
          <dt
            className={s.cardTitle}
            style={{ fontSize: '14px', fontWeight: 'bold' }}
          >
            Time to first datacap (TTFD) 14 days rolling average
          </dt>
          {last14DaysTTFDStats && <ChartTTFD data={last14DaysTTFDStats} />}
        </dl>
      </div>
    </div>
  );
}

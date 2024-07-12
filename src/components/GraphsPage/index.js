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
import CronStats from 'components/CronStats';

// import isFinite from 'lodash/isFinite';

export default function StatisticsPage() {
  const [checked, setChecked] = useState(true);
  const [checked2, setChecked2] = useState(true);
  const [checked3, setChecked3] = useState(true);
  const [checked4, setChecked4] = useState(true);

  const fetchUrl = '/getFilPlusExtraStats';
  const [data, { loading }] = useFetch(fetchUrl);

  const {
    allowanceHistoricData,
    runningTotalHistoricData,
    datacapHistoricUsageData,
    runningTotalDatacapHistoricData,
    minerWeeklyStats,
    clientWeeklyStats,
    ttdWeeklyStats,
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
            DataCap used by clients
          </dt>
          <dt className={s.cardTitle}>
            <Checkbox
              label="DataCap used per month"
              value={checked}
              onChange={handleChange}
            />
            <Checkbox
              label="DataCap used per month running total"
              value={checked2}
              onChange={handleChange2}
            />
            <Checkbox
              label="DataCap allocated per month"
              value={checked3}
              onChange={handleChange3}
            />
            <Checkbox
              label="DataCap allocated per month running total"
              value={checked4}
              onChange={handleChange4}
            />
          </dt>

          <Chart2
            data={datacapHistoricUsageData}
            runningTotalData={runningTotalDatacapHistoricData}
            data2={allowanceHistoricData}
            runningTotalData2={runningTotalHistoricData}
            enableData={checked}
            enableRunningTotalData={checked2}
            enableData2={checked3}
            enableRunningTotalData2={checked4}
          />
        </dl>
      </div>

      <div className={s.grid}>
        <dl className={cn(s.card, s.size6)}>
          <dt
            className={s.cardTitle}
            style={{ fontSize: '14px', fontWeight: 'bold' }}
          >
            Weekly provider deal count
          </dt>
          {minerWeeklyStats && minerWeeklyStats['providers'] && (
            <ChartDealCount data={minerWeeklyStats} />
          )}
        </dl>
      </div>

      <div className={s.grid}>
        <dl className={cn(s.card, s.size6)}>
          <dt
            className={s.cardTitle}
            style={{ fontSize: '14px', fontWeight: 'bold' }}
          >
            Weekly client DataCap usage
          </dt>
          {clientWeeklyStats && clientWeeklyStats['clients'] && (
            <ChartClientDatacapUsage data={clientWeeklyStats} />
          )}
        </dl>
      </div>

      <div className={s.grid}>
        <dl className={cn(s.card, s.size6)}>
          <dt
            className={s.cardTitle}
            style={{ fontSize: '14px', fontWeight: 'bold' }}
          >
            Average Weekly TTD
          </dt>
          {ttdWeeklyStats && <ChartTTD data={ttdWeeklyStats} />}
        </dl>
      </div>

      <CronStats
        dashboardCrons={[
          'processDataForExtraStats',
          'buildMinerWeeklyStats',
          'buildClientWeeklyStats',
          'buildTTDWeeklyStats',
        ]}
        scraperCrons={[
          'getVerifiedRegistryMessages',
          'processVerifiedRegistryMessages',
          'upsertDealData',
          'computeTTD',
        ]}
      ></CronStats>
    </div>
  );
}

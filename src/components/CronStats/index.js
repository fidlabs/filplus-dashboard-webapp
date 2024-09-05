import cn from 'classnames';
import { useFetch } from 'hooks';

import s from './s.module.css';
import { Tooltip } from 'components/Tooltip';

export const cronDetailsDictionary = {
  buildStateMarketDealsData: {
    label: 'Fetch market deal data',
    tooltip: 'Fetch market deal data',
  },
  processDataForExtraStats: {
    label: 'Process stats data',
    tooltip: 'Build cached stats data based on all gathered data',
  },
  getAllowanceAuditTrail: {
    label: 'Get allowance audit trail',
    tooltip: 'Search for allowance audit trail using the Github search api',
  },
  getVerifiedRegistryMessages: {
    label: 'Get on chain messages',
    tooltip:
      'Fetch messages sent to f06, f080 and associated multisigs that represent verifier addresses',
  },
  processVerifiedRegistryMessages: {
    label: 'Process new messages',
    tooltip:
      'Extract from fetched messages information and store in the database',
  },
  updateAllowancesFromDataCapActor: {
    label: 'Get remaining datacap',
    tooltip: 'Update remaining datacap using f06 and f07 on chain states',
  },
  getLockedFilBreakdownStats: {
    label: 'Get locked fil stats',
    tooltip: 'Fetch locked fil related info from spacescope api',
  },
  upsertDealData: {
    label: 'Fetch deal list',
    tooltip:
      'Fetch deal list from https://marketdeals.s3-ap-northeast-1.amazonaws.com/StateMarketDealsFilPlusOnly.json.zst',
  },
  computeTTD: {
    label: 'Compute ttds',
    tooltip: 'Compute ttds using bot events and on chain data',
  },
  processDataForVerifiers: {
    label: 'Build allocators data',
    tooltip:
      'Build cached info about verifiers data based on all gathered data',
  },
  processDataForVerifiedClients: {
    label: 'Build clients data',
    tooltip: 'Build cached info about clients data based on all gathered data',
  },
  processDataForMiners: {
    label: 'Build SP data',
    tooltip: 'Build cached info about SPs data based on all gathered data',
  },
  updateMinerInfo: {
    label: 'Fetch SP info',
    tooltip: 'Fetches SP info from filrep.io',
  },
  buildMinerWeeklyStats: {
    label: 'Build SP Weekly',
    tooltip: 'Build SP weekly stats',
  },
  buildClientWeeklyStats: {
    label: 'Build Client Weekly',
    tooltip: 'Build client weekly stats',
  },
  buildTTDWeeklyStats: {
    label: 'Build TTD Weekly',
    tooltip: 'Build TTD weekly stats',
  },
  processDataForVerifiedClientLdnAllowances: {
    label: 'Build LDN data',
    tooltip:
      'Build cached info about ldn allowances based on all gathered data',
  },
};

const getLabelClass = (item) => {
  const crtTimestamp = new Date().getTime();

  let labelClass = s.success;
  if (item.lastRunHasError) labelClass = s.error;
  else if (crtTimestamp - item.lastRunFinishTimestamp * 1000 > 36 * 3600 * 1000)
    labelClass = s.warning;
  return labelClass;
};

export default function CronStats(props) {
  const { dashboardCrons, scraperCrons } = props;
  const buildCronItem = (item) => {
    const date = new Date(+item.lastRunFinishTimestamp * 1000);
    return (
      <div className={s.cardTitle}>
        <span className={getLabelClass(item)}>
          {cronDetailsDictionary[item.key].label} <br />
          Last run: {date.toLocaleString('en-US')}
        </span>
        <Tooltip>{cronDetailsDictionary[item.key].tooltip}</Tooltip>
      </div>
    );
  };

  const [data, { loaded }] = useFetch('/getCronStates');
  const { dashboardCronStates, scraperCronsStates } = data;

  const rows = [];
  if (loaded && dashboardCronStates) {
    for (const item of dashboardCronStates) {
      if (dashboardCrons.indexOf(item.key) != -1) {
        rows.push(buildCronItem(item));
      }
    }
  }

  if (loaded && scraperCronsStates) {
    for (const item of scraperCronsStates) {
      if (scraperCrons.indexOf(item.key) != -1) {
        rows.push(buildCronItem(item));
      }
    }
  }
  return <div className={cn(s.card, s.size6)}>{rows}</div>;
}

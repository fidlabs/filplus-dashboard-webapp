import { convertBytesToIEC } from 'utils/bytes';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import s from './s.module.css';
import { Radio } from '../Radio';
import { useState } from 'react';
import {
  xFormatter,
  setYAxisTicks,
  bar1Key,
  bar2Key,
  bar1Description,
  bar2Description,
  bar2KeyBySize,
  bar1KeyBySize,
} from '../../utils/chart';
import cn from 'classnames';
import { Tooltip as TooltipItem } from 'components/Tooltip';

export const MarketDealsStateBySize = ({ marketDealsState }) => {
  const [filteredData, setFilteredData] = useState(
    marketDealsState.processedMarketDealStatePerDay.slice(-90)
  );
  const [toggle, setToggle] = useState('tab2');
  const [radioFilter, setRadioFilter] = useState({
    option1: false,
    option2: true,
    option3: false,
    option4: false,
    optionMax: false,
  });

  const getTabData = (tab) => {
    if (tab === 'tab1')
      return marketDealsState.processedMarketDealStateCumulativePerDay;
    if (tab === 'tab2') return marketDealsState.processedMarketDealStatePerDay;
    if (tab === 'tab3') return marketDealsState.processedMarketDealStatePerWeek;
  };

  const getRadioFilterValueBasedOnTab = (tab, radioFilter) => {
    if (tab === 'tab1' || tab === 'tab2') {
      if (radioFilter.option1) return 30;
      if (radioFilter.option2) return 90;
      if (radioFilter.option3) return 180;
      if (radioFilter.option4) return 360;
    }

    if (radioFilter.option1) return 12;
    if (radioFilter.option2) return 24;
    if (radioFilter.option3) return 48;
    if (radioFilter.option4) return 72;

    return 12;
  };

  const getRadioFilterOptionNameBasedOnTab = (tab, option) => {
    if (tab === 'tab1' || tab === 'tab2') {
      if (option === 'option1') return '30D';
      if (option === 'option2') return '90D';
      if (option === 'option3') return '180D';
      if (option === 'option4') return '360D';

      return 'MAX';
    }

    if (option === 'option1') return '3M';
    if (option === 'option2') return '6M';
    if (option === 'option3') return '12M';
    if (option === 'option4') return '18M';

    return 'MAX';
  };

  const onFilter30Days = () => {
    const filter = {
      option1: true,
      option2: false,
      option3: false,
      option4: false,
      optionMax: false,
    };
    setRadioFilter(filter);
    setFilteredData(
      getTabData(toggle).slice(
        -1 * getRadioFilterValueBasedOnTab(toggle, filter)
      )
    );
  };
  const onFilter90Days = () => {
    const filter = {
      option1: false,
      option2: true,
      option3: false,
      option4: false,
      optionMax: false,
    };
    setRadioFilter(filter);
    setFilteredData(
      getTabData(toggle).slice(
        -1 * getRadioFilterValueBasedOnTab(toggle, filter)
      )
    );
  };
  const onFilter180Days = () => {
    const filter = {
      option1: false,
      option2: false,
      option3: true,
      option4: false,
      optionMax: false,
    };
    setRadioFilter(filter);
    setFilteredData(
      getTabData(toggle).slice(
        -1 * getRadioFilterValueBasedOnTab(toggle, filter)
      )
    );
  };

  const onFilter360Days = () => {
    const filter = {
      option1: false,
      option2: false,
      option3: false,
      option4: true,
      optionMax: false,
    };
    setRadioFilter(filter);
    setFilteredData(
      getTabData(toggle).slice(
        -1 * getRadioFilterValueBasedOnTab(toggle, filter)
      )
    );
  };

  const onFilterMax = () => {
    setRadioFilter({
      option1: false,
      option2: false,
      option3: false,
      option4: false,
      optionMax: true,
    });
    setFilteredData(getTabData(toggle));
  };

  const setTab = (tab) => {
    setToggle(tab);
    if (radioFilter.optionMax) {
      setFilteredData(getTabData(tab));
    } else {
      setFilteredData(
        getTabData(tab).slice(
          -1 * getRadioFilterValueBasedOnTab(tab, radioFilter)
        )
      );
    }
  };

  const renderTooltip = (props) => {
    const providerData = props?.payload?.[0]?.payload;

    if (!providerData) return null;

    return (
      <div className={s.chartTooltip}>
        <div className={s.chartTooltipTitle}>
          {xFormatter(providerData['name'])}
        </div>
        {toggle === 'tab1' && (
          <div className={s.chartTooltipData}>
            Percent of possible abuse deals: {providerData['notOkPercent']}
            %
            <br />
            Percent of well-distributed deals: {providerData['okPercent']}%
          </div>
        )}

        {toggle === 'tab2' && (
          <div className={s.chartTooltipData}>
            Size of possible abuse deals:{' '}
            {convertBytesToIEC(providerData['anyTaggedDealsSize'])}
            <br />
            Size of well-distributed deals:{' '}
            {convertBytesToIEC(providerData['wellDistributedDealsSize'])}
            <br />
            Total size of deals:{' '}
            {convertBytesToIEC(providerData['totalDealsSize'])}
          </div>
        )}

        {toggle === 'tab3' && (
          <div className={s.chartTooltipData}>
            Number of possible abuse deals:{' '}
            {convertBytesToIEC(providerData['anyTaggedDealsSize'])}
            <br />
            Number of well-distributed deals:{' '}
            {convertBytesToIEC(providerData['wellDistributedDealsSize'])}
            <br />
            Total size of deals:{' '}
            {convertBytesToIEC(providerData['totalDealsSize'])}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={s.chartWrap}>
      <div className="chartHeader">
        <div className={s.chartTabButtonWrapper}>
          <button
            className={cn(s.chartTabButton, {
              [s.chartTabButtonActive]: toggle === 'tab2',
            })}
            onClick={() => setTab('tab2')}
          >
            Non-cumulative day to day
          </button>
          <button
            className={cn(s.chartTabButton, {
              [s.chartTabButtonActive]: toggle === 'tab3',
            })}
            onClick={() => setTab('tab3')}
          >
            Non-cumulative weekly
          </button>
          <button
            className={cn(s.chartTabButton, {
              [s.chartTabButtonActive]: toggle === 'tab1',
            })}
            onClick={() => setTab('tab1')}
          >
            Cumulative day to day
          </button>
        </div>

        <div className={s.chartFilters}>
          <Radio
            label={getRadioFilterOptionNameBasedOnTab(toggle, 'option1')}
            value={radioFilter.option1}
            onChange={onFilter30Days}
          />
          <Radio
            label={getRadioFilterOptionNameBasedOnTab(toggle, 'option2')}
            value={radioFilter.option2}
            onChange={onFilter90Days}
          />
          <Radio
            label={getRadioFilterOptionNameBasedOnTab(toggle, 'option3')}
            value={radioFilter.option3}
            onChange={onFilter180Days}
          />
          <Radio
            label={getRadioFilterOptionNameBasedOnTab(toggle, 'option4')}
            value={radioFilter.option4}
            onChange={onFilter360Days}
          />
          <Radio
            label={getRadioFilterOptionNameBasedOnTab(toggle, 'optionMax')}
            value={radioFilter.optionMax}
            onChange={onFilterMax}
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" aspect={2}>
        <BarChart
          width={500}
          height={500}
          data={filteredData.map((p) => ({ ...p, name: p.day.split('T')[0] }))}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip content={renderTooltip} />
          <XAxis dataKey="name" />
          <YAxis ticks={setYAxisTicks(toggle, filteredData)} width={80} />
          <Tooltip />
          <Legend />
          <Bar
            stackId="a"
            dataKey={bar1KeyBySize(toggle)}
            fill="#82ca9d"
            name={bar1Description(toggle)}
          />
          <Bar
            dataKey={bar2KeyBySize(toggle)}
            stackId="a"
            fill="green"
            name={bar2Description(toggle)}
          />
          ))
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

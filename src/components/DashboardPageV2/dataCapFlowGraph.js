import { useFetch } from '../../hooks/fetch';
import { convertBytesToIEC } from '../../utils/bytes';
import { useEffect, useMemo, useState } from 'react';
import { ResponsiveContainer, Sankey, Tooltip } from 'recharts';
import filesize from 'filesize';
import s from './s.module.css';
import { xFormatter } from '../../utils/chart';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import cn from 'classnames';

const PB_10 = 10 * 1024 * 1024 * 1024 * 1024 * 1024;
const PB_15 = 15 * 1024 * 1024 * 1024 * 1024 * 1024;

export const DataCapFlowGraph = () => {
  const fetchUrl = '/get-dc-flow-graph';

  const [data, { loading, loaded }] = useFetch(fetchUrl);
  const [selectedNodes, setSelectedNodes] = useState(['rkh']);

  const renderTooltip = (props) => {
    const linkData = props?.payload?.[0]?.payload?.payload;
    return (<>
      {linkData?.target && <div key={0} className={s.chartTooltip}>
        <div className={s.chartTooltipTitle}>
          {linkData?.target?.name}
        </div>
        <div className={s.chartTooltipData}>
          {linkData?.target?.value} {linkData?.unit || ''}
        </div>
      </div>}
      {linkData?.name && <div key={1} className={s.chartTooltip}>
        <div className={s.chartTooltipTitle}>
          {linkData?.name === 'rkh' ? 'Root Key Holder' : linkData?.name}
        </div>
        <div className={s.chartTooltipData}>
          {convertBytesToIEC(linkData?.subtext)} Datacap
        </div>
      </div>}
    </>);
  };

  const handleNodeClick = (data) => {
    const name = data?.payload?.name || data?.payload?.target?.name;
    if (selectedNodes.length === 3 || selectedNodes[selectedNodes.length - 1] === name)  {
      return;
    }
    setSelectedNodes([...selectedNodes, name]);
  };

  const handleBackClick = () => {
    setSelectedNodes(selectedNodes.slice(0, selectedNodes.length - 1));
  };

  const sankeyLevel2 = (allocators, parent) => {

    const totalAvailableDatacap = Object.values(allocators).reduce((acc, item) => acc + +item.datacap, 0);
    const amountOfClients = Object.values(allocators).reduce((acc, item) => acc + Object.values(item.clients).length, 0);
    const dataCapUsedByClients = Object.values(allocators).map(item => Object.values(item.clients)).flat(1).reduce((acc, item) => acc + +item.datacap, 0)

    let skData = {
      [parent]: {
        nodes: [{
          name: parent,
          subtext: Object.values(allocators).reduce((acc, item) => acc + +item.datacap, 0)
        }, {
          name: `${amountOfClients} Clients`,
          subtext: dataCapUsedByClients
        }, {
          name: 'Unassigned',
          subtext: totalAvailableDatacap - dataCapUsedByClients
        }],
        links: [{
          source: 0,
          target: 1,
          value: Math.round(dataCapUsedByClients / totalAvailableDatacap * 100),
          unit: '%'
        },{
          source: 0,
          target: 2,
          value: Math.round(100 - (dataCapUsedByClients / totalAvailableDatacap * 100)),
          unit: '%'
        }]
      }
    }

    return skData;
  }

  const sankeyLevel1 = (allocators, parent) => {

    let skData = {
      [parent]: {
        nodes: [{
          name: parent,
          subtext: Object.values(allocators).reduce((acc, item) => acc + +item.datacap, 0)
        }],
        links: []
      }
    }

    Object.entries(Object.groupBy(allocators, item => convertBytesToIEC(item.datacap))).forEach(([dc, allocators], index) => {
      skData[parent].nodes.push({
        name: dc,
        subtext: Object.values(allocators).reduce((acc, item) => acc + +item.datacap, 0)
      });
      skData[parent].links.push({
        source: 0,
        target: index + 1,
        value: allocators.length,
        unit: 'Allocators'
      });
      skData = {...skData, ...sankeyLevel2(allocators, dc)};
    })

    return skData;
  }

  const sankeyData = useMemo(() => {
    if (!data?.rkh) {
      return null;
    }

    let skData = {
      'rkh': {
        nodes: [{
          name: 'Root Key Holder',
          subtext: Object.values(data?.rkh)?.reduce((acc, item) => acc + +item.datacap, 0)
        }],
        links: []
      }
    };

    const datacapAllocatorsGrouped = Object.groupBy(Object.values(data.rkh), item => {
      if (item.datacap < PB_10) {
        return '<10 PiB';
      } else if (item.datacap < PB_15) {
        return '>10 PiB & <15 PiB';
      } else {
        return '>15 PiB';
      }
    });

    Object.entries(datacapAllocatorsGrouped).forEach(([datacap, allocators], index) => {
      skData['rkh'].nodes.push({
        name: datacap,
        subtext: Object.values(allocators).reduce((acc, item) => acc + +item.datacap, 0)
      });
      skData['rkh'].links.push({
        source: 0,
        target: index + 1,
        value: allocators.length,
        unit: 'Allocators'
      });

      skData = {...skData, ...sankeyLevel1(allocators, datacap)};
    });


    return skData;

  }, [data]);

  return <>
    {selectedNodes.length > 1 && <div className={s.selectedNodes}>
      <button className={cn(s.cardLink, s.backLink)} onClick={handleBackClick}>
        <ArrowLeft size={18} />
        {selectedNodes[selectedNodes.length - 2] === 'rkh' ? 'Root Key Holder' : selectedNodes[selectedNodes.length - 2]}
      </button>
    </div>}
    {sankeyData && <ResponsiveContainer width="100%" aspect={2} debounce={100}>
      <Sankey
        width={960}
        height={500}
        data={sankeyData[selectedNodes[selectedNodes.length - 1]]}
        nodePadding={50}
        node={<Node />}
        margin={{
          left: 200,
          right: 200,
          top: 100,
          bottom: 100
        }}
        onClick={handleNodeClick}
        link={{ stroke: 'var(--color-medium-turquoise)', cursor: 'pointer' }}
      >
        <Tooltip content={renderTooltip} />
      </Sankey>
    </ResponsiveContainer>}
  </>;
};

const Node = ({ x, y, width, height, index, payload }) => {
  return <g transform={`translate(${x},${y})`} style={{ cursor: 'pointer' }}>
    <rect x={-width / 2} y={0} width={width * 1.5} height={height} fill="var(--color-dodger-blue)" />
    <text x={width * 1.5} y={height / 2} fill="black" fontSize={12}>
      {payload.name}
    </text>
  </g>;
};

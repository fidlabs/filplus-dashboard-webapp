import { convertBytesToIEC } from 'utils/bytes';
import { useMemo, useState } from 'react';
import { ResponsiveContainer, Sankey, Tooltip } from 'recharts';
import s from './s.module.css';
import cn from 'classnames';
import { useDataCapFlow } from 'hooks';


export const DataCapFlowGraph = () => {
  const {
    dataCapFlow
  } = useDataCapFlow(false);

  const [selectedNodes, setSelectedNodes] = useState([{
    id: 0,
    name: 'Root Key Holder',
  }]);

  const renderTooltip = (props) => {
    const linkData = props?.payload?.[0]?.payload?.payload;
    const nodeData = linkData?.target ?? linkData;
    if (!nodeData) {
      return <></>
    }
    const {
      name,
      datacap,
      allocators,
    } = nodeData
    return (<>
      <div key={1} className={'chartTooltip'}>
        <div className={'chartTooltipTitle'}>
          {name}
        </div>
        <div className={'chartTooltipData'}>
          {convertBytesToIEC(datacap)} Datacap
        </div>
        {allocators > 0 && <div className={'chartTooltipData'}>
          {allocators} Allocators
        </div>}
      </div>
    </>);
  };

  const handleNodeClick = (data) => {
    if (data.payload?.target) {
      return;
    }
    const hasChildren = data?.payload?.hasChildren;
    const isParent = data?.payload?.isParent;
    const name = data?.payload?.name;
    const lastSelectedNode = selectedNodes[selectedNodes.length - 1];

    if (lastSelectedNode.name === name && isParent) {
      setSelectedNodes(selectedNodes.slice(0, - 1));
      return
    }

    if (!hasChildren) {
      return
    }

    const arrayIndex = data?.payload?.arrayIndex;

    setSelectedNodes([...selectedNodes, {
      id: arrayIndex,
      name: name,
    }]);
  };

  const handleBackClick = (backIndex) => {
    setSelectedNodes(selectedNodes.slice(0, backIndex+1));
  };

  const sankeyData = useMemo(() => {
    if (!dataCapFlow?.length) {
      return null;
    }

    let currentNode = dataCapFlow[selectedNodes[0].id];
    for (let i = 1; i < selectedNodes.length; i++) {
      currentNode = currentNode.children[selectedNodes[i].id];
    }

    return {
      nodes: [{
        name: currentNode?.name,
        datacap: currentNode?.attributes?.datacap,
        allocators: currentNode?.attributes?.allocators,
        isParent: selectedNodes.length > 1,
      }, ...currentNode?.children?.map((child, index) => ({
        name: child?.name,
        datacap: child?.attributes?.datacap,
        allocators: child?.attributes?.allocators,
        arrayIndex: index,
        children: child?.children,
        hasChildren: !!child?.children?.map(item => !!item.children?.length).filter(val => !!val).length
      })) || []],
      links: currentNode?.children?.map((child, index) => ({
        source: 0,
        target: index + 1,
        arrayIndex: index,
        value: child?.attributes?.datacap,
        datacap: child?.attributes?.datacap,
        allocators: child?.attributes?.allocators,
        children: child?.children,
        hasChildren: !!child?.children?.map(item => !!item.children?.length).filter(val => !!val).length
      })) || []
    }

  }, [dataCapFlow, selectedNodes]);

  return <div className="relative">
    <div className={s.selectedNodes}>
      {
        selectedNodes.map((node, index) => {
          return <>
          <button key={index} className={cn(s.cardLink, s.backLink, index === selectedNodes.length - 1 && s.inactive)} onClick={() => handleBackClick(index)}>
            {node.name}
          </button>
          {
            index < selectedNodes.length - 1 && <div key={`${index}_sep`} className={s.separator} />
          }
          </>;
        })
      }
    </div>
    {sankeyData && <ResponsiveContainer width="100%" aspect={2} debounce={100}>
      <Sankey
        width={960}
        height={500}
        data={sankeyData}
        nodePadding={50}
        node={<Node />}
        margin={{
          left: 200,
          right: 200,
          top: 100,
          bottom: 100
        }}
        onClick={handleNodeClick}
        link={{ stroke: 'var(--color-medium-turquoise)'}}
      >
        <Tooltip content={renderTooltip} />
      </Sankey>
    </ResponsiveContainer>}
  </div>;
};

const Node = ({ x, y, width, height, index, payload }) => {
  const hasChildren = payload.hasChildren || payload.isParent;
  return <g transform={`translate(${x},${y})`} style={{ cursor: 'pointer' }}>
    <rect x={-width}
          y={-5}
          width={width * 2}
          rx={4}
          height={height + 10}
          cursor={hasChildren ? 'pointer' : 'default'}
          fill={hasChildren ? 'var(--color-dodger-blue)' : 'var(--color-horizon)'}/>
    <text x={width * 1.5} y={height / 2} fill="black" fontSize={12}
          cursor={hasChildren ? 'pointer' : 'default'}>
      {payload.name}
    </text>
  </g>;
};

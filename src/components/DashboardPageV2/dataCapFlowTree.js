import { useFetch } from '../../hooks/fetch';
import { convertBytesToIEC } from '../../utils/bytes';
import { useEffect, useMemo, useState } from 'react';
import Tree from 'react-d3-tree';
import s from './s.module.css';
import cn from 'classnames';

const PB_10 = 10 * 1024 * 1024 * 1024 * 1024 * 1024;
const PB_15 = 15 * 1024 * 1024 * 1024 * 1024 * 1024;

export const DataCapFlowTree = () => {
  const fetchUrl = '/get-dc-flow-graph-grouped-by-audit-status';
  const [data, { loading, loaded }] = useFetch(fetchUrl);
  const [dimensions, setDimensions] = useState({
    width: 0, height: 0
  });
  const [translation, setTranslation] = useState({
    x: 0, y: 0
  });
  const [treeChartContainerRef, setTreeChartContainerRef] = useState(undefined);

  const render = (props) => (
    <TreeNode
      nodeDatum={props.nodeDatum}
      toggleNode={props.toggleNode}
    />
  );

  const getName = (key) => {
    switch (key) {
      case 'rkh':
        return 'Root Key Holder';
      case 'inactiveAllocators':
        return 'Inactive Allocators';
      case 'activeAllocators':
        return 'Active Allocators';
      case 'passedAudit':
        return 'Passed Audit';
      case 'passedAuditConditionally':
        return 'Passed Audit Conditionally';
      case 'failedAudit':
        return 'Failed Audit';
      case 'notAudited':
        return 'Not Audited';
      default:
        return key;
    }
  };

  const countChildAllocators = (data) => {
    if (data?.datacap) {
      return undefined;
    }

    if (data?.allocators?.length) {
      return data.allocators.length;
    } else {
      return Object.entries(data).reduce((acc, [key, data]) => {
        return acc + countChildAllocators(data);
      }, 0);
    }
  };

  const groupAllocators = (allocators, skipUnique) => {

    const uniqueAllocationValues = [...new Set(allocators.map(a => a.datacap))];

    if (uniqueAllocationValues.length > 3 && !skipUnique) {
      const datacapAllocatorsGrouped = Object.groupBy(Object.values(allocators), item => {
        if (item.datacap < PB_10) {
          return '<10 PiB';
        } else if (item.datacap < PB_15) {
          return '>10 PiB & <15 PiB';
        } else {
          return '>15 PiB';
        }
      });
      return Object.entries(datacapAllocatorsGrouped).map(([key, data]) => {
        return {
          name: key,
          attributes: {
            datacap: convertBytesToIEC(data.reduce((acc, curr) => acc + +curr.datacap, 0)),
            allocators: data.length
          },
          children: groupAllocators(data, true)
        };
      });
    } else {
      const datacapAllocatorsGrouped = Object.groupBy(Object.values(allocators), item => convertBytesToIEC(+item.datacap));

      if (Object.keys(datacapAllocatorsGrouped).length === 1) {
        return Object.values(datacapAllocatorsGrouped)[0].map((data) => {
          return {
            name: data.name ?? data.addressId,
            attributes: {
              datacap: convertBytesToIEC(+data.datacap),
              id: data.addressId
            },
            children: undefined
          };
        });
      }

      return Object.entries(datacapAllocatorsGrouped).map(([key, data]) => {
        if (data.length === 1) {
          return {
            name: data[0].name ?? data[0].addressId,
            attributes: {
              datacap: convertBytesToIEC(+data[0].datacap),
              id: data[0].addressId
            },
            children: undefined
          };
        }
        return {
          name: key,
          attributes: {
            datacap: convertBytesToIEC(data.reduce((acc, curr) => acc + +curr.datacap, 0)),
            allocators: data.length
          },
          children: data.map((data) => {
            return {
              name: data.name ?? data.addressId,
              attributes: {
                datacap: convertBytesToIEC(+data.datacap),
                id: data.addressId
              },
              children: undefined
            };
          })
        };
      });
    }
  };

  const parseChildren = (data) => {
    if (data?.allocators?.length) {
      if (data?.allocators?.length > 10) {
        return groupAllocators(data.allocators);
      }
      return data.allocators.map((data) => {
        return {
          name: data.name ?? data.addressId,
          attributes: {
            datacap: convertBytesToIEC(+data.datacap),
            id: data.addressId
          },
          children: undefined
        };
      });
    } else {
      return Object.entries(data).map(([key, data]) => {
        return {
          name: getName(key),
          attributes: {
            datacap: convertBytesToIEC(data.totalDc ? +data.totalDc : Object.values(data).reduce((acc, val) => acc + +val.totalDc, 0)),
            allocators: countChildAllocators(data)
          },
          children: parseChildren(data)
        };
      });
    }
  };

  const treeData = useMemo(() => {
    return Object.entries(data).map(([key, data]) => {
      return {
        name: getName(key),
        children: parseChildren(data)
      };
    });
  }, [data]);

  useEffect(() => {
    if (treeChartContainerRef?.getBoundingClientRect) {
      const dimensions = treeChartContainerRef.getBoundingClientRect();
      setDimensions(dimensions);
      setTranslation({
        x: dimensions.width / 5,
        y: dimensions.height / 2
      });
    }
  }, [treeChartContainerRef]);

  return <div>
    {!!treeData?.length && <div>
      <div ref={(ref) => setTreeChartContainerRef(ref)} id="treeWrapper" style={{ width: '100%', height: '1000px' }}>
        <Tree data={treeData}
              initialDepth={1}
              separation={{ siblings: 0.66, nonSiblings: 1 }}
              nodeSize={{ x: 200, y: 200 }}
              dimensions={dimensions}
              translate={translation}
              zoomable={false}
              collapsible={true}
              depthFactor={400}
              renderCustomNodeElement={render}
              shouldCollapseNeighborNodes={true} />
      </div>
    </div>}
  </div>;
};


const TreeNode = ({ nodeDatum, toggleNode, onNodeClick }) => {
  return (
    <>
      <circle className={!!nodeDatum.children?.length ? s.treeLabelNode : s.treeLabelNodeLeaf} r={15}
              onClick={toggleNode}></circle>
      <g className="rd3t-label">
        <text
          className={s.treeLabelTitle}
          textAnchor="start"
          fontWeight={400}
          x="-20"
          y="35"
        >
          {nodeDatum.name}
        </text>
        <text className={s.treeLabelInfo} x="-20" y="35">
          {nodeDatum.attributes &&
            Object.entries(nodeDatum.attributes).map(([labelKey, labelValue], i) => (
              <tspan key={`${labelKey}-${i}`} x="-20" dy="1.2em">
                {labelKey}: {labelValue}
              </tspan>
            ))}
        </text>
        {!!nodeDatum?.attributes?.id && <text
          className={cn(s.treeLabelTitle, s.treeLabelTitleHoverable)}
          textAnchor="start"
          fontWeight={400}
          x="-20"
          y="90"
          onClick={() => {
            window.open(`notaries\\${nodeDatum?.attributes?.id}`, '_blank');
          }}
        >
          See details
        </text>}
      </g>
    </>
  );
};

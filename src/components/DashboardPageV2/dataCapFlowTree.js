import { useEffect, useState } from 'react';
import Tree from 'react-d3-tree';
import s from './s.module.css';
import cn from 'classnames';
import useDataCapFlow from '../../hooks/useDataCapFlow';
import { convertBytesToIEC } from '../../utils/bytes';

export const DataCapFlowTree = () => {
  const {
    dataCapFlow
  } = useDataCapFlow();


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
    {!!dataCapFlow?.length && <div>
      <div ref={(ref) => setTreeChartContainerRef(ref)} id="treeWrapper" style={{ width: '100%', height: '1000px' }}>
        <Tree data={dataCapFlow}
              initialDepth={1}
              separation={{ siblings: 0.66, nonSiblings: 1 }}
              nodeSize={{ x: 200, y: 200 }}
              dimensions={dimensions}
              translate={translation}
              zoomable={false}
              collapsible={true}
              depthFactor={400}
              pathFunc='diagonal'
              pathClassFunc={s.treePath}
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
            Object.entries(nodeDatum.attributes).map(([labelKey, labelValue], i) => {
              if (labelKey !== 'id') {
                return (
                  <tspan key={`${labelKey}-${i}`} x="-20" dy="1.2em">
                    {labelKey}: {labelKey === 'datacap' ? convertBytesToIEC(labelValue) :labelValue}
                  </tspan>
                )
              }
            })}
        </text>
        {!!nodeDatum?.attributes?.id && <text
          className={cn(s.treeLabelTitle, s.treeLabelTitleHoverable)}
          textAnchor="start"
          fontWeight={400}
          x="-20"
          y="70"
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

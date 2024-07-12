import React from 'react';
import { Rectangle, Layer } from 'recharts';
import { convertBytesToIEC } from 'utils/bytes';

export default function SankeyNode(props) {
  const { x, y, width, height, index, payload, containerWidth } = props;
  const isOut = false; //x + width + 6 > containerWidth;
  return (
    <Layer key={`CustomNode${index}`}>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill={'#000'}
        fillOpacity="1"
      />
      <text
        textAnchor={isOut ? 'end' : 'start'}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2}
        fontSize="14"
        stroke="#333"
      >
        {payload.name}
      </text>

      <text
        textAnchor={isOut ? 'end' : 'start'}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2 + 13}
        fontSize="12"
        stroke="#333"
        strokeOpacity="0.5"
      >
        {payload.percent} {payload.percent ? '%' : ''} {payload.percentLabel}
      </text>

      <text
        textAnchor={isOut ? 'end' : 'start'}
        x={isOut ? x - 6 : x + width + 6}
        y={y + height / 2 + 26}
        fontSize="12"
        stroke="#333"
        strokeOpacity="0.5"
      >
        {convertBytesToIEC(payload.value)}
      </text>
    </Layer>
  );
}

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
import Tree from 'react-d3-tree';

const PB_10 = 10 * 1024 * 1024 * 1024 * 1024 * 1024;
const PB_15 = 15 * 1024 * 1024 * 1024 * 1024 * 1024;

export const DataCapFlowTree = () => {
  const fetchUrl = '/get-dc-flow-graph';

  const [data, { loading, loaded }] = useFetch(fetchUrl);

  const groupChildren = (children) => {

  }

  const treeData = useMemo(() => {
    if (!data?.rkh) {
      return null;
    }

    let skData = {
      name: 'Root Key Holder',
      children: [
        {
          name: '<10 PiB',
          children: Object.entries(data.rkh).filter(([key, value]) => {
            return value.datacap < PB_10
          }).map(([key, value]) => ({
            name: key,
            children: []
          }))
        },
        {
          name: '>10 PiB & <15 PiB',
          children: Object.entries(data.rkh).filter(([key, value]) => {
            return value.datacap >= PB_10 && value.datacap < PB_15
          }).map(([key, value]) => ({
            name: key,
            children: []
          }))
        }, {
          name: '>15 PiB',
          children: Object.entries(data.rkh).filter(([key, value]) => {
            return value.datacap >= PB_15
          }).map(([key, value]) => ({
            name: key,
            children: []
          }))
        }
      ]
    };

    console.log(data);

    console.log('skData', skData)

    return skData;


  }, [data]);

  return <>
    {treeData && <div>
      <div id="treeWrapper" style={{ width: '100%', height: '1000px' }}>
        <Tree data={treeData} />
      </div>
    </div>}
  </>;
};

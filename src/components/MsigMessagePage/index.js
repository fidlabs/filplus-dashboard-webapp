import cn from 'classnames';

import { useFetch } from 'hooks/fetch';
import { convertBytesToIEC } from 'utils/bytes';
import { formatDuration } from 'utils/formatDuration';
import { Spinner } from 'components/Spinner';
import { Tooltip } from 'components/Tooltip';

import s from './s.module.css';
import { useParams } from 'react-router-dom';
// import isFinite from 'lodash/isFinite';

const renderSwitch = (param) => {
  switch (param) {
    case '2':
      return 'Propose';
    case '3':
      return 'Approve';
    default:
      return param;
  }
};

export default function MsigMessagePage() {
  const { msigCid } = useParams();
  const fetchUrl = `/findMsigMessage/${msigCid}`;
  const [data, { loading }] = useFetch(fetchUrl);

  return (
    <div className="container">
      <h2 className="h2">Multisig message</h2>

      <div className={s.grid}>
        {Object.keys(data).length > 0 &&
          data.map((d) => (
            <dl className={cn(s.card, s.size6)}>
              <dt className={s.cardTitle}>
                <span>{d.msgCID}</span>
              </dt>
              <dd className={s.cardData}>
                To: {d.to}
                <br />
                From: {d.from}
                <br />
                Height: {d.height}
                <br />
                Method: {renderSwitch(d.method)}
                <br />
                Proposal Id: {d.proposalId}
                <br />
                Params:
                {d.decoded}
                <br />
                Receipt:
                {d.receipt}
              </dd>
            </dl>
          ))}
      </div>
    </div>
  );
}

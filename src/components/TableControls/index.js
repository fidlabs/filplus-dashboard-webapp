import { Pagination } from './Pagination';
import { ItemsCount } from './ItemsCount';

import s from './s.module.css';

export const TableControls = ({ totalItems }) => {
  return (
    <div className={s.wrap}>
      <Pagination totalItems={Number(totalItems) || 1} />
      <ItemsCount />
    </div>
  );
};

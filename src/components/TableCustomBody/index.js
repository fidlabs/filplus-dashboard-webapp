import cn from 'classnames';
import s from './s.module.css';

export const TableCustomBody = ({ children }) => {
  return (
    <div className={cn(s.wrap)}>
      {children}
    </div>
  );
}

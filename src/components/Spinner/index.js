import cn from 'classnames';

import { Svg } from 'components';
import s from './s.module.css';

export const Spinner = ({ className, ...rest }) => (
  <Svg
    id="loading"
    className={cn(s.icon, className)}
    aria-label="Loading"
    {...rest}
  />
);

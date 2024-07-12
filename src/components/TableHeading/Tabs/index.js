import { NavLink } from 'react-router-dom';

import s from './s.module.css';

export const Tabs = ({ tabs }) => {
  return (
    <div className={s.wrap}>
      {tabs.map((tab) => (
        <NavLink
          key={tab.url}
          to={tab.url}
          className={s.tab}
          exact
          activeClassName={s.active}
        >
          <span>{tab.name}</span>
        </NavLink>
      ))}
    </div>
  );
};

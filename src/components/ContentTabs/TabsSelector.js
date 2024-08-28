import cn from 'classnames';
import s from './s.module.css';


const TabsSelector = ({ tabs, currentTab, setCurrentTab }) => {

  return <div className={cn(s.tabsHeader)}>
    {tabs.map((item, i) => (
      <div onClick={() => setCurrentTab(i)} className={cn(s.tabToggle, currentTab === i && s.active)}
           key={i}>{item}</div>
    ))}
  </div>
}

export default TabsSelector;

import s from './s.module.css';
import cn from 'classnames';
import {Children, cloneElement, useState } from 'react';

export const ContentTabs = ({children, tabs}) => {

  const [currentTab, setCurrentTab] = useState(0);

  return <div className={cn(s.tabs)}>
    <div className={cn(s.tabsHeader)}>
      {tabs.map((item, i) => (
        <div onClick={() => setCurrentTab(i)} className={cn(s.tabToggle, currentTab === i && s.active)} key={i}>{item}</div>
      ))}
    </div>
    <div className={cn(s.tabsContent)}>
      {Children.map(children, (child, index) => (
        currentTab === index ? <div
          className={cn(cn(s.tabsElement))}
        >
          {cloneElement(child)}
        </div> : <></>
      ))}
    </div>
  </div>
}

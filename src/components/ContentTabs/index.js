import s from './s.module.css';
import cn from 'classnames';
import {Children, cloneElement, useState } from 'react';
import TabsSelector from './TabsSelector';

export const ContentTabs = ({children, tabs}) => {

  const [currentTab, setCurrentTab] = useState(0);

  return <div className={cn(s.tabs)}>
    <TabsSelector tabs={tabs} currentTab={currentTab} setCurrentTab={setCurrentTab} />
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

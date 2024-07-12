import { useState } from 'react';
import ReactDOM from 'react-dom';
import cn from 'classnames';
import { usePopper } from 'react-popper';

import { Svg } from 'components/Svg';

import s from './s.module.css';
import { cronDetailsDictionary } from 'components/CronStats';

const tooltipRoot = document.querySelector('#root-tooltip');

export const StatusTooltip = ({
  children,
  target,
  placement = 'top',
  cronStates,
  dependencies,
  cronStatesLoaded,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [targetRef, setTargetRef] = useState();
  const [popperRef, setPopperRef] = useState();
  const [arrowRef, setArrowRef] = useState();

  const { styles, attributes, state } = usePopper(targetRef, popperRef, {
    placement,
    strategy: 'absolute',
    modifiers: [
      { name: 'offset', options: { offset: [0, 16] } },
      { name: 'arrow', options: { element: arrowRef } },
      { name: 'preventOverflow', options: { padding: 16 } },
    ],
  });

  const handlerShow = () => {
    setShowTooltip(true);
  };

  const handlerHide = () => {
    setShowTooltip(false);
  };

  let isInSync = true;
  const { dashboardCronStates, scraperCronsStates } = cronStates;
  const lastRunHasErrorValues = {};
  if (cronStatesLoaded && dashboardCronStates) {
    for (const item of dashboardCronStates) {
      if (dependencies.indexOf(item.key) != -1) {
        if (item.lastRunHasError) {
          isInSync = false;
          lastRunHasErrorValues[item.key] = true;
        } else {
          lastRunHasErrorValues[item.key] = false;
        }
      }
    }
  }

  if (cronStatesLoaded && scraperCronsStates) {
    for (const item of scraperCronsStates) {
      if (dependencies.indexOf(item.key) != -1) {
        if (item.lastRunHasError) {
          isInSync = false;
          lastRunHasErrorValues[item.key] = true;
        } else {
          lastRunHasErrorValues[item.key] = false;
        }
      }
    }
  }

  return (
    <>
      <div
        ref={setTargetRef}
        className={cn(s.targetWrap, {
          [s.target]: target,
          [s.iconWrap]: !target,
          [s.active]: showTooltip,
        })}
        tabIndex={0}
        onMouseEnter={handlerShow}
        onMouseLeave={handlerHide}
        onFocus={handlerShow}
        onBlur={handlerHide}
      >
        {target || (
          <div
            className={cn(
              s.statusCard,
              isInSync ? s.statusCardInSync : s.statusCardOutOfSync
            )}
          />
        )}
      </div>
      {showTooltip &&
        ReactDOM.createPortal(
          <div
            ref={setPopperRef}
            className={cn(s.popper, { [s.hide]: false })}
            style={styles.popper}
            {...attributes.popper}
          >
            {dependencies.map((d) => (
              <span
                style={{ color: lastRunHasErrorValues[d] ? 'red' : 'green' }}
              >
                {cronDetailsDictionary[d].label}
                <br />
              </span>
            ))}
            <div
              ref={setArrowRef}
              data-placement={state?.placement}
              className={s.arrow}
              style={styles.arrow}
            />
          </div>,
          tooltipRoot
        )}
    </>
  );
};

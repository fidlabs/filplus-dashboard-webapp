import { useState } from 'react';
import ReactDOM from 'react-dom';
import cn from 'classnames';
import { usePopper } from 'react-popper';
import { Svg } from 'components';
import s from './s.module.css';

const tooltipRoot = document.querySelector('#root-tooltip');

export const Tooltip = ({ children, target, placement = 'top', cursor }) => {
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

  return (
    <>
      <div
        ref={setTargetRef}
        className={cn(s.targetWrap, {
          [s.target]: target,
          [s.iconWrap]: !target,
          [s.active]: showTooltip,
        })}
        style={{ cursor }}
        tabIndex={0}
        onMouseEnter={handlerShow}
        onMouseLeave={handlerHide}
        onFocus={handlerShow}
        onBlur={handlerHide}
      >
        {target || (
          <Svg id="tooltip" width={16} height={16} aria-label="Tooltip" />
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
            {children}
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

import ReactSwitch from 'react-switch';
import { useState } from 'react';

export default function Switch({ onToggle, ...rest }) {
  const [checked, setChecked] = useState(false);

  const handleChange = (newValue) => {
    setChecked(newValue);
    if (typeof onToggle === 'function') {
      onToggle(newValue);
    }
  };

  return (
    <ReactSwitch
      checked={checked}
      onChange={handleChange}
      onColor="#86d3ff"
      onHandleColor="#2693e6"
      handleDiameter={15}
      uncheckedIcon={false}
      checkedIcon={false}
      boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
      activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
      height={14}
      width={30}
      aria-label="toggle switch"
      {...rest}
    />
  );
}

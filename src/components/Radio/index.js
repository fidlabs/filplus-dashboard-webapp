export const Radio = ({ label, value, onChange }) => {
  return (
    <label style={{ paddingLeft: '20px' }}>
      <input type="radio" checked={value} onChange={onChange} />
      {label}
    </label>
  );
};

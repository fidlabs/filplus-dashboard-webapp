export const Checkbox = ({ label, value, onChange }) => {
  return (
    <label style={{ paddingLeft: '20px' }}>
      <input type="checkbox" checked={value} onChange={onChange} />
      {label}
    </label>
  );
};

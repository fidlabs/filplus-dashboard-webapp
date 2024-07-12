export const shortcutAddress = (address) => {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export const shortcutString = (value) => {
  if (value && value.length > 25) {
    return `${value.slice(0, 15)}...`;
  }
  return value;
};

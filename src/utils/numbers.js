import BigNumber from 'bignumber.js';

export function getFormattedFIL(attoFil) {
  let attoBN = new BigNumber(attoFil);

  if (attoBN.isNaN()) {
    return 'N/A';
  }

  if (attoBN.isZero()) {
    return '0 FIL';
  }

  if (attoBN.isGreaterThanOrEqualTo(BigNumber(10).pow(14))) {
    return `${attoBN.shiftedBy(-18).decimalPlaces(4).toFixed()} FIL`;
  }

  if (attoBN.isGreaterThanOrEqualTo(BigNumber(10).pow(5))) {
    return `${attoBN.shiftedBy(-9).decimalPlaces(4).toFixed()} nanoFIL`;
  }

  return `${attoBN.toFixed()} attoFIL`;
}

export function getPercent(bigValue, smallValue) {
  const bv = new BigNumber(bigValue);
  const sv = new BigNumber(smallValue);

  const percent = sv.multipliedBy(100).dividedBy(bv);
  return percent.toPrecision(4);
}

import isFinite from 'lodash/isFinite';
import filesize from 'filesize';

export function convertBytesToIEC(bytes) {
  return !isNaN(Number(bytes)) && isFinite(Number(bytes))
    ? filesize(Number(bytes), {
        standard: 'iec',
      })
    : 'N/A';
}

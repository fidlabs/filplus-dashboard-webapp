import { useState, useEffect, useCallback } from 'react';
import cn from 'classnames';

import { shortcutAddress } from 'utils/strings';
import { copyToClipboard } from 'utils/copyToClipboard';

import s from './s.module.css';
import { CopyIcon } from 'lucide-react';

export const CopyButton = ({ address }) => {
  const [copied, setCopied] = useState(null);

  const handlerCopy = useCallback(() => {
    copyToClipboard(address)
      .then(() => {
        setCopied(true);
      })
      .catch((e) => {
        setCopied(false);
        console.log(e);
      });
  }, [address]);

  useEffect(() => {
    const timeoutId = setTimeout(() => setCopied(null), 3000);

    return () => clearTimeout(timeoutId);
  }, [copied, address]);

  if (!address) {
    return 'unknown';
  }

  return (
    <span className={s.wrap}>
      <span>{shortcutAddress(address)}</span>
      <button
        type="button"
        onClick={handlerCopy}
        title={`Copy to clipboard:\n${address}`}
        className={s.button}
      >
        <CopyIcon
          id="copy"
          className={cn(s.icon, {
            [s.copied]: copied === true,
            [s.failed]: copied === false,
          })}
          aria-label="Copy to clipboard"
        />
      </button>
    </span>
  );
};

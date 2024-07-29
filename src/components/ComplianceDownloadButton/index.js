import cn from 'classnames';
import tableHeadingStyles from '../TableHeading/s.module.css';
import { Spinner } from '../Spinner';
import { api } from '../../utils/api';
import { useState } from 'react';


export const ComplianceDownloadButton = ({ id }) => {

  const [complianceLoading, setComplianceLoading] = useState();


  const generateComplianceReport = async () => {
    setComplianceLoading(true);
    const abortController = new AbortController();

    const result = await api(`https://compliance.allocator.tech/report`, {
      method: 'POST',
      signal: abortController.signal,
      body: JSON.stringify({ id }),
    });

    setComplianceLoading(false);
  }
  return <div className={cn(tableHeadingStyles.buttonBorder, tableHeadingStyles.noShadow)}
              aria-disabled={complianceLoading}>
    <button
      className={cn(tableHeadingStyles.exportButton, tableHeadingStyles.flexContent)}
      type="button"
      disabled={complianceLoading}
      style={{ minWidth: '220px' }}
      onClick={generateComplianceReport}
    >
      <span>Compliance report</span>
      {complianceLoading && <div className={s.exportIconWrap}>
        <Spinner />
      </div>}
    </button>
  </div>
}

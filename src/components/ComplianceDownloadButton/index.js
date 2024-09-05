import cn from 'classnames';
import tableHeadingStyles from 'components/TableHeading/s.module.css';
import { Spinner } from 'components/Spinner';
import { api } from 'utils/api';
import { useState } from 'react';
import { toast } from 'sonner';


export const ComplianceDownloadButton = ({ id }) => {

  const [complianceLoading, setComplianceLoading] = useState();


  const generateComplianceReport = async () => {
    setComplianceLoading(true);
    const abortController = new AbortController();

    try {
      const result = await api(`https://compliance.allocator.tech/report/${id}`, {}, true);
      if (!!result?.generatedReportUrl) {
        window.open(result.generatedReportUrl, '_blank').focus();
      } else {
        toast.error('Unable to generate compliance report');
      }
    } catch (e) {
      toast.error(e.message);
    }


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
      {complianceLoading && <div className={tableHeadingStyles.exportIconWrap}>
        <Spinner />
      </div>}
    </button>
  </div>
}

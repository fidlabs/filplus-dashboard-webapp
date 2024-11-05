import { useCallback } from 'react';


const useGoogleSheetFilters = () => {

  const FAILED_STATUSES = ['REJECT'];
  const PARTIAL_STATUSES = ['THROTTLE'];
  const PASS_STATUSES = ['MATCH', 'DOUBLE', 'QUADRUPLE'];
  const WAITING_STATUSES = ['WAITING', 'PRE AUDIT'];

  const activeFilter = useCallback((data) => data.isActive === true, [])
  const notActiveFilter = useCallback((data) => data.isActive === false, [])

  const notAuditedFilter = useCallback((data) => activeFilter(data) && data.isAudited === false, [])
  const auditedFilter = useCallback((data) => activeFilter(data) && data.isAudited === true, [])

  const notWaitingFilter = useCallback((i) => (data) => auditedFilter(data) && !!data.auditStatuses[i] && data.auditStatuses[i] !== 'WAITING', [])

  const failedFilter = useCallback((i) => (data) => notWaitingFilter(i)(data) && !!data.auditStatuses[i] && FAILED_STATUSES.includes(data.auditStatuses[i]), [])
  const partialFilter = useCallback((i) => (data) => notWaitingFilter(i)(data) && !!data.auditStatuses[i] && PARTIAL_STATUSES.includes(data.auditStatuses[i]), [])
  const passFilter = useCallback((i) => (data) => notWaitingFilter(i)(data) && !!data.auditStatuses[i] && PASS_STATUSES.includes(data.auditStatuses[i]), [])

  return {
    activeFilter,
    notActiveFilter,
    notAuditedFilter,
    auditedFilter,
    notWaitingFilter,
    failedFilter,
    partialFilter,
    passFilter,
    FAILED_STATUSES,
    PARTIAL_STATUSES,
    PASS_STATUSES,
    WAITING_STATUSES
  }

}

export { useGoogleSheetFilters }

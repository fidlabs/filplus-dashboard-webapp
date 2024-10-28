import { useCallback } from 'react';


const useGoogleSheetFilters = () => {

  const FAILED_STATUSES = ['Rejected'];
  const PARTIAL_STATUSES = ['Throttle'];
  const PASS_STATUSES = ['Match', 'Double', 'Quadruple'];

  const activeFilter = useCallback((data) => data.isActive === true, [])
  const notActiveFilter = useCallback((data) => data.isActive === false, [])

  const notAuditedFilter = useCallback((data) => activeFilter(data) && data.isAudited === false, [])
  const auditedFilter = useCallback((data) => activeFilter(data) && data.isAudited === true, [])

  const notWaitingFilter = useCallback((i) => (data) => auditedFilter(data) && !!data.auditStatuses[i] && data.auditStatuses[i] !== 'Waiting', [])

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
    passFilter
  }

}

export { useGoogleSheetFilters }

import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../utils/api';
import { useFetch } from './fetch';
import { difference } from 'lodash';
import { format } from 'date-fns';

const CDP_API = `https://cdp.allocator.tech`;

const useCDP = () => {

  const getRetrievabilitySP = () => {
    const fetch = async () => {
      const data = await api(`${CDP_API}/stats/acc/providers/retrievability`, {}, true);
      return {
        avg_success_rate_pct: data?.averageSuccessRate,
        count: data?.histogram?.total,
        buckets: data?.histogram?.results
      };
    };

    const [data, setData] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      setIsLoading(true);
      fetch().then(setData).then(() => setIsLoading(false));
    }, []);

    return {
      data,
      isLoading
    };
  };

  const getRetrievabilityAllocator = () => {
    const fetch = async () => {
      const data = await api(`${CDP_API}/stats/acc/allocators/retrievability`, {}, true);
      return {
        avg_score: data?.averageSuccessRate,
        count: data?.histogram?.total,
        buckets: data?.histogram?.results
      };
    };

    const [data, setData] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      setIsLoading(true);
      fetch().then(setData).then(() => setIsLoading(false));
    }, []);

    return {
      data,
      isLoading
    };
  };

  const getNumberOfDealsSP = () => {
    const fetch = async () => {
      const data = await api(`${CDP_API}/stats/acc/providers/clients`, {}, true);
      return {
        count: data?.total,
        buckets: data?.results
      };
    };

    const [data, setData] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      setIsLoading(true);
      fetch().then(setData).then(() => setIsLoading(false));
    }, []);

    return {
      data,
      isLoading
    };
  };

  const getSizeOfTheBiggestDealSP = () => {
    const fetch = async () => {
      const data = await api(`${CDP_API}/stats/acc/providers/biggest-client-distribution`, {}, true);
      return {
        count: data?.total,
        buckets: data?.results
      };
    };

    const [data, setData] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      setIsLoading(true);
      fetch().then(setData).then(() => setIsLoading(false));
    }, []);

    return {
      data,
      isLoading
    };
  };

  const getSizeOfTheBiggestClientAllocator = () => {
    const fetch = async () => {
      const data = await api(`${CDP_API}/stats/acc/allocators/biggest-client-distribution`, {}, true);
      return {
        count: data?.total,
        buckets: data?.results
      };
    };

    const [data, setData] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      setIsLoading(true);
      fetch().then(setData).then(() => setIsLoading(false));
    }, []);

    return {
      data,
      isLoading
    };
  };

  const getProviderComplianceAllocator = () => {

    const fetch = async () => {
      const data = await api(`${CDP_API}/stats/acc/allocators/sps-compliance`, {}, true);
      const chartData = [];
      const nonCompliantMetric = data?.results[0]?.histogram?.results;
      const compliantMetric = data?.results[2]?.histogram?.results;
      const partiallyCompliantMetric = data?.results[1]?.histogram?.results;
      const weeks = nonCompliantMetric.map(item => item.week)?.sort((a, b) => new Date(a) - new Date(b));

      const differedWeeks = difference(weeks, compliantMetric.map(item => item.week), partiallyCompliantMetric.map(item => item.week));

      if (differedWeeks.length) {
        throw new Error('Weeks are not equal');
      }

      for (let week of weeks) {
        const nonCompliant = nonCompliantMetric.find(item => item.week === week);
        const nonCompliantCount = nonCompliant?.total;
        const partiallyCompliant = partiallyCompliantMetric.find(item => item.week === week);
        const partiallyCompliantCount = partiallyCompliant?.results?.filter(item => item.valueFromExclusive >= 80)?.reduce((acc, item) => acc + item.count, 0);
        const compliant = compliantMetric.find(item => item.week === week);
        const compliantCount = compliant?.results?.filter(item => item.valueFromExclusive >= 80)?.reduce((acc, item) => acc + item.count, 0);

        chartData.push({
          name: `w${format(new Date(week), 'ww yyyy')}`,
          nonCompliant: nonCompliantCount - partiallyCompliantCount - compliantCount,
          nonCompliantName: 'Non compliant',
          partiallyCompliant: partiallyCompliantCount,
          partiallyCompliantName: 'Partially compliant',
          compliant: compliantCount,
          compliantName: 'Compliant',
        });
      }

      return chartData;
    };

    const [data, setData] = useState(undefined);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      setIsLoading(true);
      fetch().then(setData).then(() => setIsLoading(false));
    }, []);

    return {
      data,
      isLoading
    };
  };

  const getAuditStateAllocator = () => {
    const fetchUrl = '/get-dc-flow-graph-grouped-by-audit-status';
    const [data, { loading, loaded }] = useFetch(fetchUrl);

    const chartData = useMemo(() => {
      if (!data?.rkh) {
        return [];
      }

      const chartData = [
        {
          name: 'Inactive',
          value: data.rkh.inactiveAllocators.allocators.length,
          dc: data.rkh.inactiveAllocators.allocators.totalDc
        }, {
          name: 'Not Audited',
          value: data.rkh.activeAllocators.notAudited.allocators.length,
          dc: data.rkh.activeAllocators.notAudited.totalDc
        }, {
          name: 'Failed Audit',
          value: data.rkh.activeAllocators.failedAudit.allocators.length,
          dc: data.rkh.activeAllocators.failedAudit.totalDc
        }, {
          name: 'Passed Conditionally',
          value: data.rkh.activeAllocators.passedAuditConditionally.allocators.length,
          dc: data.rkh.activeAllocators.passedAuditConditionally.totalDc
        }, {
          name: 'Audit Passed',
          value: data.rkh.activeAllocators.passedAudit.allocators.length,
          dc: data.rkh.activeAllocators.passedAudit.totalDc
        }
      ];

      return {
        count: chartData.reduce((acc, item) => acc + item.value, 0),
        chartData
      };
    }, [data]);

    return {
      data: chartData,
      isLoading: loading
    };
  };

  const groupData = useCallback((data, groupCount) => {

    if (!data || !data.length || !groupCount) {
      return [];
    }

    let groupedData = [];
    const size = Math.ceil(data.length / groupCount);

    for (let i = 0; i < data.length; i += size) {
      groupedData.push(data.slice(i, i + size));
    }
    return groupedData;
  }, []);

  const parseSingleBucket = useCallback((bucket, index, length, unit = '') => {
    let name = `${bucket.value_from_exclusive} - ${bucket.value_to_inclusive}${unit}`;
    if (bucket.value_to_inclusive - bucket.value_from_exclusive <= 1) {
      const unitWithoutS = unit.slice(0, -1);
      name = `${bucket.value_to_inclusive}${bucket.value_to_inclusive === 1 ? unitWithoutS : unit}`;
    } else if (index === 0) {
      const unitWithoutS = unit.slice(0, -1);

      name = `${bucket.value_from_exclusive < 0 ? '' : 'Less than '}${bucket.value_to_inclusive}${bucket.value_to_inclusive === 1 ? unitWithoutS : unit}`;
    } else if (index === length - 1) {
      name = `Over ${bucket.value_from_exclusive}${unit}`;
    }
    return {
      name,
      value: bucket.count
    };
  }, []);

  const parseSingleBucketWeek = useCallback((bucket, index, length, unit = '') => {
    let name = `${bucket.valueFromExclusive + 1} - ${bucket.valueToInclusive}${unit}`;
    if (bucket.valueToInclusive - bucket.valueFromExclusive <= 1) {
      const unitWithoutS = unit.slice(0, -1);
      name = `${bucket.valueToInclusive}${bucket.valueToInclusive === 1 ? unitWithoutS : unit}`;
    } else if (index === 0) {
      const unitWithoutS = unit.slice(0, -1);
      name = `${bucket.valueFromExclusive < 0 ? '' : 'Less than '}${bucket.valueToInclusive}${bucket.valueToInclusive === 1 ? unitWithoutS : unit}`;
    } else if (index === length - 1) {
      name = `Over ${bucket.valueFromExclusive}${unit}`;
    }
    return {
      name,
      value: bucket.count
    };
  }, []);

  const parseBucketGroup = useCallback((group, index, length, unit = '') => {
    let name = `${group[0].value_from_exclusive} - ${group[group.length - 1].value_to_inclusive}${unit}`;
    if (index === 0) {
      name = `Less than ${group[group.length - 1].value_to_inclusive}${unit}`;
    } else if (index === length - 1) {
      name = `Over ${group[0].value_from_exclusive}${unit}`;
    }
    return {
      name,
      value: group.reduce((acc, bucket) => acc + bucket.count, 0)
    };
  }, []);

  const parseBucketGroupWeek = useCallback((group, index, length, unit = '') => {
    let name = `${group[0].valueFromExclusive + 1} - ${group[group.length - 1].valueToInclusive}${unit}`;
    if (index === 0) {
      name = `Less than ${group[group.length - 1].valueToInclusive}${unit}`;
    } else if (index === length - 1) {
      name = `Over ${group[0].valueFromExclusive}${unit}`;
    }
    return {
      name,
      value: group.reduce((acc, bucket) => acc + bucket.count, 0)
    };
  }, []);

  return {
    getRetrievabilitySP,
    getNumberOfDealsSP,
    groupData,
    parseSingleBucket,
    parseSingleBucketWeek,
    parseBucketGroup,
    parseBucketGroupWeek,
    getSizeOfTheBiggestDealSP,
    getRetrievabilityAllocator,
    getSizeOfTheBiggestClientAllocator,
    getProviderComplianceAllocator,
    getAuditStateAllocator
  };
};

export default useCDP;

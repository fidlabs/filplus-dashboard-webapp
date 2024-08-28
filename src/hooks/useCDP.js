import { useCallback } from 'react';
import { api } from '../utils/api';

const CPD_API = `https://compliance.allocator.tech`;

const useCDP = () => {

  const getRetrievabilitySP = useCallback(async () => {
    const data = await api(`${CPD_API}/stats/providers/retrievability`, {}, true);
    return {
      avg_success_rate_pct: data?.avg_success_rate_pct,
      count: data?.providers_retrievability_score_histogram?.total_count,
      buckets: data?.providers_retrievability_score_histogram?.buckets,
    };
  }, []);

  const getRetrievabilityAllocator = useCallback(async () => {
    const data = await api(`${CPD_API}/stats/allocators/retrievability`, {}, true);
    return {
      avg_score: data?.avg_score,
      count: data?.allocators_retrievability_score_histogram?.total_count,
      buckets: data?.allocators_retrievability_score_histogram?.buckets,
    };
  }, []);

  const getNumberOfDealsSP = useCallback(async () => {
    const data = await api(`${CPD_API}/stats/providers/clients`, {}, true);
    return {
      count: data?.providers_client_count_histogram?.total_count,
      buckets: data?.providers_client_count_histogram?.buckets,
    };
  }, []);

  const getSizeOfTheBiggestDealSP = useCallback(async () => {
    const data = await api(`${CPD_API}/stats/providers/biggest_client_distribution`, {}, true);
    return {
      count: data?.providers_biggest_client_distribution_histogram	?.total_count,
      buckets: data?.providers_biggest_client_distribution_histogram	?.buckets,
    };
  }, []);

  const groupData = useCallback( (data, groupCount) => {

    if (!data || !data.length || !groupCount) {
      return [];
    }

    let groupedData = []
    const size = Math.ceil(data.length / groupCount);

    for (let i=0; i<data.length; i+=size) {
      groupedData.push(data.slice(i,i + size));
    }
    return groupedData;
  }, [])

  const parseSingleBucket = useCallback((bucket, index, length, unit = '') => {
    let name = `${bucket.value_from_exclusive} - ${bucket.value_to_inclusive}${unit}`
    if (bucket.value_to_inclusive - bucket.value_from_exclusive <= 1) {
      const unitWithoutS = unit.slice(0, -1)
      name = `${bucket.value_to_inclusive}${ bucket.value_to_inclusive === 1 ? unitWithoutS : unit}`
    } else if (index === 0) {
      const unitWithoutS = unit.slice(0, -1)

      name = `${bucket.value_from_exclusive < 0 ? '' : 'Less than '}${bucket.value_to_inclusive}${ bucket.value_to_inclusive === 1 ? unitWithoutS : unit}`
    } else if (index === length - 1) {
      name = `Over ${bucket.value_from_exclusive}${unit}`
    }
    return {
      name,
      value: bucket.count,
    }
  }, [])

  const parseBucketGroup = useCallback((group, index, length, unit = '') => {
    let name = `${group[0].value_from_exclusive} - ${group[group.length - 1].value_to_inclusive}${unit}`
    if (index === 0) {
      name = `Less than ${group[group.length - 1].value_to_inclusive}${unit}`
    } else if (index === length - 1) {
      name = `Over ${group[0].value_from_exclusive}${unit}`
    }
    return {
      name,
      value: group.reduce((acc, bucket) => acc + bucket.count, 0),
    }
  }, [])

  return {
    getRetrievabilitySP,
    getNumberOfDealsSP,
    groupData,
    parseSingleBucket,
    parseBucketGroup,
    getSizeOfTheBiggestDealSP,
    getRetrievabilityAllocator,
  };
}

export default useCDP;

import { scaleSymlog } from 'd3-scale';
import { useMemo, useState } from 'react';

const useChartScale = (minValue, defaultValue = 'linear') => {

  const [selectedScale, setSelectedScale] = useState(defaultValue)

  const scale = useMemo(() => {
    if (selectedScale === 'linear') {
      return 'linear'
    } else if (selectedScale === 'log') {
      return scaleSymlog().constant(minValue);
    }
  }, [selectedScale, minValue])

  return {
    scale,
    selectedScale,
    setSelectedScale
  }
}

export default useChartScale;

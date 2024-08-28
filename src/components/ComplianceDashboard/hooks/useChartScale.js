import { scaleSymlog } from 'd3-scale';
import { useMemo, useState } from 'react';

const useChartScale = (chartData) => {

  const [selectedScale, setSelectedScale] = useState('linear')

  const scale = useMemo(() => {
    if (selectedScale === 'linear') {
      return 'linear'
    } else if (selectedScale === 'log') {
      return scaleSymlog().constant(Math.min(...chartData.map(item => item.value)));
    }
  }, [selectedScale, chartData])

  return {
    scale,
    selectedScale,
    setSelectedScale
  }
}

export default useChartScale;

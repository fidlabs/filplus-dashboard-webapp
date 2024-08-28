import s from './loader.module.css';

const ChartLoader = () => {

  return <div className={s.loading}>
    <div className={s.loading1}></div>
    <div className={s.loading2}></div>
    <div className={s.loading3}></div>
    <div className={s.loading4}></div>
  </div>;
};

export default ChartLoader;

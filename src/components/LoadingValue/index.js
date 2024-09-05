import { Spinner } from 'components/Spinner';

export const LoadingValue = ({ value, loading, spinnerSize = 24 }) => {
  return (
    <>
      {loading ? <Spinner width={spinnerSize} height={spinnerSize} /> : value}
    </>
  );
};

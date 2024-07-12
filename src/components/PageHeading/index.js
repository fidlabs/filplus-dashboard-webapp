import s from './s.module.css';

export const PageHeading = ({
  title,
  subtitle,
  additionalContent,
}) => {
  return (
    <div className={s.wrap}>
      <hgroup className={s.hgroup}>
        {subtitle ? (
          <>
            <h2 className="h3">{title}</h2>
            <h3 className="h4">{subtitle}</h3>
          </>
        ) : (
          <h2 className="h2">{title}</h2>
        )}
      </hgroup>
      {
        additionalContent && (
          <hgroup className={s.hgroup}>
            {additionalContent}
          </hgroup>
        )
      }
    </div>
  );
};

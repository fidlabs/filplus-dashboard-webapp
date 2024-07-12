import { Svg } from 'components/Svg';
import s from './s.module.css';

export const ExternalLink = ({
  children,
  url,
  svgId,
  svgAriaLabel,
  svgWidth = 24,
  svgHeight = 24,
}) => {
  if (typeof url !== 'string' || url.indexOf('https') !== 0) {
    return children || null;
  }

  const externalLink = (
    <a href={url} className={s.link} rel="noopener noreferrer" target="_blank">
      <Svg
        id={svgId}
        aria-label={svgAriaLabel}
        width={svgWidth}
        height={svgHeight}
      />
    </a>
  );

  if (!children) {
    return externalLink;
  }

  return (
    <span className={s.wrap}>
      <span>{children}</span>
      {externalLink}
    </span>
  );
};

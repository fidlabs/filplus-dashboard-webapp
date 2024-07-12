import React from 'react';
import { Link } from 'react-router-dom';
import s from './s.module.css';
import { ExternalLink } from '../ExternalLink';

export const buildCompositeChildren = (compositeOptions, item) => {
  const { keys, pattern } = compositeOptions;

  if (keys.some((key) => !item[key])) {
    const firstTruthyKey = keys.find((key) => item[key]);
    return item[firstTruthyKey];
  }

  let value = pattern;
  keys.forEach((key) => (value = value.replace(`:${key}`, item[key])));

  return value;
};

export const CUSTOM_LINK_TYPE = Object.freeze({
  INTERNAL: 'internal',
  NO_LINK: 'noLink',
  GITHUB: 'github',
  FILFOX: 'filfox',
});

const buildCustomLink = (
  { linkPattern, itemKeysAsParamsInOrder, type },
  routeMatch,
  children,
  item
) => {
  if (type && !Object.values(CUSTOM_LINK_TYPE).includes(type)) {
    throw new Error(
      `type must be one of ${Object.values(CUSTOM_LINK_TYPE).join(
        ', '
      )}, "${type}" given.`
    );
  }
  if (type === CUSTOM_LINK_TYPE.NO_LINK) {
    return children;
  }

  if (
    !linkPattern ||
    typeof linkPattern !== 'string' ||
    !itemKeysAsParamsInOrder?.length
  ) {
    throw new Error(
      'linkPattern must be a non-empty string and itemKeysAsParamsInOrder must be a non-empty array!'
    );
  }

  let link = linkPattern;
  itemKeysAsParamsInOrder.forEach((itemKey) => {
    const itemValue =
      typeof itemKey.value === 'function'
        ? itemKey.value(item)
        : item[itemKey.value];

    if (itemKey.overrideWithRouteParam) {
      link = link.replace(/\$\$\$/, routeMatch.params[itemKey.value]);
    } else {
      link = link.replace(/\$\$\$/, itemValue || ' ');
    }
  });

  switch (type) {
    case CUSTOM_LINK_TYPE.GITHUB:
      return (
        <ExternalLink url={link} svgId="github" svgAriaLabel="Github link" />
      );
    case CUSTOM_LINK_TYPE.FILFOX:
      return link.endsWith(' ') ? null : (
        <ExternalLink
          url={link}
          svgId="filfox"
          svgAriaLabel="Filfox link"
          svgWidth={18}
          svgHeight={18}
        />
      );
    case !type || type === CUSTOM_LINK_TYPE.INTERNAL:
    default:
      return (
        <Link to={link} className={s.link}>
          {children}
        </Link>
      );
  }
};

export const buildCustomLinkChildren = (
  customLinkConfig,
  routeMatch,
  children,
  item
) => {
  if (Array.isArray(customLinkConfig)) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
        {customLinkConfig.map((config, index) => (
          <React.Fragment key={config.linkPattern + index}>
            {buildCustomLink(config, routeMatch, children, item)}
          </React.Fragment>
        ))}
      </div>
    );
  } else {
    return buildCustomLink(customLinkConfig, routeMatch, children, item);
  }
};

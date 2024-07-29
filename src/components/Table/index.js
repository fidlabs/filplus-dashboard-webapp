import cn from 'classnames';
import { Link, useRouteMatch } from 'react-router-dom';

import { SortButton } from 'components/SortButton';
import { Spinner } from 'components/Spinner';
import { ExternalLink } from 'components/ExternalLink';
import { CopyButton } from 'components/CopyButton';
import { SortDropdown } from 'components/SortDropdown';
import { Tooltip } from 'components/Tooltip';
import { convertBytesToIEC } from 'utils/bytes';
import { shortcutString } from 'utils/strings';
import { formatDuration } from 'utils/formatDuration';
import { getFormattedFIL } from 'utils/numbers';
import { generatePath } from 'react-router';

import s from './s.module.css';
import { buildCompositeChildren, buildCustomLinkChildren } from './utils';
import useQuery from '../../hooks/useQuery';
import useSkipFirstRun from '../../hooks/useSkipFirstRun';
import { calculateDateFromHeight } from '../../utils/height';

const Th = ({ item }) => {
  const { title, align, sort, key } = item;

  return (
    <th key={key} className={cn(s[align])}>
      {sort ? <SortButton sortKey={sort.key}>{title}</SortButton> : title}
    </th>
  );
};

const Td = ({ cell, item }) => {
  const { query } = useQuery();
  const routeMatch = useRouteMatch();

  const {
    align,
    githubLinkKey,
    key,
    linkPattern,
    canBeCopied,
    convertToIEC,
    convertToDate,
    formatFil,
    shrinkable,
    formatTime,
    tooltip,
    suffix,
    compositeOptions,
    renderCallback,
    tooltipRenderCallback,
    customLink
  } = cell;

  let children;
  if (compositeOptions) {
    children = buildCompositeChildren(compositeOptions, item);
  } else {
    const keysArr = key.split('.');
    children = keysArr.reduce((acc, key) => acc[key], item);
  }

  if (linkPattern && !Array.isArray(children)) {
    const linkParam = linkPattern.split(':')[1].split('/')[0];

    const parseShrinkable = () => {
      const fullName = children;
      let tempChildren = shortcutString(children);
      if (fullName) {
        tempChildren = (
          <Tooltip target={tempChildren} cursor="pointer">
            <div key="123" className={s.tooltipRow}>
              {fullName}
            </div>
          </Tooltip>
        );
      }
      return tempChildren;
    }

    children = (
      <Link
        to={generatePath(linkPattern, {
          [linkParam]:
          linkParam.split('.').reduce((acc, key) => acc[key], item) || ' '
        })}
        className={cn([
          s.link,
          {
            [s.highlight]: Boolean(
              query.get('highlight') &&
              item[key]?.toString() === query.get('highlight')
            )
          }
        ])}
      >
        {parseShrinkable()}
      </Link>
    );
  }

  if (Array.isArray(children) && typeof renderCallback === 'function') {
    if (linkPattern) {
      const linkParam = linkPattern.split(':')[1].split('/')[0];

      children = (
        <div>
          {children.map((el) => {
            const showHighlight = Boolean(
              query.get('highlight') &&
              Object.keys(el).some(
                (k) => el[k]?.toString() === query.get('highlight')
              )
            );
            const link = (
              <Link
                style={{
                  display: showHighlight ? 'inline-block' : 'block'
                }}
                key={el.timestamp}
                to={generatePath(linkPattern, {
                  [linkParam]: el[linkParam] || ' '
                })}
                className={cn([
                  s.link,
                  {
                    [s.highlight]: showHighlight
                  }
                ])}
              >
                {renderCallback(el)}
              </Link>
            );
            return typeof tooltipRenderCallback === 'function' ? (
              <>
                <Tooltip target={link}>{tooltipRenderCallback(el)}</Tooltip>
                <br />
              </>
            ) : (
              link
            );
          })}
        </div>
      );
    } else {
      children = children.map(renderCallback).join(', \n');
    }
  }

  if (githubLinkKey) {
    children = (
      <ExternalLink
        url={item[githubLinkKey]}
        svgId="github"
        svgAriaLabel="Github link"
      >
        {children}
      </ExternalLink>
    );
  }

  if (canBeCopied) {
    children = <CopyButton address={item[key]} />;
  }

  if (convertToIEC) {
    children = convertBytesToIEC(children);
  }

  if (convertToDate) {
    children = calculateDateFromHeight(children);
  }

  if (formatTime) {
    children = formatDuration(children);
  }

  if (formatFil) {
    children = getFormattedFIL(children);
  }

  if (shrinkable && !linkPattern) {
    const fullName = children;
    children = shortcutString(children);
    if (fullName) {
      children = (
        <Tooltip target={children}>
          <div key="123" className={s.tooltipRow}>
            {fullName}
          </div>
        </Tooltip>
      );
    }
  }

  if (tooltip && item[tooltip.key] && !tooltip.singleValue) {
    const filter = tooltip.filterCallback ?? (() => true);
    children = (
      <Tooltip target={children}>
        {item[tooltip.key].filter(filter).map((rowData) => (
          <div key={rowData.id} className={s.tooltipRow}>
            {tooltip.values.map((el) => (
              <span key={el.key}>
                {el.name}:{' '}
                {el.convertToIEC
                  ? convertBytesToIEC(rowData[el.key])
                  : (el.convertToDate ? calculateDateFromHeight(rowData[el.key]) : rowData[el.key] || 'N/A')}
              </span>
            ))}
          </div>
        ))}
      </Tooltip>
    );
  } else if (tooltip && item[tooltip.key] && tooltip.singleValue) {
    children = (
      <Tooltip target={children}>
        {item[tooltip.key]}
      </Tooltip>
    );
  } else if (tooltip && !item[tooltip.key]) {
    children = (
      <Tooltip target={children}>
        <div className={s.tooltipRow}>{tooltip}</div>
      </Tooltip>
    );
  }

  if (customLink) {
    children = buildCustomLinkChildren(customLink, routeMatch, children, item);
  }

  return (
    <td
      key={key}
      className={cn(s[align], {
        [s.highlight]: Boolean(
          query.get('highlight') &&
          item[key]?.toString() === query.get('highlight')
        )
      })}
      style={{ '--label': `'${cell.title}'` }}
    >
      {children}
      {children && suffix}
    </td>
  );
};

export const Table = ({ table, data = [], loading, noControls = false }) => {
  const { query, pushQueryRoute } = useQuery();
  const filterQuery = query.get('filter');

  useSkipFirstRun(() => {
    query.delete('highlight');
    pushQueryRoute(query);
  }, [filterQuery]);

  return (
    <div>
      <div className={s.sortWrap}>
        <SortDropdown table={table} />
      </div>
      <div className={cn(s.tableWrap, { [s.loading]: loading })}>
        <table className={cn(s.table, { [s.noControls]: noControls })}>
          <thead>
          <tr>
            {table.map((item) => (
              <Th key={item.key} item={item} />
            ))}
          </tr>
          </thead>
          <tbody>
          {data?.length ? (
            data.map((item, itemIdx) => (
              <tr key={itemIdx}>
                {table.map((cell, cellIdx) => (
                  <Td key={cellIdx} cell={cell} item={item} />
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={table.length}>No data</td>
            </tr>
          )}
          </tbody>
        </table>
        {loading ? (
          <div className={s.spinnerWrap}>
            <Spinner />
          </div>
        ) : null}
      </div>
    </div>
  );
};

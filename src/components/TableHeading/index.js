import { useState } from 'react';
import cn from 'classnames';

import { api, apiRaw } from 'utils/api';
import { Svg } from 'components/Svg';
import { Spinner } from 'components/Spinner';
import { Tabs } from './Tabs';
import s from './s.module.css';
import { buildCompositeChildren } from '../Table/utils';
import { Search } from '../Search';
import classNames from 'classnames';

export const TableHeading = ({ title, tabs, csv, portalRef, searchPlaceholder }) => {
  const [loading, setLoading] = useState(false);

  const handlerExport = async () => {
    const { directDownload } = csv;
    if (directDownload) {
      await handlerExportDirect();
    } else {
      await handlerExportIndirect();
    }
  };

  const handlerExportIndirect = async () => {
    const { table, fetchUrl, csvFilename, itemsCount } = csv;

    if (itemsCount === 0) {
      console.log('No data for export.');
      return;
    }

    try {
      setLoading(true);
      const result = await api(fetchUrl);
      const data = result.data || result.stats;

      const headerString = table.map((column) => column.title).join(',');
      const dataString = data
        .map((item) =>
          table
            .map((column) => {
              const keysArr = column.key.split('.');
              let children = '';
              for (let i = 0, length = keysArr.length; i < length; i++) {
                const aux =
                  i === 0
                    ? column.compositeOptions
                      ? buildCompositeChildren(column.compositeOptions, item)
                      : item[keysArr[i]]
                    : children[keysArr[i]];

                children =
                  aux && aux.replace
                    ? aux.replace(/,/g, ' ').replace(/;/g, ' ')
                    : aux;
              }

              return children;
            })
            .join(',')
        )
        .join('\r\n');
      const resultString = `${headerString}\r\n${dataString}`;

      const blob = new Blob([resultString], {
        type: 'text/csv;charset=utf-8;'
      });

      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, csvFilename);
      } else {
        const link = document.createElement('a');
        if (link.download !== undefined) {
          link.setAttribute('href', URL.createObjectURL(blob));
          link.setAttribute('download', csvFilename);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handlerExportDirect = async () => {
    const { table, fetchUrl, csvFilename, itemsCount } = csv;

    if (itemsCount === 0) {
      console.log('No data for export.');
      return;
    }

    try {
      setLoading(true);
      const result = await apiRaw(fetchUrl);

      const blob = new Blob([result], {
        type: 'text/csv;charset=utf-8;'
      });

      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, csvFilename);
      } else {
        const link = document.createElement('a');
        if (link.download !== undefined) {
          link.setAttribute('href', URL.createObjectURL(blob));
          link.setAttribute('download', csvFilename);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={s.wrap}>
      {tabs?.length ? (
        <Tabs tabs={tabs} />
      ) : (
        <div className={s.titleWrapper}>
          <h3 className={cn('h3', s.title)} style={{ color: 'black' }}>
            {title}
          </h3>
          <div className={s.portalContainer} ref={portalRef} />
        </div>
      )}
      <div className={classNames(s.wrap, s.right)}>

        <Search
          placeholder={searchPlaceholder}
        />
        <div className={s.buttonBorder} aria-disabled={!csv?.itemsCount}>
          <button
            className={s.exportButton}
            type="button"
            onClick={handlerExport}
            disabled={!csv?.itemsCount}
            tabIndex={!csv?.itemsCount ? -1 : 0}
          >
            <span>Export to CSV</span>
            <div className={s.exportIconWrap}>
              {loading ? <Spinner /> : <Svg id="export-csv" />}
            </div>
            {loading ? (
              <div className={s.mobileSpinner}>
                <Spinner />
              </div>
            ) : null}
          </button>
        </div>
      </div>
    </div>
  );
};

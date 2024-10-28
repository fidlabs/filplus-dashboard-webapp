import { config } from 'config';

export const api = async (url, { headers = {}, data, ...restOptions } = {}, absolutePath = false) => {
  const requestHeaders = Object.entries({
    ...headers,
  }).reduce((a, [k, v]) => (v == null ? a : { ...a, [k]: v }), {});

  const isAbsoluteUrl = url.startsWith('http') || absolutePath;

  const response = await fetch(isAbsoluteUrl ? url :`${config.apiBaseUrl}${url}`, {
    headers: new Headers(requestHeaders),
    mode: 'cors',
    ...restOptions,
  });


  if (!response.ok) {
    throw await response.json()
  }

  return response.json();
};

export const apiRaw = async (
  url,
  { headers = {}, data, ...restOptions } = {},
  absolutePath = false
) => {
  const requestHeaders = Object.entries({
    ...headers,
  }).reduce((a, [k, v]) => (v == null ? a : { ...a, [k]: v }), {});

  const response = await fetch(absolutePath ? url :`${config.apiBaseUrl}${url}`, {
    headers: new Headers(requestHeaders),
    mode: 'cors',
    ...restOptions,
  });

  if (!response.ok) {
    throw await response;
  }

  return response.blob();
};

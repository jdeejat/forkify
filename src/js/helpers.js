import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData) {
  try {
    const fetchPro = uploadData
      ? fetch(`${url}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(`${url}`);
    // Promise.race timeout and fetch
    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await response.json();
    if (!response.ok)
      throw new Error(`${data.message} Status: ${response.status}`);
    return data;
  } catch (error) {
    throw error;
  }
};

/*
export const getJSON = async function (url) {
  try {
    // Promise.race timeout and fetch
    const response = await Promise.race([
      fetch(`${url}`),
      timeout(TIMEOUT_SEC),
    ]);
    const data = await response.json();
    if (!response.ok)
      throw new Error(`${data.message} Status: ${response.status}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const request = fetch(`${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    // Promise.race timeout and fetch
    const response = await Promise.race([request, timeout(TIMEOUT_SEC)]);
    const data = await response.json();
    if (!response.ok)
      throw new Error(`${data.message} Status: ${response.status}`);
    return data;
  } catch (error) {
    throw error;
  }
};
*/

import { TIMEOUT_SEC } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: { 'content-Type': 'application/json' },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch {
    throw err;
  }
};

export const isNumeric = function (nbr, positive = true) {
  // returns True if sNum is a numeric value
  const strNumeric = !!nbr && !isNaN(+nbr.replace(/\s|\$/g, ''));

  if (!strNumeric) return false;

  if (!positive) return true;

  return Number(nbr) >= 0;
};

export const roundToNearest = function (numToRound, numToRoundTo) {
  return (Math.round(numToRound * numToRoundTo) / numToRoundTo).toFixed(2);
};

export const sortObjectArray = function (arrObj, sortProp, sortAsc = true) {
  const arrObjSort = arrObj.sort((obj1, obj2) => {
    sortDir = sortAsc ? 1 : -1;
    return (obj1[sortProp] - obj2[sortProp]) * sortDir;
  });
  return arrObjSort;
};

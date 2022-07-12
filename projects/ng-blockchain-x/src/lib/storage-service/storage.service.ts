import { isObject, NOOP } from './helpers';
import type { Encrypter, Decrypter, LocalStorageConfig } from './types';

// private flags
let hasLS: boolean;

const supportsLS = (): boolean => {
  if (hasLS !== undefined) return hasLS;
  hasLS = true;

  try {
    if (!localStorage) {
      hasLS = false;
    }
  } catch (e) {
    // some browsers throw an error if you try to access local storage (e.g. brave browser)
    // and some like Safari do not allow access to LS in incognito mode
    hasLS = false;
  }

  // flush once on init
  flush();

  return hasLS;
};

// Apex
const APX = String.fromCharCode(0);

// tiny obsfuscator
const obfus: Encrypter | Decrypter = (str, key, encrypt = true) =>
  encrypt
    ? [...((JSON.stringify(str) as unknown) as string[])]
      .map((x) => String.fromCharCode(x.charCodeAt(0) + (key as number)))
      .join('')
    : JSON.parse([...(str as string[])].map((x) => String.fromCharCode(x.charCodeAt(0) - (key as number))).join(''));

const decrypter: Decrypter = (str, key) => {
  return obfus(str, key, false);
};

const config: LocalStorageConfig = {
  ttl: null,
  encrypt: false,
  encrypter: obfus,
  decrypter,
  secret: 75,
};

const set = <T = unknown>(key: string, value: T, localConfig: LocalStorageConfig = {}): void | boolean => {
  if (!supportsLS()) return false;

  const _conf = {
    ...config,
    ...localConfig,
    encrypt: localConfig.encrypt === false ? false : localConfig.encrypt || config.encrypt,
    ttl: localConfig.ttl === null ? null : localConfig.ttl || config.ttl,
  };

  try {
    let val = _conf.ttl && _conf.ttl > 0 ? { [APX]: value, ttl: Date.now() + _conf.ttl * 1e3 } : value;

    if (_conf.encrypt) {
      // if ttl exists, only encrypt the value
      if (_conf.ttl && APX in (val as Record<string, unknown>)) {
        (val as Record<string, unknown>)[APX] = (_conf.encrypter || NOOP)(
          (val as Record<string, unknown>)[APX],
          _conf.secret
        ) as string;
      } else {
        val = (_conf.encrypter || NOOP)(val, _conf.secret) as T;
      }
    }

    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    // Sometimes stringify fails due to circular refs
    return false;
  }
};

const get = <T = unknown>(key: string, localConfig: LocalStorageConfig = {}): T | null => {
  if (!supportsLS()) return null;

  const str = localStorage.getItem(key);

  if (!str) {
    return null;
  }

  const _conf = {
    ...config,
    ...localConfig,
    encrypt: localConfig.encrypt === false ? false : localConfig.encrypt || config.encrypt,
    ttl: localConfig.ttl === null ? null : localConfig.ttl || config.ttl,
  };

  let item = JSON.parse(str);
  const hasTTL = isObject(item) && APX in item;

  if (_conf.decrypt || _conf.encrypt) {
    try {
      if (hasTTL) {
        item[APX] = (_conf.decrypter || NOOP)(item[APX], _conf.secret) as string;
      } else {
        item = (_conf.decrypter || NOOP)(item, _conf.secret) as string;
      }
    } catch (e) {
      // Either the secret is incorrect or there was a parsing error
      // do nothing [returns the encrypted/unparsed value]
    }
  }

  // if not using ttl, return immediately
  if (!hasTTL) {
    return item;
  }

  if (Date.now() > item.ttl) {
    localStorage.removeItem(key);
    return null;
  }

  return item[APX];
};

const flush = (force = false): false | void => {
  if (!supportsLS()) return false;
  Object.keys(localStorage).forEach((key) => {
    const str = localStorage.getItem(key);
    if (!str) return; // continue iteration
    let item;
    try {
      item = JSON.parse(str);
    } catch (e) {
      // Some packages write strings to localStorage that are not converted by JSON.stringify(), so we need to ignore it
      return;
    }
    // flush only if ttl was set and is/is not expired
    if (isObject(item) && APX in item && (Date.now() > item.ttl || force)) {
      localStorage.removeItem(key);
    }
  });
};

const remove = (key: string): undefined | false | true => {
  if (!supportsLS()) return false;
  localStorage.removeItem(key);
  return true;
};

const clear = (): undefined | false | true => {
  if (!supportsLS()) return false;
  localStorage.clear();
  return true;
};

export default {
  config,
  set,
  get,
  flush,
  clear,
  remove,
};
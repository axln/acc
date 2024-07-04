import { get } from 'svelte/store';
import {
  type AccountDoc,
  type DBSnapshot,
  getCurrencies,
  getAccountGroups,
  db,
  getAccounts,
  getCategories
} from './db';
import { rates, baseCurrencyCode } from './store';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function getLocalCustomISODateString(date: Date) {
  const offset = date.getTimezoneOffset() * 60000; // Convert to milliseconds
  const localTime = new Date(date.getTime() - offset);

  const year = localTime.getFullYear();
  const month = String(localTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(localTime.getUTCDate()).padStart(2, '0');
  const hours = String(localTime.getUTCHours()).padStart(2, '0');
  const minutes = String(localTime.getUTCMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function formatTimestamp(timestamp: number) {
  const date = new Date(timestamp);
  const offset = date.getTimezoneOffset() * 60000; // Convert to milliseconds
  const localTime = new Date(date.getTime() - offset);

  const year = localTime.getFullYear();
  const month = String(localTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(localTime.getUTCDate()).padStart(2, '0');
  const hours = String(localTime.getUTCHours()).padStart(2, '0');
  const minutes = String(localTime.getUTCMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function formatDate(timestamp: number) {
  const date = new Date(timestamp);
  const offset = date.getTimezoneOffset() * 60000; // Convert to milliseconds
  const localTime = new Date(date.getTime() - offset);

  const year = localTime.getUTCFullYear();
  const month = String(localTime.getUTCMonth() + 1).padStart(2, '0');
  const day = String(localTime.getUTCDate()).padStart(2, '0');
  const weekDay = weekDays[localTime.getUTCDay()];

  return `${year}-${month}-${day} ${weekDay}`;
}

export function formatTime(timestamp: number) {
  const date = new Date(timestamp);
  const offset = date.getTimezoneOffset() * 60000; // Convert to milliseconds
  const localTime = new Date(date.getTime() - offset);

  const hours = String(localTime.getUTCHours()).padStart(2, '0');
  const minutes = String(localTime.getUTCMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

export function validateAmount(value: string) {
  return /^[1-9]\d*([.,]\d{1,2})?$/.test(value);
}

export function parseAmount(value: string): number {
  if (/[.,]/.test(value)) {
    let [whole, decimal] = value.split(/[.,]/);
    if (decimal.length === 1) {
      decimal = decimal + '0';
    }
    return parseInt(whole + decimal);
  } else {
    return parseInt(value) * 100;
  }
}

export function formatAmount(value: number, sep?: boolean, plus?: boolean) {
  value = Math.round(value);
  const wholePart = value < 0 ? Math.ceil(value / 100) : Math.floor(value / 100);
  const decimalPart = Math.abs(value % 100);

  return (
    (plus && value > 0 ? '+' : '') +
    `${sep ? numberWithSep(wholePart) : wholePart}.${String(decimalPart).padStart(2, '0')}`
  );
}

export function getCurrencyRate(fromCode: string, toCode: string) {
  const rateValues = get(rates);
  const baseCode = get(baseCurrencyCode);
  const baseRate = rateValues[fromCode] ? rateValues[fromCode] : 1;
  if (toCode === baseCode) {
    return baseRate;
  } else {
    return rateValues[toCode] ? baseRate / rateValues[toCode] : 1;
  }
}

function numberWithSep(x: number, sep = ' ') {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}

export function getGroupBalance(groupAccounts: AccountDoc[], currencyCode: string) {
  return groupAccounts.reduce((balance: number, acc: AccountDoc) => {
    if (acc.currencyCode === currencyCode) {
      balance += acc.balance;
    } else {
      balance += acc.balance * getCurrencyRate(acc.currencyCode, currencyCode);
    }

    return balance;
  }, 0);
}

export function downloadJSON(data: object, fileName: string) {
  const dataBlob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(dataBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

export function chooseTextFile(onChoose: (text: string) => void) {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'application/json';
  fileInput.multiple = false;

  fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        onChoose(reader.result as string);
      };
      reader.readAsText(file);
    }
  };

  fileInput.click();
}

export function safeJSONParse(text: string) {
  try {
    return JSON.parse(text);
  } catch (_) {
    console.warn('JSON parsing failed.');
    return null;
  }
}

export async function getDBSnapshot(): Promise<DBSnapshot> {
  const [currencies, accountGroups, accounts, categories, transactions, entries, settings, rates] =
    await Promise.all([
      getCurrencies(),
      getAccountGroups(),
      getAccounts(),
      getCategories(),
      db.getAll('transactions'),
      db.getAll('entries'),
      db.getAll('settings'),
      db.getAll('rates')
    ]);

  return {
    ver: formatTimestamp(Date.now()),
    currencies,
    accountGroups,
    accounts,
    categories,
    transactions,
    entries,
    settings,
    rates
  };
}

export async function restoreSnapshot(snapshot: DBSnapshot) {
  if (!confirm('All the data will be overwritten. Are you sure you want to continue?')) {
    return false;
  }

  if (validateDBSnapshot(snapshot)) {
    const tx = db.transaction(
      [
        'currencies',
        'accountGroups',
        'accounts',
        'categories',
        'transactions',
        'entries',
        'settings',
        'rates'
      ],
      'readwrite'
    );

    await Promise.all([
      tx.objectStore('currencies').clear(),
      tx.objectStore('accountGroups').clear(),
      tx.objectStore('accounts').clear(),
      tx.objectStore('categories').clear(),
      tx.objectStore('transactions').clear(),
      tx.objectStore('entries').clear(),
      tx.objectStore('settings').clear(),
      tx.objectStore('rates').clear()
    ]);

    for (const item of snapshot.currencies) {
      await tx.objectStore('currencies').put(item);
    }
    for (const item of snapshot.accountGroups) {
      await tx.objectStore('accountGroups').put(item);
    }
    for (const item of snapshot.accounts) {
      await tx.objectStore('accounts').put(item);
    }
    for (const item of snapshot.categories) {
      await tx.objectStore('categories').put(item);
    }
    for (const item of snapshot.transactions) {
      await tx.objectStore('transactions').put(item);
    }
    for (const item of snapshot.entries) {
      await tx.objectStore('entries').put(item);
    }
    for (const item of snapshot.settings) {
      await tx.objectStore('settings').put(item);
    }
    for (const item of snapshot.rates) {
      await tx.objectStore('rates').put(item);
    }

    await tx.done;
    return true;
  } else {
    alert('Invalid snapshot format.');
    return false;
  }
}

export function validateDBSnapshot(snapshot: DBSnapshot) {
  if (!snapshot.ver) {
    return false;
  }

  if (!snapshot.currencies) {
    return false;
  }

  if (!snapshot.accountGroups) {
    return false;
  }

  if (!snapshot.categories) {
    return false;
  }

  if (!snapshot.categories) {
    return false;
  }

  if (!snapshot.transactions) {
    return false;
  }

  if (!snapshot.entries) {
    return false;
  }

  return true;
}

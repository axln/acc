import { type IDBPDatabase, type DBSchema, openDB } from 'idb';
import { nanoid } from 'nanoid';
import { TransactionKind } from '~/lib/enum';
import {
  accountGroups,
  accounts,
  categoires,
  currencies,
  rates,
  settings,
  baseCurrencyCode
} from '~/lib/store';
import { baseCurrencyName } from './const';

interface AccDB extends DBSchema {
  accounts: {
    key: string;
    value: AccountDoc;
    indexes: {
      title: string;
    };
  };
  accountGroups: {
    key: string;
    value: AccountGroupDoc;
    indexes: {
      title: string;
    };
  };
  currencies: {
    key: string;
    value: CurrencyDoc;
  };
  rates: {
    key: string;
    value: RateDoc;
  };
  categories: {
    key: string;
    value: CategoryDoc;
    indexes: {
      title: [string, string];
    };
  };
  entries: {
    key: string;
    value: EntryDoc;
    indexes: {
      accountId: string;
    };
  };
  transactions: {
    key: string;
    value: TransactionDoc;
  };
  settings: {
    key: string;
    value: SettingsDoc;
  };
}

export interface DBSnapshot {
  ver: string;
  currencies: CurrencyDoc[];
  accountGroups: AccountGroupDoc[];
  accounts: AccountDoc[];
  categories: CategoryDoc[];
  transactions: TransactionDoc[];
  entries: EntryDoc[];
}

export interface AccountDoc {
  id: string;
  groupId: string;
  currencyCode: string;
  title: string;
  balance: number;
}

export interface AccountGroupDoc {
  id: string;
  currencyCode: string;
  title: string;
}

export interface CurrencyDoc {
  code: string;
  title: string;
}

export interface RateDoc {
  code: string;
  rate: number;
}

export interface CategoryDoc {
  id: string;
  title: string;
  subtitle?: string;
}

export interface EntryDoc {
  id: string;
  timestamp: number;
  accountId: string;
  categoryId?: string;
  transactionId: string;
  amount: number;
  total: number;
  comment: string;
  reconciled?: boolean;
}

export interface SettingsDoc {
  name: string;
  value: string;
}

export interface TransactionDoc {
  id: string;
  kind: TransactionKind;
  timestamp: number;
  accountId: string;
  entryId: string;
  amount: number;
  categoryId?: string;
  secondAccountId?: string;
  secondEntryId?: string;
  secondAmount?: number;
  comment: string;
  reconciled?: boolean;
}

export interface TransactionParams {
  kind: TransactionKind;
  timestamp: number;
  accountId: string;
  amount: number;
  categoryId?: string;
  secondAccountId?: string;
  secondAmount?: number;
  comment: string;
  reconciled?: boolean;
}

export let db: IDBPDatabase<AccDB>;

const dbPromise = openDB<AccDB>('acc', 2, {
  upgrade(upgradeDb) {
    if (!upgradeDb.objectStoreNames.contains('accountGroups')) {
      const accountGroupsStore = upgradeDb.createObjectStore('accountGroups', { keyPath: 'id' });
      accountGroupsStore.createIndex('title', 'title');
    }

    if (!upgradeDb.objectStoreNames.contains('accounts')) {
      const accountsStore = upgradeDb.createObjectStore('accounts', { keyPath: 'id' });
      accountsStore.createIndex('title', 'title');
    }

    if (!upgradeDb.objectStoreNames.contains('currencies')) {
      upgradeDb.createObjectStore('currencies', { keyPath: 'code' });
    }

    if (!upgradeDb.objectStoreNames.contains('categories')) {
      const categoriesStore = upgradeDb.createObjectStore('categories', { keyPath: 'id' });
      categoriesStore.createIndex('title', ['title', 'subtitle']);
    }

    if (!upgradeDb.objectStoreNames.contains('entries')) {
      const entriesStore = upgradeDb.createObjectStore('entries', { keyPath: 'id' });
      entriesStore.createIndex('accountId', 'accountId');
    }

    if (!upgradeDb.objectStoreNames.contains('transactions')) {
      upgradeDb.createObjectStore('transactions', { keyPath: 'id' });
    }

    if (!upgradeDb.objectStoreNames.contains('settings')) {
      upgradeDb.createObjectStore('settings', { keyPath: 'name' });
    }

    if (!upgradeDb.objectStoreNames.contains('rates')) {
      upgradeDb.createObjectStore('rates', { keyPath: 'code' });
    }
  }
}).then((dbInstance) => {
  db = dbInstance;
});

/* reading lists */

export function getAccounts() {
  return db.getAllFromIndex('accounts', 'title');
}

export function getAccount(id: string) {
  return db.get('accounts', id);
}

export async function updateAccount(accountDoc: AccountDoc) {
  await db.put('accounts', accountDoc);
  accounts.set(await getAccounts());
}

export async function deleteTransaction(id: string) {
  const transactionDoc = await db.get('transactions', id);
  await Promise.all([
    db.delete('transactions', id),
    db.delete('entries', transactionDoc.entryId),
    transactionDoc.secondEntryId ? db.delete('entries', transactionDoc.secondEntryId) : null
  ]);

  await Promise.all([
    recalcBalance(transactionDoc.accountId),
    transactionDoc.secondAccountId ? recalcBalance(transactionDoc.secondAccountId) : null
  ]);

  accounts.set(await getAccounts());
}

export async function updateTransaction(
  prevTransactionDoc: TransactionDoc,
  newParams: TransactionParams
) {
  const [prevEntryDoc, prevSecondEntryDoc] = await Promise.all([
    db.get('entries', prevTransactionDoc.entryId),
    prevTransactionDoc.secondEntryId ? db.get('entries', prevTransactionDoc.secondEntryId) : null
  ]);

  const [transactionDoc, entryDoc, secondEntryDoc] = makeTransactionDocs(
    newParams,
    prevTransactionDoc.id,
    prevEntryDoc.id,
    prevSecondEntryDoc ? prevSecondEntryDoc.id : nanoid(5)
  );

  await Promise.all([
    db.put('transactions', transactionDoc),
    db.put('entries', entryDoc),
    secondEntryDoc
      ? prevSecondEntryDoc
        ? db.put('entries', secondEntryDoc)
        : db.add('entries', secondEntryDoc)
      : prevSecondEntryDoc
      ? db.delete('entries', prevSecondEntryDoc.id)
      : null
  ]);

  const [changed1, changed2] = await Promise.all([
    recalcBalance(transactionDoc.accountId),
    transactionDoc.secondAccountId ? recalcBalance(transactionDoc.secondAccountId) : null,
    prevTransactionDoc.secondAccountId &&
    prevTransactionDoc.secondAccountId !== newParams.secondAccountId
      ? recalcBalance(prevTransactionDoc.secondAccountId)
      : null
  ]);

  if (changed1 || changed2) {
    accounts.set(await getAccounts());
  }
}

export function getAccountGroups() {
  return db.getAllFromIndex('accountGroups', 'title');
}

export function getCategories() {
  return db.getAllFromIndex('categories', 'title');
}

export function getCurrencies() {
  return db.getAll('currencies');
}

export function getSettings() {
  return db.getAll('settings');
}

export async function getRates(): Promise<Record<string, number>> {
  const rateDocs = await db.getAll('rates');
  return rateDocs.reduce((acc, rateDoc) => {
    acc[rateDoc.code] = rateDoc.rate;
    return acc;
  }, {});
}

export async function getEntries(accountId: string, reverse = true) {
  const entryDocs = await db.getAllFromIndex('entries', 'accountId', accountId);
  return entryDocs.sort((a, b) => {
    if (a.timestamp < b.timestamp) {
      return reverse ? 1 : -1;
    } else if (a.timestamp > b.timestamp) {
      return reverse ? -1 : 1;
    } else {
      return 0;
    }
  });
}

export function getTransaction(id: string) {
  return db.get('transactions', id);
}

/* creating docs */

export async function createAccountGroup(title: string, currencyCode: string) {
  await db.put('accountGroups', {
    id: nanoid(5),
    currencyCode,
    title
  });
  accountGroups.set(await getAccountGroups());
}

export async function updateAccountGroup(accountGroupDoc: AccountGroupDoc) {
  await db.put('accountGroups', accountGroupDoc);
  accountGroups.set(await getAccountGroups());
}

export async function createAccount(title: string, groupId: string, currencyCode: string) {
  await db.put('accounts', {
    id: nanoid(5),
    title,
    groupId,
    currencyCode,
    balance: 0
  });
  accounts.set(await getAccounts());
}

export async function createCategory(title: string, subtitle: string) {
  await db.put('categories', {
    id: nanoid(5),
    title,
    subtitle
  });
  categoires.set(await getCategories());
}

export async function updateSettings(settingsDoc: SettingsDoc) {
  await db.put('settings', settingsDoc);
}

export async function updateRates(rateDocs: RateDoc[], baseCurrencyCode: string) {
  const newRates: Record<string, number> = {};
  await db.delete('rates', baseCurrencyCode);
  await Promise.all(
    rateDocs.map((doc) => {
      newRates[doc.code] = doc.rate;
      return db.put('rates', doc);
    })
  );
  rates.set(newRates);
}

export async function updateCategory(categoryDoc: CategoryDoc) {
  await db.put('categories', categoryDoc);
  categoires.set(await getCategories());
}

export async function createCurrency(code: string, title: string) {
  await db.put('currencies', {
    code,
    title
  });
  currencies.set(await getCurrencies());
}

export async function updateCurrency(currencyDoc: CurrencyDoc) {
  await db.put('currencies', currencyDoc);
  currencies.set(await getCurrencies());
}

export async function renameAccountGroup(id: string, title: string) {
  const doc = await db.get('accountGroups', id);
  await db.put('accountGroups', {
    ...doc,
    title
  });
  accountGroups.set(await getAccountGroups());
}

export function makeTransactionDocs(
  {
    kind,
    accountId,
    timestamp,
    categoryId,
    secondAccountId,
    secondAmount,
    amount,
    comment,
    reconciled
  }: TransactionParams,
  transactionId: string,
  entryId: string,
  secondEntryId?: string
): [TransactionDoc, EntryDoc, EntryDoc?] {
  const entryDoc: EntryDoc = {
    id: entryId,
    timestamp,
    accountId,
    ...(categoryId ? { categoryId } : {}),
    transactionId,
    comment,
    amount: kind === TransactionKind.Income ? amount : -amount,
    total: 0,
    ...(reconciled ? { reconciled } : {})
  };

  if (kind === TransactionKind.Transfer) {
    const secondEntryDoc: EntryDoc = {
      id: secondEntryId,
      timestamp,
      accountId: secondAccountId,
      transactionId,
      comment,
      amount: secondAmount || amount,
      total: 0,
      ...(reconciled ? { reconciled } : {})
    };

    const transactionDoc: TransactionDoc = {
      id: transactionId,
      kind,
      timestamp,
      accountId,
      secondAccountId,
      amount,
      ...(secondAmount ? { secondAmount } : {}),
      comment,
      entryId: entryDoc.id,
      secondEntryId: secondEntryDoc.id,
      ...(reconciled ? { reconciled } : {})
    };
    return [transactionDoc, entryDoc, secondEntryDoc];
  } else {
    const transactionDoc: TransactionDoc = {
      id: transactionId,
      kind,
      timestamp,
      accountId,
      ...(categoryId ? { categoryId } : {}),
      amount,
      comment,
      entryId: entryDoc.id,
      ...(reconciled ? { reconciled } : {})
    };
    return [transactionDoc, entryDoc];
  }
}

export async function recalcBalance(accountId: string) {
  const entries = await getEntries(accountId, false);
  let total = 0;
  for (const entry of entries) {
    total += entry.amount;
    if (entry.total !== total) {
      await db.put('entries', { ...entry, total });
    }
  }
  const account = await getAccount(accountId);
  if (account.balance !== total) {
    await db.put('accounts', { ...account, balance: total });
    return true;
  }
  return false;
}

export async function createTransaction(params: TransactionParams) {
  const tx = db.transaction(['entries', 'transactions'], 'readwrite');
  const entriesStore = tx.objectStore('entries');
  const transactionsStore = tx.objectStore('transactions');

  const [transactionDoc, entryDoc, secondEntryDoc] = makeTransactionDocs(
    params,
    nanoid(5),
    nanoid(5),
    nanoid(5)
  );

  await Promise.all([
    transactionsStore.add(transactionDoc),
    entriesStore.add(entryDoc),
    ...(secondEntryDoc ? [entriesStore.add(secondEntryDoc)] : []),
    tx.done
  ]);

  const [changed1, changed2] = await Promise.all([
    recalcBalance(transactionDoc.accountId),
    transactionDoc.secondAccountId ? recalcBalance(transactionDoc.secondAccountId) : false
  ]);
  if (changed1 || changed2) {
    accounts.set(await getAccounts());
  }
}

export async function renameAccount(id: string, title: string) {
  const doc = await db.get('accounts', id);
  await db.put('accounts', {
    ...doc,
    title
  });
}

export async function loadData() {
  const [accountsDocs, accountGroupDocs, categoryDocs, currencyDocs, settingsDocs, savedRates] =
    await Promise.all([
      getAccounts(),
      getAccountGroups(),
      getCategories(),
      getCurrencies(),
      getSettings(),
      getRates()
    ]);

  currencies.set(currencyDocs);
  accountGroups.set(accountGroupDocs);
  accounts.set(accountsDocs);
  categoires.set(categoryDocs);
  settings.set(settingsDocs);
  const baseCode = getBaseCurrency(settingsDocs);
  baseCurrencyCode.set(baseCode);
  delete savedRates[baseCode];
  rates.set(savedRates);

  /* 
  console.log('RUB in USD:', getCurrencyRate('USD', 'RUB'));
  console.log('USD in RUB:', getCurrencyRate('RUB', 'USD'));
  console.log('RUB in KZT:', getCurrencyRate('KZT', 'RUB'));
  console.log('KZT in RUB:', getCurrencyRate('RUB', 'KZT'));
  console.log('USD in KZT:', getCurrencyRate('KZT', 'USD'));
  console.log('KZT in USD:', getCurrencyRate('USD', 'KZT')); 
  */
}

export function getBaseCurrency(settingDocs: SettingsDoc[]) {
  for (const settingsDoc of settingDocs) {
    if (settingsDoc.name === baseCurrencyName) {
      return settingsDoc.value;
    }
  }

  return '';
}

async function initData() {
  await dbPromise;
  await loadData();
}

export const initTask = initData();

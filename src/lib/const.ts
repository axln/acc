import { TransactionKind } from '~/lib/db';

export const transactionKinds = [
  {
    value: TransactionKind.Expense,
    title: 'Expense'
  },
  {
    value: TransactionKind.Income,
    title: 'Income'
  },
  {
    value: TransactionKind.Transfer,
    title: 'Transfer'
  }
];

const RUB_KZT = 4.78;
const USD_KZT = 461.43;
const USD_RUB = 96.62;

export const currencyRates = {
  KZT: {
    RUB: 1 / RUB_KZT,
    USD: 1 / USD_KZT
  },
  RUB: {
    USD: 1 / USD_RUB,
    KZT: RUB_KZT
  },
  USD: {
    KZT: USD_KZT,
    RUB: USD_RUB
  }
};

export const baseCurrency = 'RUB';

export const baseCurrencyName = 'baseCurrencyCode';

export const basepath = '/acc/dist';

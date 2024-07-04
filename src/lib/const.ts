import { TransactionKind } from '~/lib/enum';

export const transactionKinds = [
  {
    value: TransactionKind.Expense,
    title: 'Expense'
  },
  {
    value: TransactionKind.Transfer,
    title: 'Transfer'
  },
  {
    value: TransactionKind.Income,
    title: 'Income'
  }
];

export const baseCurrencyName = 'baseCurrencyCode';

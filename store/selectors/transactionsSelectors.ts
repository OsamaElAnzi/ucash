import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { CashItem } from '../types/Transaction';

const parseDenomination = (denomination: string): number => {
  if (denomination.includes('c')) {
    return Number(denomination.replace('c', '')) / 100;
  }
  return Number(denomination.replace('€', ''));
};

const isCoin = (value: number): boolean => value < 5;

const selectTransactions = (state: RootState) =>
  state.transactions.transactions;

export const selectCashOverview = createSelector(
  [selectTransactions],
  (transactions) => {
    const cashMap = new Map<string, number>();

    transactions.forEach(tx => {
      tx.cash.forEach((item: CashItem) => {
        cashMap.set(
          item.denomination,
          (cashMap.get(item.denomination) || 0) + item.count
        );
      });
    });

    const cashItems = Array.from(cashMap.entries()).map(
      ([denomination, count]) => ({
        denomination,
        value: parseDenomination(denomination),
        count,
      })
    );

    return {
      coins: cashItems.filter(c => isCoin(c.value)),
      bills: cashItems.filter(c => !isCoin(c.value)),
    };
  }
);
